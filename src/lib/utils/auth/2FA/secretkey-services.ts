'use server';

import { secretKeyStore } from './secretkey-store';
import * as base32 from "hi-base32";
import { cookies } from 'next/headers';
import speakeasy from "speakeasy";

export async function setSecretKey(email: string, secretKey: string) {
    secretKeyStore.set(email, secretKey);
}

export async function verifySecretKey(token: string, _secretKey?: string) {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("auth-data")?.value;
    const data = cookie ? JSON.parse(cookie) : {};
    const email = "email" in data ? data.email as string : "";

    const storedSecretKey = secretKeyStore.get(email);
    console.log(storedSecretKey, secretKeyStore);
    const secretBytes = base32.decode.asBytes(_secretKey ?? storedSecretKey ?? "");
    const secret = Buffer.from(Uint8Array.from(secretBytes)).toString("hex");
    console.log(secret);
    return speakeasy.totp.verify({
        secret,
        encoding: "hex",
        token,
        window: 6,
    });

}
