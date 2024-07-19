import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import { Highscore } from "@prisma/client";
import prisma from "@lib/prisma";

type ErrorData = {
  errorString: string;
};

export const getHighScores = async (): Promise<Highscore[] | ErrorData> => {
  try {
    const highscores = await prisma.highscore.findMany({
      orderBy: {
        score: "desc",
      },
      take: 10,
    });
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
  const highscore = await prisma.highscore.create({
    data: {
      name,
      score,
      level,
    },
  });
  return highscore;
};

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Highscore> | Highscore | ErrorData>
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
