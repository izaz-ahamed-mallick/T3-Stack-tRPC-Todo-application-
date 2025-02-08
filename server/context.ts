// context.ts
import { prisma } from "@/prisma/prismaClient";

export const createContext = () => ({
    prisma,
});

export type Context = ReturnType<typeof createContext>;
