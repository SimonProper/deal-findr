import { env } from "@/env.ts";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
