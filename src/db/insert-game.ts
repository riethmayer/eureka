import getClient from "@/db/client";
import type { Game, NewGame } from "@/types/game";

export const postGame = async (newGame: NewGame): Promise<Game> => {
  const { data, error } = await (getClient() as any) // untyped client
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
  const { data, error } = await (getClient() as any) // untyped client
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
): Promise<Game> => {
  const { id, ...gameState } = state;
  if (id) {
    return await updateGame(id, gameState);
  }
  return await postGame(gameState);
};

export default postGame;
