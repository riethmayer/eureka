import db from "@/db/client";
import { games } from "@/db/schema";
import type { Game, NewGame } from "@/types/game";
import { eq } from "drizzle-orm";

export const postGame = async (newGame: NewGame): Promise<Game[]> => {
  const result = await db.insert(games).values(newGame).returning();
  if (!result) {
    throw new Error("Failed to store game");
  }
  return result;
};

export const updateGame = async (
  id: string,
  gameState: Omit<NewGame, "id">
): Promise<Game[]> => {
  const result = await db
    .update(games)
    .set(gameState)
    .where(eq(games.id, id))
    .returning();
  if (!result) {
    throw new Error("Failed to update game");
  }
  return result;
};

export const saveGameState = async (
  state: NewGame & { id?: string | null }
) => {
  try {
    const { id, ...gameState } = state;
    if (id) {
      const result = await updateGame(id, gameState);
      return result[0];
    } else {
      const result = await postGame(gameState);
      return result[0];
    }
  } catch (error) {
    console.error("Failed to save game state:", error);
    return null;
  }
};

export default postGame;
