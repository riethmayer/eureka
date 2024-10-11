"use client";
import { usePathname } from "next/navigation";
import PausedButton from "@/components/game-control/paused-button";
import PlayButton from "@/components/game-control/play-button";
import ResumeButton from "@/components/game-control/resume-button";
import NextLevelButton from "@/components/game-control/next-level-button";
import RestartButton from "@/components/game-control/restart-button";
import { useGameStore } from "@/zustand/game-store";

const GameControl = () => {
  const pathname = usePathname();
  const isLevelClear = useGameStore((state) => state.isLevelClear());
  const isGameRunning = useGameStore((state) => state.isGameRunning());

  const actions: Record<string, React.FC> = {
    "/play": isLevelClear
      ? NextLevelButton
      : isGameRunning
        ? PausedButton
        : PlayButton,
    "/paused": ResumeButton,
    "/highscores": PlayButton,
    "/next-level": NextLevelButton,
  } as const;

  const Component = pathname && actions[pathname] ? actions[pathname] : null;

  return (
    <>
      {Component && <Component />}
      {isGameRunning && <RestartButton />}
    </>
  );
};

export default GameControl;
