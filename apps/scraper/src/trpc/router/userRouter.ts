import { createTRPCRouter, publicProcedure } from "../trpc.ts";

export const userRouter = createTRPCRouter({
  getAllUsers: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.user.findMany();
  }),
});
