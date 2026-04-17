"use client";
import Turtle from "@/components/turtle-base/Turtle";
import { useGameStore } from "@/zustand/game-store";

const GameBoard = () => {
  const isRestarting = useGameStore((state) => state.isRestarting);

  if (isRestarting) {
    return (
      <div className="game-board m-auto flex items-center justify-center">
        <p className="text-slate-400 text-lg font-semibold animate-pulse">
          Restarting game…
        </p>
      </div>
    );
  }

  return (
    <div className="game-board m-auto relative">
      <Turtle />
    </div>
  );
};

export default GameBoard;
