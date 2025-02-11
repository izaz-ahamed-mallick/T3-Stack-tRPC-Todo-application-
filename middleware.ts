import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });

    console.log("Middleware Token:", token);

    const { pathname } = req.nextUrl;
    const isAuthPage = pathname.startsWith("/auth");

    if (isAuthPage || pathname === "/") {
        return NextResponse.next();
    }

    // ✅ Check if user is authenticated
    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // ✅ Restrict `/settings` to admins only
    if (pathname.startsWith("/settings") && token.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url)); // Redirect to home if not admin
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/todo/:path*", "/settings"],
};
