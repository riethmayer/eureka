"use client";

import { usePathname } from "next/navigation";
import { useGameStore } from "@/zustand/game-store";

import {
  PauseButton,
  PlayButton,
  NextLevelButton,
  RestartButton,
} from "@/components/common/button";

const GameControl = () => {
  const pathname = usePathname();
  const isGameRunning = useGameStore((state) => state.isGameRunning());

  return (
    <>
      {pathname === "/play" &&
        (isGameRunning ? (
          <PauseButton>Pause</PauseButton>
        ) : (
          <PlayButton>Play</PlayButton>
        ))}
      {pathname === "/level-clear" ? (
        <NextLevelButton>Next</NextLevelButton>
      ) : null}
      {pathname === "/game-over" ? (
        <RestartButton>Restart</RestartButton>
      ) : null}
      {isGameRunning ? <RestartButton>Restart</RestartButton> : null}
    </>
  );
};

export default GameControl;
