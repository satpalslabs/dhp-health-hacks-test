"use server"

import { cookies } from "next/headers";
import { ResponseWithEnv } from "../auth/save-tokens";

export async function getActiveENV() {
    const cookieStore = await cookies();
    // Try to read the existing auth-data cookie
    const activeEnv = cookieStore.get("active-env")?.value;
    return activeEnv
}

export async function getUserCredentials(environment: string): Promise<ResponseWithEnv | null> {
    let users = [];
    const cookieStore = await cookies();
    const cookieUsers = cookieStore.get('users')?.value;
    const activeEnv = environment
    users = cookieUsers ? JSON.parse(cookieUsers) as ResponseWithEnv[] : []
    const currentUser = users.find((user: ResponseWithEnv) => user.environment == activeEnv)
    if (currentUser) {
        const credentials = currentUser as ResponseWithEnv;
        return credentials
    }
    return null
}

export async function setActiveENV(env: string) {
    const cookieStore = await cookies();
    cookieStore.set("active-env", env);
}