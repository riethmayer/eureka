import { saveGameState } from "@/db/insert-game";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import type { NewGame } from "@/types/game";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const gameState: NewGame & { id?: string | null } = await req.json();
    const savedGame = await saveGameState(gameState);
    await revalidatePath("/play");

    return NextResponse.json(savedGame, { status: 201 });
  } catch (error) {
    console.error("Error saving game state:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
