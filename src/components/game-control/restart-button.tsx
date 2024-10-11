"use client";
import Link from "next/link";
import Button, { ButtonType } from "../common/button";
import { useGameStore } from "@/zustand/game-store";

const RestartButton = () => {
  const { restart } = useGameStore();
  return (
    <Link href="/play">
      <Button variant={ButtonType.restart} onClick={restart}>
        Restart
      </Button>
    </Link>
  );
};

export default RestartButton;
