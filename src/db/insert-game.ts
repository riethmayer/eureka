import getClient from "@/db/client";
import type { Game, NewGame } from "@/types/game";

export const postGame = async (newGame: NewGame): Promise<Game> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getClient() as any)
    .from("games")
    .insert(newGame)
    .select()
    .single();

  if (error) throw new Error(`Failed to store game: ${error.message}`);
  return data as Game;
};

export const updateGame = async (
  id: string,
  gameState: Partial<NewGame>
): Promise<Game> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getClient() as any)
    .from("games")
    .update(gameState)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update game: ${error.message}`);
  return data as Game;
};

export const saveGameState = async (
  state: NewGame & { id?: string | null }
): Promise<Game | null> => {
  try {
    const { id, ...gameState } = state;
    if (id) {
      return await updateGame(id, gameState);
    } else {
      return await postGame(gameState);
    }
  } catch (error) {
    console.error("Failed to save game state:", error);
    return null;
  }
};

export default postGame;
