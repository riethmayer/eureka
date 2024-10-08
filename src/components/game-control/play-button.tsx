"use client";
import Link from "next/link";
import Button, { ButtonType } from "../common/button";
import { useGameStore } from "@/zustand/game-store";

const PlayButton = () => {
  const { start } = useGameStore();
  return (
    <Link href="/play">
      <Button variant={ButtonType.play} onClick={start}>
        Start New
      </Button>
    </Link>
  );
};

export default PlayButton;
