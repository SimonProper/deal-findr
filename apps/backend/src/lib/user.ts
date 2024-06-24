import { db } from "./db/index.ts";
import { userTable } from "./db/schema/user.ts";

type NewUser = typeof userTable.$inferInsert;

const insertUser = (user: NewUser) => {
  return db.insert(userTable).values(user).returning();
};

export { insertUser };
