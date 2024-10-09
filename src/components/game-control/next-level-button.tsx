"use client";
import Link from "next/link";
import Button, { ButtonType } from "../common/button";
import { useGameStore } from "@/zustand/game-store";

const NextLevelButton = () => {
  const { continueNextLevel } = useGameStore();
  return (
    <Link href="/play">
      <Button variant={ButtonType.play} onClick={continueNextLevel}>
        Continue
      </Button>
    </Link>
  );
};

export default NextLevelButton;
