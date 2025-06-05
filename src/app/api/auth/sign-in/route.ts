import { is2FAEnabled } from "@/lib/utils/auth/2FA/is2FA-enabled";
import { getConfigObject } from "@/lib/utils/auth/get-config-object";
import { set2FACredentials } from "@/lib/utils/auth/get-cookies";
import { SignInResponse, User } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import secretKeyStore from '@/lib/utils/auth/2FA/secretkey-store';

export async function POST(request: NextRequest) {
    const { email, password, environment } = await request.json();
    const options: RequestInit = {
        method: "POST",
        body: JSON.stringify({
            token: "string",
            tokenSecret: "string",
            email,
            password,
            provider: "email",
            authType: "LOGIN",
        }),
        headers: {
            "Content-Type": "application/json",
        },
    };
    // make the request to authenticate the user
    const configObject: {
        BASE_URL: string;
        STRAPI_BASE_URL: string;
        STRAPI_API_TOKEN: string
    } = getConfigObject(environment)

    const url = `${configObject.BASE_URL || ""}/auth/login`;

    const tokensResponse: SignInResponse = await fetch(
        url,
        options,
    ).then((res) => res.json());
    if ("error" in tokensResponse) {
        return Response.json({ ...tokensResponse, success: false });
    }

    const Is2FAEnabled = await is2FAEnabled(tokensResponse as unknown as User)

    const response = NextResponse.json(
        {
            ...tokensResponse,
            is2fa_enabled: Is2FAEnabled.enabled,
            secretKey: Is2FAEnabled.secretKey
        },
        {
            status: 200,
            headers: { "Content-Type": "application/json" }
        }
    );
    if (Is2FAEnabled.enabled) {
        secretKeyStore.set(email, Is2FAEnabled.secretKey);
    }
    await set2FACredentials(response, { ...tokensResponse, environment, step: Is2FAEnabled.enabled ? 3 : 1 });

    return response;
}


