"use client";
import { useGameStore } from "@/zustand/game-store";
import Link from "next/link";
import EurekaLogo from "../eureka-logo";

const LogoButton = () => {
  const pause = useGameStore((state) => state.pause);
  return (
    <Link href="/" className="px-1 ml-8" onClick={() => pause()}>
      <EurekaLogo variant="small" />
    </Link>
  );
};

export default LogoButton;
