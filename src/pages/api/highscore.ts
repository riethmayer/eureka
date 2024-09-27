import type { NextApiRequest, NextApiResponse } from "next";
import db from "@db/client";
import { highscores as highscoresTable } from "@db/schema";

type ErrorData = {
  errorString: string;
};

export const getHighScores = async (): Promise<Highscore[] | ErrorData> => {
  try {
    const highscores = await db.select().from(highscoresTable).all();
    console.log(highscores);
    return highscores;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const submitHighscore = async ({
  name,
  score,
  level,
}: {
  name: string;
  score: number;
  level: number;
}) => {
  const highscore = { // FIXME: insert in real database
    data: {
      name,
      score,
      level,
    },
  };
  return highscore;
};

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Highscore> | Highscore | ErrorData>,
) {
  if (req.method === "GET") {
    const highscores = await getHighScores();
    return res.status(200).json(highscores);
  }

  if (req.method === "POST") {
    const { name, score, level } = req.body;
    const highscore = await submitHighscore({ name, score, level });
    return res.status(201).json(highscore);
  }

  return res.status(404).json({ errorString: "Not found" });
}

export default handler;
