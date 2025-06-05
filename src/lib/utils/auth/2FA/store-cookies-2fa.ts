"use server"

import { cookies } from "next/headers";

export async function deleteCookieForVerification() {
    const cookieStore = await cookies();
    cookieStore.delete("auth-data")
}
export async function confirmCookieForVerification() {
    const cookieStore = await cookies();
    const auth_data = cookieStore.get("auth-data")?.value;
    const data = auth_data ? JSON.parse(auth_data) : {}
    data["step"] = 2;
    cookieStore.set("auth-data", JSON.stringify(data))
}

