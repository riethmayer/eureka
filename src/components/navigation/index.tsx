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
      <div className="flex w-full items-center bg-gray-300 justify-between py-4">
        <LogoButton />
        <div className="flex items-center justify-center gap-6">
          <GameControl />
          <TimeRemaining />
          <Link href="/highscores">
            <Score />
          </Link>
          <Level />

          <div className="flex items-center justify-center mr-8">{name}</div>
        </div>
      </div>
      <ProgressBar />
    </>
  );
};

export default Navigation;
