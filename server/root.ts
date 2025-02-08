import { todosRouter } from "./routers/todo";
import { t } from "./trpc";

export const appRouter = t.router({
    todo: todosRouter,
});

export type AppRouter = typeof appRouter;
