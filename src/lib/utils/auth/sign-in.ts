import { User } from "@/types";

export async function signIN(data: { email: string; password: string; environment: string }) {
    try {
        const response = await fetch("api/auth/sign-in", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: "",
                tokenSecret: "",
                email: data.email,
                password: data.password,
                provider: "email",
                authType: "LOGIN",
                environment: data.environment
            }),
        }).then(async (res) => await res.json());
        if ("error" in response) {
            throw new Error(response.message);
        }
        return { success: true, redirectTo: "/sign-in/verify-two-factor", user: { ...response, step: 1 } as User };
    } catch (error) {
        throw error
    }
}


