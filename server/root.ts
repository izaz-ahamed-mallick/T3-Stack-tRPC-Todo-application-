import { authRouter } from "./routers/auth";
import { todosRouter } from "./routers/todo";
import { router } from "./trpc";

export const appRouter = router({
    todo: todosRouter,
    auth: authRouter,
});

export type AppRouter = typeof appRouter;
