import { appRouter } from "@/server/root";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

export const runtime = "edge";

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext: () => ({}), // You can extend this if needed
    });

export { handler as POST, handler as GET };
