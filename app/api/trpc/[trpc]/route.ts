import { createContext } from "@/server/context";
import { appRouter } from "@/server/root";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: "/api/trpc", // This could be left as is if you're using dynamic routing with Next.js App Router
        req,
        router: appRouter,
        createContext,
    });

export { handler as POST, handler as GET };
