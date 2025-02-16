import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma/prismaClient";
import { getServerSession } from "next-auth";

export const createContext = async () => {
    const session = await getServerSession(authOptions);
    return { prisma, session };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
