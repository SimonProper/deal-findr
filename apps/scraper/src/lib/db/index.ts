import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as user from "./schema/user.ts";
import { env } from "@/env.ts";

export const schema = { ...user };

export const migrationClient = postgres(env.DATABASE_URL, {
  max: 1,
});

const queryClient = postgres(env.DATABASE_URL);

export const db = drizzle(queryClient, { schema });
