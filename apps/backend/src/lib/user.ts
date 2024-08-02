import { db } from "./db/index.ts";
import type { OpenIdProvider, providerTable } from "./db/schema/auth.ts";
import { userTable } from "./db/schema/user.ts";
import { err, ok, type AsyncResult } from "./result.ts";

type NewUser = typeof userTable.$inferInsert;
type InsertUserValue = typeof userTable.$inferSelect;

export const insertUser = async (
  user: NewUser,
  trx = db,
): AsyncResult<InsertUserValue> => {
  const result = await trx.insert(userTable).values(user).returning();

  const newUser = result.at(0);

  if (newUser) return ok(newUser);
  return err(new Error("could not insert user"));
};

export const getUserByProviderId = async (
  providerId: string,
  provider: OpenIdProvider,
  trx = db,
): AsyncResult<typeof providerTable.$inferSelect> => {
  const result = await trx.query.providerTable.findFirst({
    where: (providerRow, { eq }) =>
      eq(providerRow.providerId, providerId) &&
      eq(providerRow.provider, provider),
    with: { user: true },
  });

  if (result) return ok(result);
  return err(new Error("Could not find user"));
};
