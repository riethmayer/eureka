// This API route logs a user out.
import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import loadStytch from "@lib/loadStytch";
import { PrismaClient, Highscore } from "@prisma/client";

const prisma = new PrismaClient();

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
  const cookies = new Cookies(req, res);
  const storedSession = cookies.get("stytch_session");
  if (!storedSession) {
    return res.status(401).json({ errorString: "No session provided" });
  }
  try {
    const client = loadStytch();

    await client.sessions.authenticate({
      session_token: storedSession,
    }); // throws if session is invalid

    if (req.method === "GET") {
      const highscores = await getHighScores();
      return res.status(200).json(highscores);
    } else if (req.method === "POST") {
      const { name, score, level } = req.body;
      const highscore = await submitHighscore({ name, score, level });
      return res.status(201).json(highscore);
    }
  } catch (error) {
    if (error.error_type === "session_not_found") {
      // from stytch
      const errorString = error.error_message;
      return res.status(401).json({ errorString });
    }
    const errorString = JSON.stringify(error);
    console.log(error);
    return res.status(400).json({ errorString });
  }
}

export default handler;
