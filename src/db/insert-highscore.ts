import getDb from "@/db/client";
import { highscores as highscoresTable } from "@/db/schema";
import type { Highscore, NewHighscore } from "@/types/highscore";

export const postHighscore = async (
  newHighscore: NewHighscore
): Promise<Highscore[]> => {
  const result = await getDb()
    .insert(highscoresTable)
    .values(newHighscore)
    .returning();
  if (!result) {
    throw new Error("Failed to store highscore");
  }
  return result;
};

export default postHighscore;
