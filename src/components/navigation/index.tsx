"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import ProgressBar from "./progress-bar";
import Score from "./score";
import Level from "./level";
import GameControl from "@/components/game-control";
import TimeRemaining from "./time-remaining";
import LogoButton from "@/components/navigation/logo-button";
import useGameStore from "@/zustand/game-store";
import { getCookie } from "@/utils/cookie-utils";

const Navigation = () => {
  const name = useGameStore((state) => state.name);
  const changeName = useGameStore((state) => state.changeName);
  const pause = useGameStore((state) => state.pause);
  const isGameRunning = useGameStore((state) => state.isGameRunning());
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    const stored = getCookie("userName");
    if (stored) changeName(stored);
  }, [changeName]);

  return (
    <>
      <div className="flex w-full items-center bg-gray-300 justify-between py-2 px-3 gap-x-4 gap-y-1 flex-wrap">
        <div className="flex-1 flex justify-center sm:flex-none sm:justify-start">
          <LogoButton />
        </div>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <GameControl />
          <TimeRemaining />
          <Link
            href="/highscores"
            className="underline underline-offset-2 decoration-dotted text-sm font-semibold text-gray-700 hover:text-purple-700"
            onClick={() => { if (isGameRunning) pause(); }}
          >
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
