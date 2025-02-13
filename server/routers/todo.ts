import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { Status } from "@prisma/client";

export const todosRouter = router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        return ctx.prisma.todo.findMany({
            where: { userId: ctx.user.id },
            orderBy: { createdAt: "desc" },
        });
    }),

    create: protectedProcedure
        .input(
            z.object({
                title: z.string().min(1),
                description: z.string().min(1),
                tags: z.string().min(1),
                deadline: z.string().datetime(),
                reminder_time: z.string().datetime(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const newTodo = await ctx.prisma.todo.create({
                data: {
                    title: input.title,
                    description: input.description,
                    status: Status.todo,
                    completed: false,
                    userId: ctx.user.id,
                    tags: input.tags,
                    deadline: new Date(input.deadline),
                    reminder_time: new Date(input.reminder_time),
                },
            });

            await ctx.prisma.activityLog.create({
                data: {
                    userId: ctx.user.id,
                    action: `${
                        ctx.user.name || ctx.user.email
                    } created a new task: ${newTodo.title}`,
                },
            });

            return newTodo;
        }),

    updateStatus: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                status: z.enum(["todo", "inProgress", "completed"]),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const updatedTodo = await ctx.prisma.todo.update({
                where: { id: input.id },
                data: {
                    status: input.status as Status,
                    completed: input.status === "completed",
                },
            });

            await ctx.prisma.activityLog.create({
                data: {
                    userId: ctx.user.id,
                    action: `${ctx.user.name || ctx.user.email} updated task "${
                        updatedTodo.title
                    }" status to ${input.status}`,
                },
            });

            return updatedTodo;
        }),

    toggleComplete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const currentTodo = await ctx.prisma.todo.findUnique({
                where: { id: input.id },
            });

            if (!currentTodo) {
                throw new Error("Todo not found");
            }

            const newStatus =
                currentTodo.completed || currentTodo.status === "completed"
                    ? Status.todo
                    : Status.completed;

            const updatedTodo = await ctx.prisma.todo.update({
                where: { id: input.id },
                data: {
                    completed: !currentTodo.completed,
                    status: newStatus,
                },
            });

            await ctx.prisma.activityLog.create({
                data: {
                    userId: ctx.user.id,
                    action: `${ctx.user.name || ctx.user.email} marked task "${
                        updatedTodo.title
                    }" as ${
                        updatedTodo.completed ? "completed" : "not completed"
                    }`,
                },
            });

            return updatedTodo;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const deletedTodo = await ctx.prisma.todo.delete({
                where: { id: input.id },
            });

            await ctx.prisma.activityLog.create({
                data: {
                    userId: ctx.user.id,
                    action: `${ctx.user.name || ctx.user.email} deleted task: ${
                        deletedTodo.title
                    }`,
                },
            });

            return deletedTodo;
        }),

    updateTodo: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().min(1).optional(),
                description: z.string().min(1).optional(),
                completed: z.boolean().optional(),
                tags: z.string().min(1).optional(),
                deadline: z.string().datetime().optional(),
                reminder_time: z.string().datetime().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const updatedData: {
                title?: string;
                description?: string;
                tags?: string;
                deadline?: Date;
                reminder_time?: Date;
            } = {};

            if (input.title) updatedData.title = input.title;
            if (input.description) updatedData.description = input.description;
            if (input.tags) updatedData.tags = input.tags;
            if (input.deadline) updatedData.deadline = new Date(input.deadline);
            if (input.reminder_time)
                updatedData.reminder_time = new Date(input.reminder_time);

            const updatedTodo = await ctx.prisma.todo.update({
                where: { id: input.id },
                data: {
                    ...updatedData,
                    completed: false,
                },
            });

            await ctx.prisma.activityLog.create({
                data: {
                    userId: ctx.user.id,
                    action: `${ctx.user.name || ctx.user.email} updated task: ${
                        updatedTodo.title
                    }`,
                },
            });

            return updatedTodo;
        }),
});
