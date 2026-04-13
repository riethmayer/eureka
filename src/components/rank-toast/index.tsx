"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useGameStore } from "@/zustand/game-store";

const PODIUM = {
  1: {
    emoji: "🥇",
    label: "Champion!",
    gradient: "from-yellow-500 via-yellow-600 to-amber-700",
    border: "border-yellow-400",
    glow: "shadow-yellow-500/60",
    text: "text-yellow-100",
    sub: "text-yellow-200",
  },
  2: {
    emoji: "🥈",
    label: "Runner-up!",
    gradient: "from-slate-400 via-slate-500 to-slate-600",
    border: "border-slate-300",
    glow: "shadow-slate-400/60",
    text: "text-slate-100",
    sub: "text-slate-200",
  },
  3: {
    emoji: "🥉",
    label: "3rd Place!",
    gradient: "from-orange-500 via-orange-600 to-amber-800",
    border: "border-orange-400",
    glow: "shadow-orange-500/60",
    text: "text-orange-100",
    sub: "text-orange-200",
  },
} as const;

const CONFETTI_COLORS = {
  1: ["#FFD700", "#FFC200", "#FF8C00", "#FFFFFF"],
  2: ["#E8E8E8", "#C0C0C0", "#A0A0A0", "#FFFFFF"],
  3: ["#CD7F32", "#D2691E", "#FF8C00", "#FFFFFF"],
};

function fireConfetti(rank: 1 | 2 | 3) {
  const colors = CONFETTI_COLORS[rank];
  const count = rank === 1 ? 220 : rank === 2 ? 150 : 100;

  confetti({ particleCount: count, spread: 80, origin: { y: 0.55 }, colors });

  if (rank === 1) {
    setTimeout(() => confetti({ particleCount: 80, angle: 60,  spread: 60, origin: { x: 0, y: 0.6 }, colors }), 220);
    setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1, y: 0.6 }, colors }), 380);
  }
}

const VISIBLE_MS  = 5000;
const FADE_OUT_MS = 300;

const RankToast = () => {
  const lastGameRank = useGameStore((state) => state.lastGameRank);
  const [rank, setRank]     = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [fading, setFading]  = useState(false);

  useEffect(() => {
    if (lastGameRank === null) return;

    const capturedRank = lastGameRank;
    // Clear from store immediately so remounts (e.g. returning from highscores) don't re-fire.
    useGameStore.setState({ lastGameRank: null });

    setRank(capturedRank);
    setVisible(true);
    setFading(false);

    if (capturedRank <= 3) fireConfetti(capturedRank as 1 | 2 | 3);

    const fadeTimer = setTimeout(() => setFading(true),  VISIBLE_MS - FADE_OUT_MS);
    const hideTimer = setTimeout(() => setVisible(false), VISIBLE_MS);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, [lastGameRank]);

  if (!visible || rank === null) return null;

  const podium = rank <= 3 ? PODIUM[rank as 1 | 2 | 3] : null;
  const animClass = fading ? "animate-toast-out" : "animate-toast-in";
  const base = "fixed bottom-8 left-1/2 z-50 shadow-2xl";

  if (podium) {
    return (
      <div className={`${base} bg-gradient-to-br ${podium.gradient} border-2 ${podium.border} ${podium.glow} rounded-3xl px-16 py-8 flex flex-col items-center gap-2 ${animClass}`}>
        <span className="text-8xl leading-none">{podium.emoji}</span>
        <span className={`text-4xl font-extrabold tracking-wide ${podium.text}`}>{podium.label}</span>
        <span className={`text-lg font-medium ${podium.sub}`}>
          You ranked <strong>#{rank}</strong> on the leaderboard
        </span>
      </div>
    );
  }

  return (
    <div className={`${base} bg-slate-800 border border-slate-500 rounded-2xl px-12 py-6 flex flex-col items-center gap-1 ${animClass}`}>
      <span className="text-white font-bold text-2xl">You ranked <strong className="text-yellow-300">#{rank}</strong></span>
      <span className="text-slate-400 text-base">Keep playing to climb higher!</span>
    </div>
  );
};

export default RankToast;
