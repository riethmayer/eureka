import { desc, sql } from "drizzle-orm";

import db from "@/db/client";
import { games as highscoresTable } from "@/db/schema";
import { Game } from "@/types/game";

interface RankedHighscore
  extends Pick<Game, "id" | "name" | "score" | "level" | "createdAt"> {
  rank: number;
}

const LIMIT = 10;
export const getHighscores = async (): Promise<RankedHighscore[]> => {

  const highscores = await db
    .select({
      id: highscoresTable.id,
      name: highscoresTable.name,
      score: highscoresTable.score,
      level: highscoresTable.level,
      createdAt: highscoresTable.createdAt,
      rank: sql<number>`RANK() OVER (ORDER BY ${highscoresTable.score} DESC, ${highscoresTable.createdAt} DESC)`,
    })
    .from(highscoresTable)
    .limit(LIMIT)
    .orderBy(desc(highscoresTable.score), desc(highscoresTable.createdAt))
    .all();
  return highscores;
};

export default getHighscores;
