import { TRPCError } from "@trpc/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

import { randomBytes } from "crypto";
import { addMinutes } from "date-fns";
import { sendResetEmail } from "@/utils/sendResetEmail";

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

    forgotpassword: publicProcedure
        .input(z.object({ email: z.string().email() }))
        .mutation(async ({ input, ctx }) => {
            const user = await ctx.prisma.user.findUnique({
                where: { email: input.email },
            });
            if (!user) return { success: true };
            const token = randomBytes(32).toString("hex");
            const expiry = addMinutes(new Date(), 5);

            await ctx.prisma.user.update({
                where: { email: input.email },
                data: {
                    resetTokenExpiry: expiry,
                    resetToken: token,
                },
            });
            await sendResetEmail(user.email, token);
            return { success: true };
        }),

    resetpassword: publicProcedure
        .input(z.object({ token: z.string(), newPassword: z.string().min(8) }))
        .mutation(async ({ input, ctx }) => {
            const user = await ctx.prisma.user.findFirst({
                where: {
                    resetToken: input.token,
                    resetTokenExpiry: { gte: new Date() },
                },
            });
            if (!user) throw new Error("Invalid or expired token.");
            const hashedPassword = await hash(input.newPassword, 10);

            await ctx.prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    resetToken: null,
                    resetTokenExpiry: null,
                },
            });
            return { success: true };
        }),
});
