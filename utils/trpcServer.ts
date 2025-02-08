import { createContext } from "@/server/context";
import { appRouter } from "@/server/root";
import { t } from "@/server/trpc";
const { createCallerFactory } = t;
const trpcServerClient = createCallerFactory(appRouter);
export const trpcCaller = trpcServerClient(await createContext());
