import { z } from "zod";
import { router, subadminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const adminRouter = router({
    getUsers: subadminProcedure.query(({ ctx }) => {
        return ctx.prisma.user.findMany({
            include: {
                todos: true,
                activityLogs: true,
            },
        });
    }),

    updateUserRole: subadminProcedure
        .input(
            z.object({
                userId: z.string(),
                role: z.enum(["user", "subadmin", "admin"]),
                permissions: z.array(z.string()),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session?.user?.id) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Unauthorized request",
                });
            }

            const currentUser = await ctx.prisma.user.findUnique({
                where: { id: ctx.session.user.id },
            });

            if (!currentUser) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }

            // Only admin can change roles
            if (input.role === "admin" && currentUser.role !== "admin") {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Only admins can promote users to admin.",
                });
            }

            // Allow Subadmin to only toggle between "user" and "subadmin"
            if (currentUser.role === "subadmin") {
                if (input.role !== "user" && input.role !== "subadmin") {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message:
                            "Subadmins can only assign User or Subadmin roles.",
                    });
                }
            }

            const updatedUser = await ctx.prisma.user.update({
                where: { id: input.userId },
                data: {
                    role: input.role,
                    permissions: input.permissions,
                },
            });

            await ctx.prisma.activityLog.create({
                data: {
                    userId: ctx.session.user.id,
                    action: `Updated role of ${updatedUser.email} to ${
                        input.role
                    } with permissions: ${input.permissions.join(", ")}`,
                },
            });

            return updatedUser;
        }),

    deleteTask: subadminProcedure
        .input(z.object({ taskId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session?.user?.id) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Unauthorized request",
                });
            }
            const existingTask = await ctx.prisma.todo.findUnique({
                where: { id: input.taskId },
            });

            if (!existingTask) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Task not found",
                });
            }
            await ctx.prisma.todo.delete({ where: { id: input.taskId } });

            await ctx.prisma.activityLog.create({
                data: {
                    userId: ctx.session.user.id,
                    action: `Deleted task with ID: ${input.taskId}`,
                },
            });
            const userId = ctx.session?.user?.id;
            if (!userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "User not found",
                });
            }
            return { message: "Task deleted successfully" };
        }),

    getUserPermissions: subadminProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.findUnique({
                where: { id: input.userId },
                select: { permissions: true },
            });

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }

            return user.permissions;
        }),

    getActivityLogs: subadminProcedure.query(({ ctx }) => {
        return ctx.prisma.activityLog.findMany({
            orderBy: { timestamp: "desc" },
        });
    }),
});
