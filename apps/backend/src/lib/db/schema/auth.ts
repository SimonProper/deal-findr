import { text, timestamp, pgTable, uuid, pgEnum } from "drizzle-orm/pg-core";
import { userTable } from "./user.ts";
import { relations } from "drizzle-orm";

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => userTable.id)
    .notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const open_id_provider = pgEnum("oauth_provider", [
  "google",
  "apple",
] as const);

export type OpenIdProvider = (typeof open_id_provider.enumValues)[number];

export const providerTable = pgTable("auth_provider", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  providerId: text("providerId").notNull(),
  provider: open_id_provider("provider").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const providerRelations = relations(providerTable, ({ one }) => ({
  user: one(userTable, {
    fields: [providerTable.userId],
    references: [userTable.id],
  }),
}));
