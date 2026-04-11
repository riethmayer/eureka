export type PostHighScoreProps = {
  score: number;
  level: number;
  name: string;
};

export const postHighscore = async ({
  name,
  score,
  level,
}: PostHighScoreProps): Promise<void> => {
  if (score < 2) {
    return;
  }

  const response = await fetch("/api/highscore", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, score, level }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "(no body)");
    throw new Error(`Highscore POST failed (${response.status}): ${text}`);
  }
};
