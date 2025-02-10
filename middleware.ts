import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    const isAuthPage = pathname.startsWith("/auth");

    if (isAuthPage || pathname === "/") {
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/todo/:path*", "/settings"],
};
