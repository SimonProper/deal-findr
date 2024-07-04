import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc.ts";

export const userRouter = createTRPCRouter({
  getAllUsers: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.userTable.findMany();
  }),
  whoAmI: protectedProcedure.query(async ({ ctx: { db, user } }) => {
    const test = await db.query.userTable.findFirst({
      where: (userRow, { eq }) => eq(userRow.id, user.id),
    });
    console.log({ whoAmI: test });
    return test;
  }),
});
