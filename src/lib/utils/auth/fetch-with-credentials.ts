import { NextRequest, NextResponse } from "next/server";
import { SignInResponse } from "@/types";
import { getAccessToken, getActiveEnvironment, getRefreshToken } from "./get-cookies";
import { saveUserTokens } from "./save-tokens";
import { getActiveENV } from "../environment/cookie-services";
import { getConfigObject } from "@/lib/utils/auth/get-config-object";


export default async function fetchWithCredentials(
    path: string,
    init: RequestInit | undefined,
    req: NextRequest
): Promise<Response> {
    const accessToken = getAccessToken(req);
    const refreshToken = getRefreshToken(req);
    const activeEnv = getActiveEnvironment(req);

    if (!refreshToken || !accessToken) {
        return NextResponse.json({ error: "No credentials provided" }, { status: 401 });
    }

    const requestToFetch = makeFetch(path, accessToken, init);
    let res = await requestToFetch();

    if (res.status === 401 || res.status === 403) {
        const newTokens = await refresh(refreshToken);
        if ("token" in newTokens) {
            saveUserTokens({ ...newTokens, environment: activeEnv });
            res = await requestToFetch(newTokens.token);
        } else {
            return NextResponse.json(newTokens, { status: res.status });
        }
    }

    return res;
}

function makeFetch(
    path: string,
    accessToken: string,
    init: RequestInit | undefined
): (newAccessToken?: string) => Promise<Response> {
    return (newAccessToken?: string) => {
        return fetch(path, {
            ...init,
            headers: {
                ...(init && init.headers && "Content-Type" in init.headers && init?.headers?.['Content-Type'] ? { 'Content-Type': init.headers['Content-Type'] } : {}),
                Authorization: `Bearer ${newAccessToken ?? accessToken}`,
            },
        });
    };
}

export async function refresh(refreshToken: string): Promise<SignInResponse> {
    const activeEnv = await getActiveENV()
    const configObject = getConfigObject(activeEnv ?? "experimental")
    const res = await fetch(`${configObject.BASE_URL}/auth/refresh-new`, {
        headers: {
            Authorization: `Bearer ${refreshToken} `,
        },
    });
    try {
        if (!res.ok) {
            throw { error: "Refresh Token Api failed", status: res.status };
        }
        return await res.json();
    } catch (err) {
        throw { error: `Refresh Token Api failed: ${err}`, status: res.status };

    }
}
