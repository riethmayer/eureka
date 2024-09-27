import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const highscores = sqliteTable("highscores", {
  id: integer("id", { mode: "number" }).primaryKey(),
  name: text("name").notNull().default(""),
  score: integer("score").notNull().default(0),
  level: integer("level").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
