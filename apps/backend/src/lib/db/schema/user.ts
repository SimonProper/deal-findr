import { relations } from "drizzle-orm";
import { uuid, text, timestamp, pgTable } from "drizzle-orm/pg-core";
import { providerTable } from "./auth.ts";

export const userTable = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("firstName"),
  lastName: text("lastName"),
  email: text("email"),
  role: text("role").$type<"admin" | "customer">(),
  profilePictureUrl: text("profile_picture_url"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const userRelations = relations(userTable, ({ many }) => ({
  providers: many(providerTable),
}));
