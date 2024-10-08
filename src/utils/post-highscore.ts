export type PostHighScoreProps = {
  score: number;
  level: number;
  name: string;
};

export const postHighscore = async ({
  name,
  score,
  level,
}: PostHighScoreProps) => {
  await fetch("/api/highscore", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      score,
      level,
    }),
  });
};
