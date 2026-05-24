import getHighscores from "@/db/select-game";
import Leaderboard from "@/components/leaderboard";

// ISR: serve a pre-rendered leaderboard and refresh it at most once every 30s.
// A top-10 all-time board tolerates slight staleness, and this avoids the
// ~2.5s per-request render (and cold-start timeouts) that made the page feel
// "unavailable". On a DB hiccup, Next keeps serving the last good page rather
// than erroring — strictly more resilient than rendering live on every request.
export const revalidate = 30;

const HighscoresController = async () => {
  const highscores = await getHighscores();

  return (
    <div className="flex flex-col items-center px-2 sm:px-4 pt-6 sm:pt-8 pb-4 h-full">
      {/* Header */}
      <div className="mb-4 sm:mb-6 text-center shrink-0">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-widest uppercase">
          Highscores
        </h1>
        <p className="text-slate-400 mt-1 text-xs sm:text-sm tracking-wide">Top 10 all-time players</p>
      </div>

      {/* Leaderboard (client component): renders the cached server data and
          optimistically merges the player's just-finished score so it appears
          immediately, before the 30s ISR cache refreshes. */}
      <Leaderboard initial={highscores} />
    </div>
  );
};

export default HighscoresController;
