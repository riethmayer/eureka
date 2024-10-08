"use client";

import { useGameStore } from "@/zustand/game-store";

const ProgressBar = () => {
  const timeRemaining = useGameStore((state) => state.timeRemaining);
  const maxTime = useGameStore((state) => state.maxTime);
  const percentage = (timeRemaining / maxTime) * 100;

  const indicator = percentage <= 50 ? "bg-red-700" : "bg-green-600";
  return (
    <div className="bg-gray-700">
      <div
        className={`${indicator} h-2`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
