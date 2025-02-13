import { z } from "zod";
import { adminProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const adminRouter = router({
    getUsers: adminProcedure.query(({ ctx }) => {
        return ctx.prisma.user.findMany({
            include: {
                todos: true,
                activityLogs: true,
            },
        });
    }),

    updateUserRole: adminProcedure
        .input(
            z.object({
                userId: z.string(),
                role: z.enum(["user", "admin"]),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const updatedUser = await ctx.prisma.user.update({
                where: { id: input.userId },
                data: { role: input.role },
            });

            const userId = ctx.session?.user?.id;
            if (!userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "User not found",
                });
            }
            await ctx.prisma.activityLog.create({
                data: {
                    userId,
                    action: `Updated role of ${updatedUser.email} to ${input.role}`,
                },
            });

            return updatedUser;
        }),

    deleteTask: adminProcedure
        .input(z.object({ taskId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const deletedTask = await ctx.prisma.todo.delete({
                where: { id: input.taskId },
            });

            const userId = ctx.session?.user?.id;
            if (!userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "User not found",
                });
            }

            await ctx.prisma.activityLog.create({
                data: {
                    userId,
                    action: `Deleted task with ID: ${input.taskId}`,
                },
            });

            return deletedTask;
        }),

    getActivityLogs: adminProcedure.query(({ ctx }) => {
        return ctx.prisma.activityLog.findMany({
            orderBy: { timestamp: "desc" },
        });
    }),
});
