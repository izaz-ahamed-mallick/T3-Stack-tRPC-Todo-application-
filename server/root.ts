import { todosRouter } from "./routers/todo";
import { router } from "./trpc";

export const appRouter = router({
    todo: todosRouter,
});

export type AppRouter = typeof appRouter;
