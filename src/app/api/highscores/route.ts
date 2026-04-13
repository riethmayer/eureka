import getHighscores from "@/db/select-game";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const highscores = await getHighscores();
    return NextResponse.json({ success: true, data: highscores });
  } catch (error) {
    console.error("Error fetching highscores:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal Server Error" } },
      { status: 500 }
    );
  }
}
