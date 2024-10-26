"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useGameStore } from "@/zustand/game-store";

import {
  PlayButton,
  PauseButton,
  NextLevelButton,
  RestartButton,
  ResumeButton,
} from "@/components/common/button";

const GameControl: React.FC = () => {
  const pathname = usePathname();
  const isGameRunning = useGameStore((state) => state.isGameRunning());
  const isLevelClear = useGameStore((state) => state.isLevelClear());

  if (pathname === "/play") {
    if (isLevelClear) {
      return <NextLevelButton>Next</NextLevelButton>;
    }
    if (isGameRunning) {
      return (
        <>
          <PauseButton>Pause</PauseButton>
          <RestartButton>Restart</RestartButton>
        </>
      );
    }
    return <PlayButton>Play</PlayButton>;
  }

  if (pathname === "/paused") {
    return <ResumeButton>Resume</ResumeButton>;
  }

  return null;
};

export default GameControl;
