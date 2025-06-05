"use server"

import speakeasy from "speakeasy";

export async function generateSecretKey() {
    return speakeasy.generateSecret({
        name: "DHP Admin App",
    })
}