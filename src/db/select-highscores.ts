import { desc, sql } from "drizzle-orm";

import db from "@/db/client";
import { highscores as highscoresTable } from "@/db/schema";
import { Highscore } from "@/types/highscore";

interface RankedHighscore extends Highscore {
  rank: string;
}

const LIMIT = 10;
export const getHighscores = async (): Promise<RankedHighscore[]> => {
  try {
    const highscores = await db
      .select({
        id: highscoresTable.id,
        name: highscoresTable.name,
        score: highscoresTable.score,
        level: highscoresTable.level,
        createdAt: highscoresTable.createdAt,
        rank: sql<string>`RANK() OVER (ORDER BY ${highscoresTable.score} DESC, ${highscoresTable.createdAt} DESC)`,
      })
      .from(highscoresTable)
      .limit(LIMIT)
      .orderBy(desc(highscoresTable.score), desc(highscoresTable.createdAt))
      .all();
    return highscores;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getHighscores;
