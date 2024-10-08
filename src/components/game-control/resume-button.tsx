"use client";
import Link from "next/link";
import Button, { ButtonType } from "../common/button";
import { useGameStore } from "@/zustand/game-store";

const ResumeButton = () => {
  const { resume } = useGameStore();
  return (
    <Link href="/play">
      <Button variant={ButtonType.resume} onClick={resume}>
        Resume
      </Button>
    </Link>
  );
};

export default ResumeButton;
