"use client";
import { useGameStore } from "@/zustand/game-store";

const TimeRemaining = () => {
  const formattedTimeRemaining = useGameStore((state) =>
    state.formattedTimeRemaining()
  );
  const isGameRunning = useGameStore((state) => state.isGameRunning());

  return (
    <div className="w-9">
      {
        <div className="">
          {(isGameRunning && formattedTimeRemaining) || " "}
        </div>
      }
    </div>
  );
};

export default TimeRemaining;
