import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc.ts";
import { getUserByProviderId } from "../../lib/user.ts";
import { lucia } from "../../lib/auth/lucia.ts";
import {
  decodeOIDCToken,
  verifyOIDCCode,
  createNewUser,
} from "../../lib/auth/OIDC.ts";

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

      if (response.success) {
        const userInfo = decodeOIDCToken(response.data.id_token);

        if (!userInfo.ok)
          throw new TRPCError({
            message: userInfo.error.message,
            code: "UNAUTHORIZED",
          });

        const result = await getUserByProviderId(userInfo.value.sub, "google");

        let userId: string;

        // User is not added
        if (!result.ok) {
          const newUserResult = await createNewUser({
            userInfo: {
              firstName: userInfo.value.given_name,
              lastName: userInfo.value.family_name,
              email: userInfo.value.email,
              profilePictureUrl: userInfo.value.picture,
              sub: userInfo.value.sub,
            },
          });

          if (!newUserResult.ok) {
            throw new TRPCError({
              message: newUserResult.error.message,
              code: "BAD_REQUEST",
            });
          }
          userId = newUserResult.value.userId;
        } else {
          userId = result.value.userId;
        }

        try {
          const session = await lucia.createSession(userId, {});
          const sessionCookie = lucia.createSessionCookie(session.id);
          ctx.headers.set("Set-Cookie", sessionCookie.serialize());
        } catch (e) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Could not verify user",
          });
        }

        return userInfo.value;
      }
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Could not verify user",
      });
    }),
});
