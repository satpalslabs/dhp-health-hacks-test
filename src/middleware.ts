import { NextResponse, type NextRequest } from 'next/server';
import staticAuthUsers from "@/app/sign-in/static-auth-data.json";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookies = request.cookies;

    // Extract email and password from cookies
    const email = cookies.get("email")?.value;
    const password = cookies.get("password")?.value;
    // Validate user authentication
    const authUser = staticAuthUsers.some(user => user.email === email && user.password === password);

    // Redirect logic
    if (pathname.startsWith("/sign-in")) {
        return authUser ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();
    }
    if (authUser && email && password) {
        const now = new Date();
        now.setHours(now.getHours() + 2); // Extend cookie expiry by 2 hours

        // Create a new response with updated cookies
        const response = NextResponse.next();

        response.cookies.set("email", email, { expires: now });
        response.cookies.set("password", password, { expires: now });

        return response;
    }

    return authUser ? NextResponse.next() : NextResponse.redirect(new URL("/sign-in", request.url));
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|.*\\.png$|.*\\.svg$|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
