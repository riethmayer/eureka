import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const databaseUrl = process.env.TURSO_DATABASE_URL;
console.log(`Connecting to database from client.ts: ${databaseUrl}`);

export const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN || "",
});

const db = drizzle(client, { schema, logger: true });

export default db;
