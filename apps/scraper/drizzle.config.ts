import type { Config } from "drizzle-kit";

console.log("hello: ", { env: process.env.CONNECTION_STRING });

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString:
      "postgres://postgres:mysecretpassword@localhost:5432/deal-findr",
  },
} satisfies Config;
