import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma/prismaClient";
import { getServerSession } from "next-auth";
import type { NextApiRequest } from "next";

export const createContext = async ({ req }: { req: NextApiRequest }) => {
    const session = await getServerSession({ req, ...authOptions });
    return { prisma, session };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
