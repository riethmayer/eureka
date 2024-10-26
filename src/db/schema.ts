import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { type GameBoard } from "@/types/game-board";

export const games = sqliteTable("games", {
  id: text("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  board: text("board", { mode: "json" })
    .$type<GameBoard>()
    .notNull()
    .default({}),
  name: text("name").notNull().default(""),
  level: integer("level").notNull().default(1),
  score: integer("score").notNull().default(0),
  maxTime: integer("max_time").notNull().default(800),
  timeRemaining: integer("time_remaining").notNull().default(800),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
