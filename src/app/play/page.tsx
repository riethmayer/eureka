"use client";

import { useEffect } from "react";
import GameBoard from "@/components/game-board";
import { useGameStore } from "@/zustand/game-store";
import { useRouter } from "next/navigation";
import RankToast from "@/components/rank-toast";

export default function Game() {
  const gameOver = useGameStore((state) => state.gameOver);
  const isLevelClear = useGameStore((state) => state.levelClear);
  const router = useRouter();

  useEffect(() => {
    if (isLevelClear) {
      router.replace("/next-level");
    }
  }, [isLevelClear, router]);

  useEffect(() => {
    if (gameOver) {
      router.replace("/game-over");
    }
  }, [gameOver, router]);
  return (
    <div className="flex-1 min-h-0 overflow-auto overscroll-contain">
      <div className="min-h-full flex flex-col justify-center">
        <GameBoard />
      </div>
      <RankToast />
    </div>
  );
}
