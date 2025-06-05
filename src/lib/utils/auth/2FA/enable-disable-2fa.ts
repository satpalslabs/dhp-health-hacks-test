"use server"

import { cookies } from "next/headers";
import { getActiveENV } from "../../environment/cookie-services";

export async function enableDisable2FA(secretKey: string, enable: boolean) {
    try {
        const cookieStore = await cookies();
        //get all cookies

        const users2FA = cookieStore.get("2FA_EnabledUsers")?.value;
        //get users who enabled the 2FA authentication

        const auth_data = cookieStore.get("auth-data")?.value;
        //get current user

        const user = auth_data ? JSON.parse(auth_data) : {}

        const environment = await getActiveENV()
        //get the active Environment to filter the users

        let parsedData = [];

        parsedData = users2FA ? JSON.parse(users2FA) : [];
        //if doesn't have a cookie with the name of "2FA_EnabledUsers" the it will be empty array 

        const existingUser = parsedData?.findIndex((i: { environment: string, email: string }) => i.email == user.email && environment == i.environment);
        //Get index if user is already exist

        let mergedData;

        const existingUserData = parsedData[existingUser];
        //Get user data if user is already exist and stored in temp variable to use again

        parsedData.splice(existingUser, 1);
        // Delete if already exist

        if (enable) {
            if (existingUser !== -1) {
                // Merge with new 2FA enable user and added a secret key and enable 2FA for current user.
                mergedData = [...parsedData, { ...existingUserData, enabled2FA: true, secretKey }];
            } else {
                mergedData = [...parsedData, { ...user, enabled2FA: true, secretKey }];
            }

        }
        // if user wants to disable 2Fa then delete it from the cookie

        cookieStore.set("2FA_EnabledUsers", JSON.stringify(mergedData), {
            httpOnly: true,
            path: "/",
        });

        // Stored the json into cookies.

    } catch (e) {
        console.warn("Failed to parse existing user-data:", e);
        throw e;
    }
}