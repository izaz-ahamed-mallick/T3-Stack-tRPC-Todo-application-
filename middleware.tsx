import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });

    console.log("Middleware Token:", token);

    const { pathname } = req.nextUrl;
    const isAuthPage = pathname.startsWith("/auth");

    // ✅ Allow access to auth pages even if user is NOT authenticated
    if (isAuthPage) {
        if (token) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    }

    // ✅ Protect all other routes (require authentication)
    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (pathname.startsWith("/admin") && token.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url)); // Redirect non-admins to home
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/todo/:path*", "/settings", "/auth/:path*", "/admin/:path*"],
};
