import { TRPCError } from "@trpc/server";
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
    const userResult = await db.query.userTable.findFirst({
      where: (userRow, { eq }) => eq(userRow.id, user.id),
    });
    if (!userResult) throw new TRPCError({ code: "NOT_FOUND" });

    const { lastName, firstName, id, profilePictureUrl, email } = userResult;

    return { lastName, firstName, id, profilePictureUrl, email };
  }),
});
