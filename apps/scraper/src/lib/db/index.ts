import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const migrationClient = postgres(process.env.CONNECTION_CLIENT, {
  max: 1,
});

const queryClient = postgres(process.env.CONNECTION_CLIENT);

export const db = drizzle(queryClient);
