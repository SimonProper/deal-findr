import { db } from "./db/index.ts";
import type { OpenIdProvider, providerTable } from "./db/schema/auth.ts";
import { userTable } from "./db/schema/user.ts";
import { err, fromPromise, ok, type ResultAsync } from "neverthrow";

type NewUser = typeof userTable.$inferInsert;
type InsertUserValue = typeof userTable.$inferSelect;

export const insertUser = (
  user: NewUser,
  trx = db,
): ResultAsync<InsertUserValue, Error> => {
  return fromPromise(
    trx.insert(userTable).values(user).returning(),
    () => new Error("could not insert user"),
  ).andThen((res) => {
    const newUser = res.at(0);
    return newUser ? ok(newUser) : err(new Error("could not insert user"));
  });
};

export const getUserByProviderId = (
  providerId: string,
  provider: OpenIdProvider,
  trx = db,
): ResultAsync<typeof providerTable.$inferSelect, Error> => {
  return fromPromise(
    trx.query.providerTable.findFirst({
      where: (providerRow, { eq }) =>
        eq(providerRow.providerId, providerId) &&
        eq(providerRow.provider, provider),
      with: { user: true },
    }),
    () => new Error("Could not find user"),
  ).andThen((res) => (res ? ok(res) : err(new Error("could not insert user"))));
};
