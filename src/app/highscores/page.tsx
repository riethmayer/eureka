import getHighscores from "@/db/select-game";

export const dynamic = "force-dynamic";

const MEDALS: Record<number, { emoji: string; row: string; score: string }> = {
  1: { emoji: "🥇", row: "bg-yellow-900/40 border-l-4 border-yellow-400", score: "text-yellow-300" },
  2: { emoji: "🥈", row: "bg-slate-700/60 border-l-4 border-slate-400", score: "text-slate-300" },
  3: { emoji: "🥉", row: "bg-orange-900/30 border-l-4 border-orange-400", score: "text-orange-300" },
};

const HighscoresController = async () => {
  const highscores = await getHighscores();

  return (
    <div className="flex flex-col items-center px-4 pt-8 pb-4 h-full">
      {/* Header */}
      <div className="mb-6 text-center shrink-0">
        <h1 className="text-5xl font-extrabold text-white tracking-widest uppercase">
          Highscores
        </h1>
        <p className="text-slate-400 mt-1 text-sm tracking-wide">Top 10 all-time players</p>
      </div>

      {/* Table card — grows to fill remaining height */}
      <div className="w-[80vw] rounded-2xl overflow-hidden shadow-2xl border border-slate-600 flex flex-col flex-1 min-h-0">
        {/* Table header */}
        <div className="grid grid-cols-[5rem_1fr_10rem_8rem] bg-slate-900 text-slate-400 uppercase text-sm font-bold tracking-widest px-6 py-4 shrink-0">
          <span className="text-center">#</span>
          <span>Player</span>
          <span className="text-right">Score</span>
          <span className="text-right">Level</span>
        </div>

        {/* Rows — fill remaining space */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {highscores.length === 0 ? (
            <div className="flex-1 flex items-center justify-center bg-slate-700 text-slate-400 italic text-lg">
              No scores yet — be the first to play!
            </div>
          ) : (
            highscores.map((entry) => {
              const medal = MEDALS[entry.rank];
              return (
                <div
                  key={entry.id}
                  className={`grid grid-cols-[5rem_1fr_10rem_8rem] items-center px-6 flex-1 text-base border-b border-slate-600/50 last:border-b-0 ${
                    medal ? medal.row : "bg-slate-700/40"
                  }`}
                >
                  <span className="text-center text-5xl">
                    {medal ? medal.emoji : <span className="text-slate-500 text-3xl font-bold">{entry.rank}</span>}
                  </span>
                  <span className="text-white font-medium truncate pr-2 text-lg">
                    {entry.name || <span className="text-slate-500 italic">Anonymous</span>}
                  </span>
                  <span className={`text-right font-bold tabular-nums text-lg ${medal ? medal.score : "text-white"}`}>
                    {entry.score}
                  </span>
                  <span className="text-right text-slate-400 tabular-nums text-lg">{entry.level}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default HighscoresController;
