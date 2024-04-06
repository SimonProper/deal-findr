import { productRouter } from "./router/productRouter.ts";
import { userRouter } from "./router/userRouter.ts";
import { createTRPCRouter } from "./trpc.ts";

export const appRouter = createTRPCRouter({
  products: productRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
