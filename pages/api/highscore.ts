// This API route logs a user out.
import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import loadStytch from "@lib/loadStytch";

type ErrorData = {
  errorString: string;
};

type HighScore = {
  id: number;
  name: string;
  score: number;
  created_at: string;
};

type SessionData = {
  session_id: string;
  user_id: string;
  started_at: Date;
  last_accessed_at: Date;
  expires_at: Date;
  session_token: string;
  session_jwt: string;
};

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<HighScore> | ErrorData | SessionData>
) {
  const cookies = new Cookies(req, res);
  const storedSession = cookies.get("stytch_session");
  if (!storedSession) {
    return res.status(401).json({ errorString: "No session provided" });
  }
  try {
    const client = loadStytch();
    const { session, session_jwt, session_token } =
      await client.sessions.authenticate({
        session_token: storedSession,
      });

    const result = await fetch("http://localhost:3001/api/v1/highscores");
    const highscores = await result.json();

    return res.status(200).json(highscores);
  } catch (error) {
    const errorString = JSON.stringify(error);
    return res.status(400).json({ errorString });
  }
}

export default handler;
