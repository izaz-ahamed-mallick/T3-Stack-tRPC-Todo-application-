"use client";

import { trpc } from "@/utils/trpcClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import SuperJSON from "superjson";

const TRPCProvider = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient());

    const trpcClient = trpc.createClient({
        links: [
            httpBatchLink({
                url: `${process.env.NEXT_PUBLIC_API_URL}/api/trpc`,
                transformer: SuperJSON, // ✅ Transformer now belongs here!
            }),
        ],
    });

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    );
};

export default TRPCProvider;
