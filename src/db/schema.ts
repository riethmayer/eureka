import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
// import { createId } from "@paralleldrive/cuid2";

export const highscores = sqliteTable("highscores", {
  id: integer("id", { mode: "number" }).primaryKey(),
  name: text("name").notNull().default(""),
  score: integer("score").notNull().default(0),
  level: integer("level").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// export const games = sqliteTable("games", {
//   id: text("id", { length: 36 }).primaryKey().notNull().$defaultFn(() => createId()),
//   board: text("board", { mode: "json" }).$type<any>(),
//   level: integer("level").notNull().default(1),
//   score: integer("score").notNull().default(0),
//   timeRemaining: integer("time_remaining").notNull().default(
//     800),
//   createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
// });
