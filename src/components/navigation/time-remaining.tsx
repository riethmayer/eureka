"use client";
import { useGameStore } from "@/zustand/game-store";

const TimeRemaining = () => {
  const formattedTimeRemaining = useGameStore((state) =>
    state.formattedTimeRemaining()
  );
  const isGameRunning = useGameStore((state) => state.isGameRunning());

  return (
    <div className="min-w-[3rem] tabular-nums">
      {(isGameRunning && formattedTimeRemaining) || ""}
    </div>
  );
};

export default TimeRemaining;
