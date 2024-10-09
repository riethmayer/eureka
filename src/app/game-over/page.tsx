"use client";
import Link from "next/link";
import Button, { ButtonType } from "@/components/common/button";
import { useGameStore } from "@/zustand/game-store";

const GameOver = () => {
  const { start } = useGameStore();
  return (
    <div className="bg-slate-200 px-10 py-10">
      <h1>GAME OVER</h1>

      <div className="relative bg-slate-200 rounded-xl py-4">
        <Link href="/play">
          <Button variant={ButtonType.play} onClick={() => start()}>
            Start New
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default GameOver;
