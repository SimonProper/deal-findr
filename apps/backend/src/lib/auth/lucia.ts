import { Lucia } from "lucia";
import { adapter } from "../db/index.ts";
import { userTable } from "../db/schema/user.ts";
import { fromAsyncThrowable } from "neverthrow";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      firstName: attributes.firstName,
      lastName: attributes.lastName,
      role: attributes.role,
      isAdmin: attributes.role === "admin",
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

type DatabaseUserAttributes = typeof userTable.$inferSelect;

export const safeCreateSession = fromAsyncThrowable(
  (userId: string) => lucia.createSession(userId, {}),
  (e) => new Error(`Could not create session: ${e}`),
);
