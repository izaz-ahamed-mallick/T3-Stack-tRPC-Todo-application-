import { initTRPC, TRPCError } from "@trpc/server";
import SuperJSON from "superjson";
import { Context } from "./context";

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

// ✅ Middleware to check if the user is an admin
const isAdmin = t.middleware(({ ctx, next }) => {
    if (ctx?.session?.user.role !== "admin") {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "Admins only!",
        });
    }

    return next();
});

export const adminProcedure = t.procedure.use(isAdmin);

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
