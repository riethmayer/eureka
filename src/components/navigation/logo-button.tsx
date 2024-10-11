"use client";
import { useGameStore } from "@/zustand/game-store";
import Link from "next/link";
import EurekaLogo from "../eureka-logo";

const LogoButton = () => {
  const withdraw = useGameStore((state) => state.withdraw);
  return (
    <Link href="/" className="px-1 ml-8" onClick={() => withdraw()}>
      <EurekaLogo variant="small" />
    </Link>
  );
};

export default LogoButton;
