import { saveGameState } from "@/db/insert-game";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import type { NewGame } from "@/types/game";

// Custom error class for API errors
class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

// Validation function for game state
const validateGameState = (
  data: unknown
): data is NewGame & { id?: string | null } => {
  if (!data || typeof data !== "object") {
    throw new APIError("Invalid game state format", 400, "INVALID_FORMAT");
  }

  const gameState = data as NewGame & { id?: string | null };

  // Add your validation logic here
  if (!gameState.board) {
    throw new APIError("Game board is required", 400, "MISSING_BOARD");
  }

  return true;
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate the request body
    const data = await req.json();
    validateGameState(data);

    // Save the game state
    const savedGame = await saveGameState(data);

    // Revalidate the play page cache
    await revalidatePath("/play");

    // Return success response with proper typing
    return NextResponse.json(
      {
        success: true,
        data: savedGame,
      },
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error saving game state:", error);

    // Handle known API errors
    if (error instanceof APIError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.message,
            code: error.code,
          },
        },
        {
          status: error.statusCode,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Handle unknown errors
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Internal Server Error",
          code: "INTERNAL_ERROR",
        },
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
