import insertHighscore from "@/db/insert-game";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const MAX_NAME_LENGTH = 50;

interface HighscoreRequest {
  name?: string;
  score: number;
  level: number;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: HighscoreRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body: expected JSON" },
      { status: 400 }
    );
  }

  const { name = "unknown", score, level } = body;

  const intScore = Number(score);
  let intLevel = Number(level);

  if (!Number.isInteger(intScore) || intScore < 1) {
    return NextResponse.json(
      { message: "Invalid request: score must be a positive integer" },
      { status: 400 }
    );
  }

  if (!Number.isInteger(intLevel) || intLevel < 1) {
    intLevel = 1;
  }

  const sanitizedName = String(name).trim().slice(0, MAX_NAME_LENGTH) || "unknown";

  try {
    const highscores = await insertHighscore({
      name: sanitizedName,
      score: intScore,
      level: intLevel,
    });
    await revalidatePath("/highscores");
    return NextResponse.json(highscores, { status: 201 });
  } catch (error) {
    console.error("Failed to insert highscore:", error);
    return NextResponse.json(
      { message: "Failed to save highscore" },
      { status: 500 }
    );
  }
}
