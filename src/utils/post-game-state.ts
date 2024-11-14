import type { NewGame, Game } from "@/types/game";

export const postGameState = async (
  gameState: NewGame & { id?: string | null }
): Promise<Game | null> => {
  try {
    const response = await fetch("/api/game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameState),
    });

    if (!response.ok) {
      throw new Error("Failed to save game state");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving game state:", error);
    return null;
  }
};
