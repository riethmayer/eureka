import getClient from "@/db/client";

interface RankedHighscore {
  id: string;
  name: string;
  score: number;
  level: number;
  created_at: string;
  rank: number;
}

const LIMIT = 10;

export const getHighscores = async (): Promise<RankedHighscore[]> => {
  const { data, error } = await (getClient() as any) // untyped client
    .from("games")
    .select("id, name, score, level, created_at")
    .order("score", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(LIMIT);

  if (error) throw new Error(`Failed to fetch highscores: ${error.message}`);

  return ((data ?? []) as Array<Omit<RankedHighscore, "rank">>).map((row, index) => ({
    ...row,
    rank: index + 1,
  }));
};

export default getHighscores;
