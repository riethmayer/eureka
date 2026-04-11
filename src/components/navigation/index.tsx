"use client";
import Link from "next/link";
import ProgressBar from "./progress-bar";
import Score from "./score";
import Level from "./level";
import GameControl from "@/components/game-control";
import TimeRemaining from "./time-remaining";
import LogoButton from "@/components/navigation/logo-button";
import useGameStore from "@/zustand/game-store";
const Navigation = () => {
  const name = useGameStore((state) => state.name);
  return (
    <>
      <div className="flex w-full items-center bg-gray-300 justify-between py-2 px-3 gap-x-4 gap-y-1 flex-wrap">
        <LogoButton />
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <GameControl />
          <TimeRemaining />
          <Link href="/highscores">
            <Score />
          </Link>
          <Level />
          {name && (
            <div className="flex items-center justify-center text-sm">{name}</div>
          )}
        </div>
      </div>
      <ProgressBar />
    </>
  );
};

export default Navigation;
