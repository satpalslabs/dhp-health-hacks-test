"use server"

import { cookies } from "next/headers";
import { getActiveENV } from "../../environment/cookie-services";
import { User } from "@/types";
import { setSecretKey } from "./secretkey-services";
// Checks if 2FA is enabled for a given user
export async function is2FAEnabled(user: User) {
    // Get the cookies from the request
    const cookieStore = await cookies();

    // Retrieve the "2FA_EnabledUsers" cookie value
    const users2FA = cookieStore.get("2FA_EnabledUsers")?.value;

    // Get the current active environment
    const environment = await getActiveENV();

    // Initialize parsedData as an empty array
    let parsedData = [];
    // Parse the cookie value if it exists, otherwise keep as empty array
    parsedData = users2FA ? JSON.parse(users2FA) : [];

    // Find the index of the user in the parsed data for the current environment
    const existingUser = parsedData?.findIndex(
        (i: { environment: string, email: string }) =>
            i.email == user.email && environment == i.environment
    );

    // If user is not found, return 2FA as disabled
    if (existingUser === -1) {
        return { enabled: false, secretKey: "" };
    }

    // Extract 2FA status and secret key for the user
    const data = parsedData[existingUser];

    setSecretKey(data.email, data.secretKey)

    // Return the 2FA status and secret key
    return { enabled: !!data.enabled2FA, secretKey: data.secretKey || "" };
}