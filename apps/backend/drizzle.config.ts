import type { Config } from "drizzle-kit";
import { env } from "./src/env.ts";

export default {
  schema: "./src/lib/db/schema",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
