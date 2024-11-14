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
  timePassed: integer("time_passed").notNull().default(800),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const gameMoves = sqliteTable("game_moves", {
  id: text("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  gameId: text("game_id", { length: 36 })
    .notNull()
    .references(() => games.id),
  moveType: text("move_type", { enum: ["click", "pair", "levelUp"] }).notNull(),
  tileIndex: text("tile_index"), // null for levelUp moves
  token: text("token"), // null for levelUp moves
  score: integer("score").notNull(),
  timePast: integer("time_past").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const gameSnapshots = sqliteTable("game_snapshots", {
  id: text("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  gameId: text("game_id", { length: 36 })
    .notNull()
    .references(() => games.id),
  board: text("board", { mode: "json" }).$type<GameBoard>().notNull(),
  timePast: integer("time_past").notNull(),
  score: integer("score").notNull(),
  level: integer("level").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
