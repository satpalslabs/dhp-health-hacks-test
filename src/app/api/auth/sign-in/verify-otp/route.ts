import { NextRequest, NextResponse } from "next/server";
import * as base32 from "hi-base32";
import speakeasy from "speakeasy";
import { deleteSecretKey } from "@/lib/utils/auth/2FA/secretkey-services";

export async function POST(request: NextRequest) {
    const { secretKey, otp } = await request.json();
    const cookie = request.cookies.get("auth-data")?.value;
    const data = cookie ? JSON.parse(cookie) : {};
    const email = "email" in data ? data.email as string : "";

    const storedSecretKey = secretKeyStore.get(email);
    console.log(storedSecretKey, secretKeyStore);
    const secretBytes = base32.decode.asBytes(secretKey ?? storedSecretKey ?? "");
    const secret = Buffer.from(Uint8Array.from(secretBytes)).toString("hex");
    console.log(secret);
    await deleteSecretKey(email)
    const verified = speakeasy.totp.verify({
        secret,
        encoding: "hex",
        token: otp,
        window: 6,
    });
    return NextResponse.json({ verified })
}


