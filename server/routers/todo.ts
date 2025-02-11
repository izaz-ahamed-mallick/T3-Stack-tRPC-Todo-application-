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

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.todo.delete({
                where: { id: input.id },
            });
        }),
});
