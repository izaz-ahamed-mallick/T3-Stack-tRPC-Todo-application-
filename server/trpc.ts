import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import { Context } from "./context";

export const t = initTRPC.context<Context>().create({
    transformer: SuperJSON, // ✅ Correct place for transformer
});

export const router = t.router;
export const publicProcedure = t.procedure;
