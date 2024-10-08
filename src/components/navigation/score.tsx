"use client";

import { useGameStore } from "@/zustand/game-store";

const Score = () => {
  const score = useGameStore((state) => state.score);
  return <>Score: {score}</>;
};

export default Score;
