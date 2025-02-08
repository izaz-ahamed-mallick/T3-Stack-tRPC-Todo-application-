// routers/todo.ts
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const todosRouter = router({
    getAllTodos: publicProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.todo.findMany();
    }),
    create: publicProcedure
        .input(z.object({ title: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.todo.create({
                data: { title: input.title, completed: false },
            });
        }),
});
