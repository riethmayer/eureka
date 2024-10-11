import insertHighscore from "@/db/insert-highscore";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

interface HighscoreRequest {
  name?: string;
  score: string;
  level: string;
}

interface HighscoreResponse {
  message?: string;
  name: string;
  score: number;
  level: number;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const {
      name = "unknown",
      score,
      level,
    }: HighscoreRequest = await req.json();
    const intScore = parseInt(score, 10);
    let intLevel = parseInt(level, 10);

    if (intLevel < 1) {
      intLevel = 1;
    }

    const payload = { name, score: intScore, level: intLevel };

    if (isNaN(intScore) || intScore < 1) {
      const message: HighscoreResponse = {
        message: "Invalid Request: score is less than 1",
        ...payload,
      };
      console.error(message);
      return NextResponse.json(message, { status: 400 });
    }

    const highscores = await insertHighscore(payload);
    await revalidatePath("/highscores");

    return NextResponse.json(highscores, { status: 201 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
