import type { Config } from "drizzle-kit";
console.log(
  `Connecting to database from drizzle.config.ts: ${process.env.TURSO_DATABASE_URL}`
);
export default {
  schema: "./src/db/schema.ts",
  driver: "turso",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  out: "./src/db/migrations",
  verbose: true,
  strict: true,
} satisfies Config;
