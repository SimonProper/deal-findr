import { z } from "zod";
import { env } from "../../env.ts";
import { decode } from "hono/jwt";
import { db } from "../db/index.ts";
import { providerTable } from "../db/schema/auth.ts";
import {
  err,
  ok,
  type ResultAsync,
  fromPromise,
  okAsync,
  errAsync,
} from "neverthrow";
import { insertUser } from "../user.ts";
import { zToResult } from "../result.ts";

const GoogleResponseSchema = z.object({
  id_token: z.string(),
});

export const verifyOIDCCode = async (code: string) => {
  return fromPromise(
    fetch(new URL("https://oauth2.googleapis.com/token"), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:3000/auth/callback/google",
        code,
      }),
    }),
    () => err(new Error("could not fetch token")),
  )
    .andThen((response) =>
      fromPromise(response.json(), () =>
        err(new Error("Could not parse response")),
      ),
    )
    .andThen((res) => zToResult(GoogleResponseSchema.safeParse(res)));
};

const googleOIDCJWTSchema = z.object({
  sub: z.string(),
  email: z.string(),
  given_name: z.string(),
  family_name: z.string(),
  picture: z.string(),
});

export const decodeOIDCToken = (token: string) => {
  return zToResult(googleOIDCJWTSchema.safeParse(decode(token).payload));
};

export const addProviderToUser = (
  valuse: Pick<
    typeof providerTable.$inferInsert,
    "userId" | "provider" | "providerId"
  >,
  trx = db,
): ResultAsync<typeof providerTable.$inferSelect, Error> => {
  return fromPromise(
    trx.insert(providerTable).values(valuse).returning(),
    () => new Error("could not insert provider row"),
  ).andThen((res) => {
    const insertRes = res.at(0);
    return insertRes
      ? okAsync(insertRes)
      : errAsync(new Error("could not insert provider row"));
  });
};

const newUserError = new Error("could not create user");

export const createNewUser = ({
  userInfo,
}: {
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
    profilePictureUrl: string;
    sub: string;
  };
}): ResultAsync<{ userId: string }, Error> => {
  return fromPromise(
    db.transaction(async (tx) => {
      const insertRes = await insertUser(
        {
          role: "customer",
          createdAt: new Date(),
          updatedAt: new Date(),
          ...userInfo,
        },
        tx,
      );

      if (insertRes.isErr()) {
        tx.rollback();
        return err(newUserError);
      }

      const providerRes = await addProviderToUser(
        {
          providerId: userInfo.sub,
          provider: "google",
          userId: insertRes.value.id,
        },
        tx,
      );

      if (providerRes.isErr()) {
        tx.rollback();
        return err(newUserError);
      }

      return ok({ userId: providerRes.value.userId });
    }),
    () => newUserError,
  ).andThen((res) => res);
};
