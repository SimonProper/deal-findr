import { relations } from "drizzle-orm";
import { uuid, text, timestamp, pgTable } from "drizzle-orm/pg-core";
import { providerTable } from "./auth.ts";

export const userTable = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  email: text("email").notNull(),
  role: text("role")
    .$type<"admin" | "customer">()
    .default("customer")
    .notNull(),
  profilePictureUrl: text("profile_picture_url"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const userRelations = relations(userTable, ({ many }) => ({
  providers: many(providerTable),
}));

export type UserTable = typeof userTable.$inferSelect;
