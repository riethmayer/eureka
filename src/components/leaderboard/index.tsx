"use client";

import { useMemo } from "react";
import { useGameStore } from "@/zustand/game-store";

export interface HighscoreRow {
  id: string;
  name: string;
  score: number;
  level: number;
  created_at: string;
  rank: number;
}

const LIMIT = 10;

const MEDALS: Record<number, { emoji: string; row: string; score: string }> = {
  1: { emoji: "🥇", row: "bg-yellow-900/40 border-l-4 border-yellow-400", score: "text-yellow-300" },
  2: { emoji: "🥈", row: "bg-slate-700/60 border-l-4 border-slate-400", score: "text-slate-300" },
  3: { emoji: "🥉", row: "bg-orange-900/30 border-l-4 border-orange-400", score: "text-orange-300" },
};

interface LeaderboardProps {
  /** Server-rendered top-10, revalidated by ISR every 30s. */
  initial: HighscoreRow[];
}

const Leaderboard = ({ initial }: LeaderboardProps) => {
  // The player's just-finished game stays in the store until they start a new
  // one (endGame() leaves score/level/gameId/name intact). We optimistically
  // merge it into the cached top-10 so a fresh high score shows up immediately,
  // before the ISR cache (refreshed every 30s) catches up. Purely presentational
  // and self-correcting: once the server list includes them, we dedupe by id.
  const gameId = useGameStore((s) => s.gameId);
  const name = useGameStore((s) => s.name);
  const score = useGameStore((s) => s.score);
  const level = useGameStore((s) => s.level);

  const { rows, youId } = useMemo(() => {
    const merged: Omit<HighscoreRow, "rank">[] = initial.map((r) => ({
      id: r.id,
      name: r.name,
      score: r.score,
      level: r.level,
      created_at: r.created_at,
    }));

    let you: string | null = null;
    if (gameId && score > 0) {
      you = gameId;
      if (!merged.some((r) => r.id === gameId)) {
        merged.push({ id: gameId, name, score, level, created_at: new Date().toISOString() });
      }
    }

    // Mirror the server ordering: score desc, then most recent first.
    const ranked: HighscoreRow[] = merged
      .sort((a, b) => b.score - a.score || b.created_at.localeCompare(a.created_at))
      .slice(0, LIMIT)
      .map((r, i) => ({ ...r, rank: i + 1 }));

    // If the optimistic entry didn't crack the top 10, don't highlight anything.
    if (you && !ranked.some((r) => r.id === you)) you = null;

    return { rows: ranked, youId: you };
  }, [initial, gameId, name, score, level]);

  return (
    <div className="w-full sm:w-[80vw] rounded-2xl overflow-hidden shadow-2xl border border-slate-600 flex flex-col flex-1 min-h-0">
      {/* Table header */}
      <div className="grid grid-cols-[2.5rem_1fr_5rem_4rem] sm:grid-cols-[5rem_1fr_10rem_8rem] bg-slate-900 text-slate-400 uppercase text-xs sm:text-sm font-bold tracking-widest px-3 sm:px-6 py-3 sm:py-4 shrink-0">
        <span className="text-center">#</span>
        <span>Player</span>
        <span className="text-right">Score</span>
        <span className="text-right">Level</span>
      </div>

      {/* Rows — fill remaining space, scroll if needed */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {rows.length === 0 ? (
          <div className="flex-1 flex items-center justify-center bg-slate-700 text-slate-400 italic text-base sm:text-lg">
            No scores yet — be the first to play!
          </div>
        ) : (
          rows.map((entry) => {
            const medal = MEDALS[entry.rank];
            const isYou = entry.id === youId;
            return (
              <div
                key={entry.id}
                className={`grid grid-cols-[2.5rem_1fr_5rem_4rem] sm:grid-cols-[5rem_1fr_10rem_8rem] items-center px-3 sm:px-6 flex-1 text-sm sm:text-base border-b border-slate-600/50 last:border-b-0 ${
                  medal ? medal.row : "bg-slate-700/40"
                } ${isYou ? "ring-2 ring-inset ring-cyan-400/80" : ""}`}
              >
                <span className="text-center text-2xl sm:text-5xl">
                  {medal ? (
                    medal.emoji
                  ) : (
                    <span className="text-slate-500 text-xl sm:text-3xl font-bold">{entry.rank}</span>
                  )}
                </span>
                <span className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="text-white font-medium truncate text-sm sm:text-lg">
                    {entry.name || <span className="text-slate-500 italic">Anonymous</span>}
                  </span>
                  {isYou && (
                    <span className="shrink-0 rounded-full bg-cyan-400/90 text-slate-900 text-[10px] sm:text-xs font-bold px-2 py-0.5 uppercase tracking-wide">
                      You
                    </span>
                  )}
                </span>
                <span
                  className={`text-right font-bold tabular-nums text-sm sm:text-lg ${
                    medal ? medal.score : "text-white"
                  }`}
                >
                  {entry.score}
                </span>
                <span className="text-right text-slate-400 tabular-nums text-sm sm:text-lg">
                  {entry.level}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
