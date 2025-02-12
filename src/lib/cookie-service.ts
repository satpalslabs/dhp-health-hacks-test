"use server"

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import staticAuthUsers from "@/app/sign-in/static-auth-data.json";

export async function cookieHandler(data: { email: string, password: string }) {
    const cookieStore = await cookies()
    const now = new Date();
    now.setHours(now.getHours() + 2)
    cookieStore.set(
        {
            name: 'email',
            value: data.email,
            expires: now
        })
    // cookieStore.set('password', data.password)
    cookieStore.set(
        {
            name: 'password',
            value: data.password,
            expires: now
        })

    redirect("/articles")

}

export async function deleteCookie() {
    const cookieStore = await cookies();
    ["email", "password"].forEach((key) => cookieStore.delete(key));
    redirect("/sign-in")
}
export async function auth() {
    const cookieStore = (await cookies()).getAll();

    // Create a map for fast lookup of cookies
    const cookieMap = new Map(cookieStore.map(({ name, value }) => [name, value]));

    const email = cookieMap.get("email");
    const password = cookieMap.get("password");

    if (!email || !password) return null; // Return null if email or password is missing

    // Find the user by matching email and password
    const authUser = staticAuthUsers.find(user => user.email === email && user.password === password);

    return authUser;
}
