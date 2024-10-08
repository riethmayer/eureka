"use client";
import Button, { ButtonType } from "@/components/common/button";
import useGameStore from "@/zustand/game-store";
import Link from "next/link";

const LevelUp = () => {
  const { continueNextLevel } = useGameStore();
  const level = useGameStore((state) => state.level);
  return (
    <div className=" flex flex-col align-middle items-center">
      <h1 className="my-12 text-white text-5xl"> LEVEL {level - 1} CLEAR! </h1>
      <Link href="/play">
        <Button variant={ButtonType.resume} onClick={() => continueNextLevel()}>
          Continue
        </Button>
      </Link>
    </div>
  );
};

export default LevelUp;
