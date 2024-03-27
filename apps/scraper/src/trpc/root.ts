import { productRouter } from "./router/productRouter.ts";
import { createTRPCRouter } from "./trpc.ts";

export const appRouter = createTRPCRouter({
  products: productRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
