import { saveGameState } from "@/db/insert-game";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import type { NewGame } from "@/types/game";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data: NewGame & { id?: string | null } = await req.json();

    if (!data.board) {
      return NextResponse.json(
        { success: false, error: { message: "Game board is required" } },
        { status: 400 }
      );
    }

    const savedGame = await saveGameState(data);
    revalidatePath("/play");

    return NextResponse.json({ success: true, data: savedGame }, { status: 201 });
  } catch (error) {
    console.error("Error saving game state:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal Server Error" } },
      { status: 500 }
    );
  }
}
