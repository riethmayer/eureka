"use client";
import { useEffect } from "react";

import { useGameStore, unsubscribe } from "@/zustand/game-store";
import { is } from "drizzle-orm";

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
