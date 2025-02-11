"use client";

import { SessionProvider, useSession } from "next-auth/react";

import Sidebar from "./Sidebar";

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
    const { data: session } = useSession();

    return (
        <div className="flex">
            {session && <Sidebar />}
            <main className="flex-1 max-h-screen overflow-y-auto noScrollBar">
                {children}
            </main>
        </div>
    );
}
