import { z } from "zod";
import { env } from "../../env.ts";
import { decode } from "hono/jwt";
import { db } from "../db/index.ts";
import { providerTable } from "../db/schema/auth.ts";
import {
  err,
  ok,
  zToResult,
  type AsyncResult,
  type Result,
} from "../result.ts";
import { insertUser } from "../user.ts";

const GoogleResponseSchema = z.object({
  id_token: z.string(),
});

export const verifyOIDCCode = async (code: string) => {
  const response = await fetch(new URL("https://oauth2.googleapis.com/token"), {
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
  });
  return GoogleResponseSchema.safeParse(await response.json());
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

export const addProviderToUser = async (
  valuse: Pick<
    typeof providerTable.$inferInsert,
    "userId" | "provider" | "providerId"
  >,
  trx = db,
): AsyncResult<typeof providerTable.$inferSelect> => {
  const res = await trx.insert(providerTable).values(valuse).returning();

  const newRow = res.at(0);

  if (newRow) return ok(newRow);
  return err(new Error("could not insert provider row"));
};

export const createNewUser = async ({
  userInfo,
}: {
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
    profilePictureUrl: string;
    sub: string;
  };
}): AsyncResult<{ userId: string }> => {
  return db.transaction(async (tx) => {
    const insertUserResult = await insertUser(
      {
        role: "customer",
        createdAt: new Date(),
        updatedAt: new Date(),
        ...userInfo,
      },
      tx,
    );

    if (!insertUserResult.ok) {
      tx.rollback();
      return err(new Error("Could not create user"));
    }

    const newUser = insertUserResult.value;

    const addProviderResult = await addProviderToUser(
      {
        providerId: userInfo.sub,
        provider: "google",
        userId: newUser.id,
      },
      tx,
    );

    console.log("inserted new user in provider: ", {
      insertProviderRowResult: addProviderResult,
    });

    if (!addProviderResult.ok) {
      tx.rollback();
      return err(new Error("Could not create user"));
    }

    return ok({ userId: newUser.id });
  });
};
