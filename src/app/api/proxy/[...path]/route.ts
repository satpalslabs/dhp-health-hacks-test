// src/app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fetchWithCredentials from '@/lib/utils/auth/fetch-with-credentials';
import { redirect } from 'next/navigation';
import { getConfigObject } from "@/lib/utils/auth/get-config-object";

export const maxDuration = 60;

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '20mb',
        },
    },
};

export async function GET(req: NextRequest) {
    const path = req.nextUrl.pathname.replace(/^\/api\/proxy\//, '');
    const query = req.nextUrl.search;
    const activeEnv = req.cookies.get("active-env")?.value
    const configObject = getConfigObject(activeEnv ?? "experimental")
    const targetUrl = new URL(`${path}${query}`, configObject.BASE_URL).toString();
    const init: RequestInit = {
        method: 'GET',
        headers: {
            ...req.headers,
            "Content-Type": "application/json",
        },
    };

    const response = await fetchWithCredentials(targetUrl, init, req);
    if (response.status === 401) {
        redirect("/sign-in");
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await response.json();

    return NextResponse.json(json, {
        status: response.status,
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function POST(req: NextRequest) {
    const path = req.nextUrl.pathname.replace(/^\/api\/proxy\//, '');
    const query = req.nextUrl.search;
    const activeEnv = req.cookies.get("active-env")?.value
    // Staging environment is not supported for POST requests
    // This is a safeguard to prevent accidental POST requests in staging
    if (activeEnv == "staging") {
        return NextResponse.json(
            { error: "Staging environment is not supported for POST or Upload requests" },
            { status: 400 }
        );
    }
    const configObject = getConfigObject(activeEnv ?? "experimental")
    const targetUrl = new URL(`${path}${query}`, configObject.BASE_URL).toString();
    const contentType = req.headers.get('Content-Type');
    let body;
    const headers: Record<string, string> = {};

    if (contentType?.includes("multipart/form-data")) {
        body = await req.formData();
    } else {
        body = JSON.stringify(await req.json());
        headers['Content-Type'] = 'application/json';
    }
    const init: RequestInit = {
        method: 'POST',
        headers,
        body: body,
    };

    const response = await fetchWithCredentials(targetUrl, init, req);

    if (response.status === 401 || response.status === 403) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return response;
}

export async function PUT(req: NextRequest) {
    const path = req.nextUrl.pathname.replace(/^\/api\/proxy\//, '');
    const query = req.nextUrl.search;
    const activeEnv = req.cookies.get("active-env")?.value;
    // Staging environment is not supported for POST requests
    // This is a safeguard to prevent accidental POST requests in staging
    if (activeEnv == "staging") {
        return NextResponse.json(
            { error: "Staging environment is not supported for PUT requests" },
            { status: 400 }
        );
    }
    const configObject = getConfigObject(activeEnv ?? "experimental")
    const targetUrl = new URL(`${path}${query}`, configObject.BASE_URL).toString();
    const contentType = req.headers.get('Content-Type');
    let body;
    const headers: Record<string, string> = {};

    if (contentType?.includes("multipart/form-data")) {
        body = await req.formData();
    } else {
        body = JSON.stringify(await req.json());
        headers['Content-Type'] = 'application/json';
    }
    const init: RequestInit = {
        method: 'PUT',
        headers,
        body: body,
    };

    const upstreamResponse = await fetchWithCredentials(targetUrl, init, req);

    if (upstreamResponse.status === 401 || upstreamResponse.status === 403) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const text = await upstreamResponse.text();

    return new NextResponse(text, {
        status: upstreamResponse.status,
        headers: {
            "Content-Type": upstreamResponse.headers.get("Content-Type") || "application/json",
        },
    });
}


export async function DELETE(req: NextRequest) {
    const path = req.nextUrl.pathname.replace(/^\/api\/proxy\//, '');
    const activeEnv = req.cookies.get("active-env")?.value;
    // Staging environment is not supported for POST requests
    // This is a safeguard to prevent accidental POST requests in staging
    if (activeEnv == "staging") {
        return NextResponse.json(
            { error: "Staging environment is not supported for DELETE requests" },
            { status: 400 }
        );
    }
    const configObject = getConfigObject(activeEnv ?? "experimental")
    const targetUrl = new URL(path, configObject.BASE_URL).toString();

    const init: RequestInit = {
        method: 'DELETE',
        headers: {
            ...req.headers,
            "Content-Type": "application/json",
        },
    };

    const upstreamResponse = await fetchWithCredentials(targetUrl, init, req);

    if (upstreamResponse.status === 401 || upstreamResponse.status === 403) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const text = await upstreamResponse.text();

    return new NextResponse(text, {
        status: upstreamResponse.status,
        headers: {
            "Content-Type": upstreamResponse.headers.get("Content-Type") || "application/json",
        },
    });
}
