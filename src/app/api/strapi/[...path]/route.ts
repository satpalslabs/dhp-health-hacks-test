import { NextRequest, NextResponse } from "next/server";
import { getConfigObject } from "@/lib/utils/auth/get-config-object";


export async function POST(req: NextRequest) {
    const path = req.nextUrl.pathname.replace(/^\/api\/strapi\//, '');
    const query = req.nextUrl.search;
    const activeEnv = req.cookies.get("active-env")?.value
    const configObject = getConfigObject(activeEnv ?? "experimental")
    const targetUrl = new URL(`/api/${path}${query}`, configObject.STRAPI_BASE_URL).toString();
    const body = JSON.stringify(await req.json());
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${configObject.STRAPI_API_TOKEN}`,
    };
    const response = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body,
    });

    if (response.status === 401) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return response;
}

export async function PUT(req: NextRequest) {
    const path = req.nextUrl.pathname.replace(/^\/api\/strapi\//, '');
    const query = req.nextUrl.search;
    const activeEnv = req.cookies.get("active-env")?.value
    const configObject = getConfigObject(activeEnv ?? "experimental")
    const targetUrl = new URL(`/api/${path}${query}`, configObject.STRAPI_BASE_URL).toString();
    const body = JSON.stringify(await req.json());
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${configObject.STRAPI_API_TOKEN}`,
    };

    const response = await fetch(targetUrl, {
        method: 'PUT',
        headers,
        body,
    });

    if (response.status === 401) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return response;
}


export async function GET(req: NextRequest) {
    const path = req.nextUrl.pathname.replace(/^\/api\/strapi\//, '');
    const query = req.nextUrl.search;
    const activeEnv = req.cookies.get("active-env")?.value
    const configObject = getConfigObject(activeEnv ?? "experimental")
    const targetUrl = new URL(`/api/${path}${query}`, configObject.STRAPI_BASE_URL).toString();
    const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
            // ...req.headers,
            'Authorization': `Bearer ${configObject.STRAPI_API_TOKEN}`,
        },
    });

    if (response.status === 401) {
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

export async function DELETE(req: NextRequest) {
    const path = req.nextUrl.pathname.replace(/^\/api\/strapi\//, '');
    const activeEnv = req.cookies.get("active-env")?.value
    const configObject = getConfigObject(activeEnv ?? "experimental")
    const targetUrl = new URL(`/api/${path}`, configObject.STRAPI_BASE_URL).toString();

    const init: RequestInit = {
        method: 'DELETE',
        headers: {
            ...req.headers,
            "Content-Type": "application/json",
            'Authorization': `Bearer ${configObject.STRAPI_API_TOKEN}`,
        },
    };

    const upstreamResponse = await fetch(targetUrl, init);
    return upstreamResponse;
}