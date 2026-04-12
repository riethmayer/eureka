import type { Game } from "@/types/game";
import type { GameBoard } from "@/types/game-board";

export interface GameStatePayload {
  id?: string | null;
  board: GameBoard;
  name: string;
  level: number;
  score: number;
  maxTime: number;
  timePassed: number;
}

export const postGameState = async (
  gameState: GameStatePayload
): Promise<Game | null> => {
  try {
    const response = await fetch("/api/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: gameState.id,
        board: gameState.board,
        name: gameState.name,
        level: gameState.level,
        score: gameState.score,
        max_time: gameState.maxTime,
        time_passed: gameState.timePassed,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save game state");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error saving game state:", error);
    return null;
  }
};
