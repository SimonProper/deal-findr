import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc.ts";
import { getUserByProviderId } from "../../lib/user.ts";
import { lucia, safeCreateSession } from "../../lib/auth/lucia.ts";
import {
  decodeOIDCToken,
  verifyOIDCCode,
  createNewUser,
} from "../../lib/auth/OIDC.ts";
import { fromAsyncThrowable, fromThrowable, ok } from "neverthrow";

export const authRouter = createTRPCRouter({
  getAuthProviders: publicProcedure.query(async () => {
    return {
      google: { url: "" },
    };
  }),
  verifyAuth: publicProcedure
    .input(z.object({ code: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const response = await verifyOIDCCode(input.code);

      if (response.isErr()) {
        console.log("response err");
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Could not verify user",
        });
      }

      const userInfo = decodeOIDCToken(response.value.id_token);

      if (userInfo.isErr()) {
        console.log("userinof err");
        throw new TRPCError({
          message: userInfo.error.message,
          code: "UNAUTHORIZED",
        });
      }

      const result = await getUserByProviderId(userInfo.value.sub, "google");

      let userId: string;

      // User is not added
      if (result.isErr()) {
        const newUserResult = await createNewUser({
          userInfo: {
            firstName: userInfo.value.given_name,
            lastName: userInfo.value.family_name,
            email: userInfo.value.email,
            profilePictureUrl: userInfo.value.picture,
            sub: userInfo.value.sub,
          },
        });

        if (newUserResult.isErr()) {
          throw new TRPCError({
            message: newUserResult.error.message,
            code: "BAD_REQUEST",
          });
        }
        userId = newUserResult.value.userId;
      } else {
        userId = result.value.userId;
      }

      await safeCreateSession(userId)
        .andThen((session) => {
          const sessionCookie = lucia.createSessionCookie(session.id);
          ctx.headers.set("Set-Cookie", sessionCookie.serialize());
          return ok("");
        })
        .mapErr((error) => {
          console.log("map err");
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        });

      return userInfo.value;
    }),
  signOut: protectedProcedure.mutation(({ ctx }) => {
    try {
      lucia.invalidateSession(ctx.session.id);
      const sessionCookie = lucia.createBlankSessionCookie();
      ctx.headers.set("Set-Cookie", sessionCookie.serialize());
    } catch (e) {
      console.log(e);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Could not sign out user",
      });
    }
    return { msg: "Successfully signed out" };
  }),
});
