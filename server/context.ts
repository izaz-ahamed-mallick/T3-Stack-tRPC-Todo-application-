import { prisma } from "@/prisma/prismaClient";

/**
 * Context Factory Function
 * Runs on every request to generate a new context object.
 */
export const createContext = async () => {
    return { prisma }; // Return an empty object for now (you can add auth, db, etc.)
};

// Infer the context type for tRPC
export type Context = Awaited<ReturnType<typeof createContext>>;
