"use client";
import { useEffect } from "react";
import GameBoard from "@/components/game-board";
import { useGameStore } from "@/zustand/game-store";
import { useRouter } from "next/navigation";

export default function Game() {
  const isGameRunning = useGameStore((state) => state.isGameRunning());
  const gameOver = useGameStore((state) => state.gameOver);
  const isLevelClear = useGameStore((state) => state.isLevelClear());
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
  return <div className="relative">{isGameRunning && <GameBoard />}</div>;
}
