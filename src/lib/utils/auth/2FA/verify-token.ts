"use server"

import * as base32 from "hi-base32";
import speakeasy from "speakeasy";
import secretKey from "./secret-key";


export async function verifySecretKey(token: string, _secretKey?: string) {
    console.log("get secretKEy", secretKey, _secretKey);

    const secretBytes = base32.decode.asBytes(_secretKey ?? secretKey.key);
    const secret = Buffer.from(Uint8Array.from(secretBytes)).toString("hex");
    return speakeasy.totp.verify({
        secret,
        encoding: "hex",
        token,
        window: 6,
    });

}