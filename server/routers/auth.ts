import { TRPCError } from "@trpc/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const authRouter = router({
    signup: publicProcedure
        .input(
            z.object({
                email: z.string().email(),
                password: z
                    .string()
                    .min(8, "Password must be at least 8 characters"),
                name: z.string().optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { email, password, name } = input;

            // ✅ Use ctx.prisma directly
            const existingUser = await ctx.prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "User already exists",
                });
            }

            const hashedPassword = await hash(password, 10);
            const newUser = await ctx.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                },
            });

            return { message: "User created successfully", user: newUser };
        }),
});
