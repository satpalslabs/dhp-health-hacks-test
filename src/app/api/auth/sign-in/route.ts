import { getConfigObject } from "@/lib/utils/auth/get-config-object";
import { saveUserTokens } from "@/lib/utils/auth/save-tokens";
import { SignInResponse } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
    const response = NextResponse.json(tokensResponse, {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });

    // Save the tokens in the cookie response
    await saveUserTokens({ ...tokensResponse, environment })

    return response;
}


