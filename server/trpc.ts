import { initTRPC, TRPCError } from "@trpc/server";
import SuperJSON from "superjson";
import { Context } from "./context"; // Context contains session info

export const t = initTRPC.context<Context>().create({
    transformer: SuperJSON,
});

// ✅ Middleware to check authentication
const isAuthenticated = t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in",
        });
    }

    return next({
        ctx: {
            ...ctx,
            user: ctx.session.user,
        },
    });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
