"use client";

import { SessionProvider } from "next-auth/react";

import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <AuthWrapper>{children}</AuthWrapper>
        </SessionProvider>
    );
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const hideSidebarRoutes = ["/auth/login", "/auth/signup", "/"];
    const shouldShowSidebar = !hideSidebarRoutes.includes(pathname);

    return (
        <div className="flex">
            {shouldShowSidebar && <Sidebar />}
            <main className="flex-1  max-h-screen overflow-y-auto noScrollBar">
                {children}
            </main>
        </div>
    );
}
