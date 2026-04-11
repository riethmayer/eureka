import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!databaseUrl) {
  throw new Error("TURSO_DATABASE_URL environment variable is not set");
}
if (!authToken) {
  throw new Error("TURSO_AUTH_TOKEN environment variable is not set");
}

export const client = createClient({
  url: databaseUrl,
  authToken,
});

const db = drizzle(client, { schema });

export default db;
