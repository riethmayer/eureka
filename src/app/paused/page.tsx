"use client";
import Link from "next/link";
import Button, { ButtonType } from "@/components/common/button";
import { useGameStore } from "@/zustand/game-store";

const Paused = () => {
  const { resume } = useGameStore();
  return (
    <div className="flex flex-col justify-center items-center py-16 gap-8">
      <h1 className="text-white text-5xl font-extrabold tracking-wider">PAUSED</h1>
      <Link href="/play">
        <Button variant={ButtonType.resume} onClick={resume}>
          Resume
        </Button>
      </Link>
    </div>
  );
};

export default Paused;
