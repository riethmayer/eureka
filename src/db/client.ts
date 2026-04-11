import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Lazy singleton — validation runs on first DB access (request time),
// not at module import time (build time), so next build doesn't require env vars.
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

const getDb = () => {
  if (_db) return _db;

  const databaseUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!databaseUrl) {
    throw new Error("TURSO_DATABASE_URL environment variable is not set");
  }
  if (!authToken) {
    throw new Error("TURSO_AUTH_TOKEN environment variable is not set");
  }

  const client = createClient({ url: databaseUrl, authToken });
  _db = drizzle(client, { schema });
  return _db;
};

export default getDb;
