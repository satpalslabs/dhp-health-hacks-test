import { deleteCookieForVerification } from '@/lib/utils/auth/2FA/store-cookies-2fa';
import { refresh } from '@/lib/utils/auth/fetch-with-credentials';
import { getRefreshToken, getUserCredentials } from '@/lib/utils/auth/get-cookies';
import { saveUserTokens } from '@/lib/utils/auth/save-tokens';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const user = getUserCredentials(req);
        const refreshToken = getRefreshToken(req);

        if (!refreshToken || !user) {
            return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
        }

        const newTokens = await refresh(refreshToken);
        await deleteCookieForVerification()
        await saveUserTokens({ ...newTokens, environment: user.environment });
        return NextResponse.json({ user });
    } catch (error) {
        console.error("Auth check failed:", error);
        return NextResponse.json({ error: "An error occurred during authentication" }, { status: 500 });
    }
}

