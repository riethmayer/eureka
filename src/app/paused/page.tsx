"use client";
import Button, { ButtonType } from "@/components/common/button";
import { useGameStore } from "@/zustand/game-store";
import Link from "next/link";

const Paused = () => {
  const { resume } = useGameStore();
  return (
    <div className=" flex flex-col align-middle items-center">
      <h1 className="my-12 text-white text-5xl">PAUSE</h1>
      <Link href="/play">
        <Button variant={ButtonType.resume} onClick={resume}>
          Resume
        </Button>
      </Link>
    </div>
  );
};

export default Paused;
