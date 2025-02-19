import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/prisma/prismaClient";
import { compare } from "bcryptjs";

import type { DefaultSession } from "next-auth";
import type { NextAuthOptions, User as NextAuthUser } from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        role: string;
        permissions: string[]; // Ensure permissions are treated as a string array
    }

    interface Session {
        user: User & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Include 'req' as second parameter
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid email or password");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error("User not found or signed up");
                }

                const isValidPassword = await compare(
                    credentials.password,
                    user.password
                );

                if (!isValidPassword) {
                    throw new Error("Incorrect password");
                }

                // ✅ Ensure the returned object matches the NextAuth User type
                const authUser: NextAuthUser = {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    permissions: (user.permissions as string[]) || [],
                };

                return authUser;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;

                const user = await prisma.user.findUnique({
                    where: { id: token.id },
                });

                session.user.permissions =
                    (user?.permissions as string[]) || [];
            }
            return session;
        },
    },
};
