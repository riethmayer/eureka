"use client";
import Link from "next/link";
import Button, { ButtonType } from "@/components/common/button";
import { useGameStore } from "@/zustand/game-store";

const GameOver = () => {
  const { start } = useGameStore();
  const score = useGameStore((state) => state.score);
  const level = useGameStore((state) => state.level);
  return (
    <div className="flex flex-col justify-center items-center py-16 gap-8">
      <h1 className="text-white text-6xl font-extrabold tracking-widest">
        GAME OVER
      </h1>
      <div className="flex gap-12 text-white text-xl">
        <span>
          Score: <strong className="text-yellow-300">{score}</strong>
        </span>
        <span>
          Level: <strong className="text-yellow-300">{level}</strong>
        </span>
      </div>
      <Link href="/play">
        <Button variant={ButtonType.play} onClick={() => start()}>
          Play Again
        </Button>
      </Link>
    </div>
  );
};

export default GameOver;
