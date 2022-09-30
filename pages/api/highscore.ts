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

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<HighScore> | ErrorData>
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

    const result = await fetch("http://localhost:3001/api/v1/highscores");
    const highscores = await result.json();

    return res.status(200).json(highscores);
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      // from rails
      const errorString = "Server not available";
      return res.status(500).json({ errorString });
    }
    if (error.error_type === "session_not_found") {
      // from stytch
      const errorString = error.error_message;
      return res.status(401).json({ errorString });
    }
    const errorString = JSON.stringify(error);
    return res.status(400).json({ errorString });
  }
}

export default handler;
