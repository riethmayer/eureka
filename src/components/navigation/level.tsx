"use client";

import { useGameStore } from "@/zustand/game-store";

const Level = () => {
  const level = useGameStore((state) => state.level);
  return <>Level: {level}</>;
};

export default Level;
