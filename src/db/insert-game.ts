import db from "@/db/client";
import { games } from "@/db/schema";
import type { Game, NewGame } from "@/types/game";

export const postGame = async (newGame: NewGame): Promise<Game[]> => {
  const result = await db.insert(games).values(newGame).returning();
  if (!result) {
    throw new Error("Failed to store game");
  }
  return result;
};

export default postGame;
