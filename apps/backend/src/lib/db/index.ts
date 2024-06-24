import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import * as user from "@lib/db/schema/user.ts";
import * as auth from "@lib/db/schema/auth.ts";
import { env } from "@/env.ts";

export const schema = { ...user, ...auth };

export const migrationClient = postgres(env.DATABASE_URL, {
  max: 1,
});

const queryClient = postgres(env.DATABASE_URL);

export const db = drizzle(queryClient, { schema });

export const adapter = new DrizzlePostgreSQLAdapter(
  db,
  auth.sessionTable,
  user.userTable,
);
