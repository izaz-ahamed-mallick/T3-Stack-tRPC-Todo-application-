import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

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
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.todo.create({
                data: {
                    title: input.title,
                    description: input.description,
                    status: "todo",
                    completed: false,
                    userId: ctx.user.id,
                },
            });
        }),

    updateStatus: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                status: z.enum(["todo", "inProgress", "completed"]),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.todo.update({
                where: { id: input.id },
                data: { status: input.status },
            });
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

            return ctx.prisma.todo.update({
                where: { id: input.id },
                data: {
                    completed: !currentTodo.completed,
                    status: "completed",
                },
            });
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.todo.delete({
                where: { id: input.id },
            });
        }),

    updateTodo: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().min(1).optional(),
                description: z.string().min(1).optional(),
                complete: z.boolean().optional(), // Optional, in case you want to update complete
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, title, description, complete } = input;

            const currentTodo = await ctx.prisma.todo.findUnique({
                where: { id },
            });

            if (!currentTodo) {
                throw new Error("Todo not found");
            }

            const updatedData: {
                title?: string;
                description?: string;
                complete?: boolean;
            } = {};

            if (title && title !== currentTodo.title) {
                updatedData.title = title;
            }

            if (description && description !== currentTodo.description) {
                updatedData.description = description;
            }

            if (complete !== undefined && complete !== currentTodo.completed) {
                updatedData.complete = complete; // Update complete if specified
            }

            if (Object.keys(updatedData).length === 0) {
                return currentTodo;
            }

            return ctx.prisma.todo.update({
                where: { id },
                data: updatedData,
            });
        }),
});
