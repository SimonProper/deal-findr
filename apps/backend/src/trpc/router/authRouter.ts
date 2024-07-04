import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc.ts";
import { env } from "../../env.ts";
import { decode } from "hono/jwt";
import { providerTable } from "../../lib/db/schema/auth.ts";
import { insertUser } from "../../lib/user.ts";
import { lucia } from "../../lib/auth/lucia.ts";

const GoogleResponseSchema = z.object({
  id_token: z.string(),
});

const googleOIDCJWTSchema = z.object({
  sub: z.string(),
  email: z.string(),
  given_name: z.string(),
  family_name: z.string(),
  picture: z.string(),
});

export const authRouter = createTRPCRouter({
  getAuthProviders: publicProcedure.query(async ({ ctx }) => {
    return {
      google: { url: "" },
    };
  }),
  verifyAuth: publicProcedure
    .input(z.object({ code: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const response = await fetch(
        new URL("https://oauth2.googleapis.com/token"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
          body: new URLSearchParams({
            client_id: env.GOOGLE_CLIENT_ID,
            client_secret: env.GOOGLE_CLIENT_SECRET,
            grant_type: "authorization_code",
            code: input.code,
            redirect_uri: "http://localhost:3000/auth/callback/google",
          }),
        },
      );
      const data = GoogleResponseSchema.safeParse(await response.json());

      console.log({ response });

      if (data.success) {
        const userInfo = googleOIDCJWTSchema.safeParse(
          decode(data.data.id_token).payload,
        );

        if (!userInfo.success)
          throw new TRPCError({
            message: userInfo.error.message,
            code: "UNAUTHORIZED",
          });

        const result = await ctx.db.query.providerTable.findFirst({
          where: (providerRow, { eq }) =>
            eq(providerRow.providerId, userInfo.data.sub),
          with: { user: true },
        });

        let userId: string = "";

        console.log({ result });

        // User is not added
        if (!result) {
          // create new user
          const insertUserResult = await insertUser({
            firstName: userInfo.data.given_name,
            lastName: userInfo.data.family_name,
            role: "customer",
            email: userInfo.data.email,
            profilePictureUrl: userInfo.data.picture,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          const newUser = insertUserResult.at(0);
          console.log("inserted user: ", { newUser });

          if (newUser) {
            const insertProviderRowResult = await ctx.db
              .insert(providerTable)
              .values({
                providerId: userInfo.data.sub,
                provider: "google",
                userId: newUser.id,
              })
              .returning();

            console.log("inserted new user in provider: ", {
              insertProviderRowResult,
            });

            userId = newUser.id;
          } else {
            throw new TRPCError({
              message: "Could not create user",
              code: "BAD_REQUEST",
            });
          }
        } else {
          userId = result.userId;
        }

        if (userId.length > 0) {
          try {
            const session = await lucia.createSession(userId, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            ctx.headers.set("Set-Cookie", sessionCookie.serialize());
            console.log("created session: ", { session });
          } catch (e) {
            console.log(e);
          }

          return userInfo.data;
        }
        return userInfo.data;
      }
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }),
});
