"use server"

import { cookies } from "next/headers";
import { SignInResponse } from "@/types";
import { redirect } from "next/navigation";

export interface ResponseWithEnv extends SignInResponse {
    environment: string
}

export async function saveUserTokens(data?: SignInResponse) {
    const cookieStore = await cookies();

    // Try to read the existing auth-data cookie
    const existingData = cookieStore.get("users")?.value;
    const auth_data = cookieStore.get("auth-data")?.value;
    const credentials = data ? data : auth_data ? JSON.parse(auth_data) : {}
    let parsedData = [];
    try {
        parsedData = existingData ? JSON.parse(existingData) : [];
    } catch (e) {
        console.warn("Failed to parse existing user-data:", e);
    }

    const existingEnvUser = parsedData.findIndex((i: { environment: string }) => i.environment == credentials.environment);
    let mergedData;
    if (existingEnvUser !== -1) {
        const existingUserData = parsedData[existingEnvUser];
        parsedData.splice(existingEnvUser, 1);
        // Merge with new credentials
        mergedData = [...parsedData, { ...existingUserData, ...credentials }];
    } else {
        // No existing user for this environment, just add new credentials
        mergedData = [...parsedData, credentials];
    }

    cookieStore.set("users", JSON.stringify(mergedData), {
        httpOnly: true,
        path: "/",
    });

    cookieStore.set("active-env", credentials.environment, {
        httpOnly: true,
        path: "/",
    });

}

export async function deleteUserTokens() {
    const cookieStore = await cookies();
    const activeEnv = cookieStore.get("active-env")?.value
    // Try to read the existing auth-data cookie
    const existingData = cookieStore.get("users")?.value;
    let parsedData = [];
    try {
        parsedData = existingData ? JSON.parse(existingData) : [];
    } catch (e) {
        console.warn("Failed to parse existing user-data:", e);
    }

    const existingEnvUser = parsedData.findIndex((i: { environment: string }) => i.environment == activeEnv);
    if (existingEnvUser != -1) {
        parsedData.splice(existingEnvUser, 1)
    }
    cookieStore.set("users", JSON.stringify(parsedData), {
        httpOnly: true,
        path: "/",
    });
    if (parsedData.length > 0) {
        cookieStore.set("active-env", parsedData[0].environment, {
            httpOnly: true,
            path: "/",
        });
        return null
    } else {
        redirect("/sign-in")
    }

}
