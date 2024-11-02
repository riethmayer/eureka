import { games } from "@/db/schema";

export type Game = typeof games.$inferSelect;
export type NewGame = Omit<Game, "id" | "createdAt">;
