import { NextRequest, NextResponse } from "next/server";
import { ResponseWithEnv } from "./save-tokens";

export function getUserCredentials(req: NextRequest): ResponseWithEnv | null {
    let users = [];
    const cookieUsers = req.cookies.get('users')?.value;
    const activeEnv = req.cookies.get('active-env')?.value;
    users = cookieUsers ? JSON.parse(cookieUsers) as ResponseWithEnv[] : []
    const currentUser = users.find((user: ResponseWithEnv) => user.environment == activeEnv)
    if (currentUser) {
        const credentials = currentUser as ResponseWithEnv;
        return credentials
    }
    return null
}

export function getAccessToken(req: NextRequest): string | null {
    let users = [];
    const cookieUsers = req.cookies.get('users')?.value;
    const activeEnv = req.cookies.get('active-env')?.value;
    users = cookieUsers ? JSON.parse(cookieUsers) as ResponseWithEnv[] : []
    const currentUser = users.find((user: ResponseWithEnv) => user.environment == activeEnv)
    return currentUser?.token ?? null;
}

export function getRefreshToken(req: NextRequest): string | null {
    let users = [];
    const cookieUsers = req.cookies.get('users')?.value;
    const activeEnv = req.cookies.get('active-env')?.value;
    users = cookieUsers ? JSON.parse(cookieUsers) as ResponseWithEnv[] : []
    const currentUser = users.find((user: ResponseWithEnv) => user.environment == activeEnv)
    return currentUser?.refreshToken ?? null;
}
export function getActiveEnvironment(req: NextRequest): string {
    let environment = req.cookies.get('active-env')?.value;
    environment = environment as string;
    return environment
}


export async function set2FACredentials(response: NextResponse, auth_data: ResponseWithEnv) {
    const user: ResponseWithEnv | null = auth_data;
    response.cookies.set("auth-data", user ? JSON.stringify(user) : "");
    response.cookies.set("active-env", user.environment);
    return user;
}