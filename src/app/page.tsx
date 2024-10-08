"use client";
import Button, { ButtonType } from "@/components/common/button";
import EurekaLogo from "@/components/eureka-logo";
import Link from "next/link";
import { useGameStore } from "@/zustand/game-store";
import { FC } from "react";

const IndexPage: FC = () => {
  const { start } = useGameStore();

  return (
    <div className="flex flex-col justify-center py-12 items-center">
      <EurekaLogo variant="large" />
      <h1 className="text-center py-4 text-yellow-50">
        Eureka, a mahjong style solitaire game.
      </h1>
      <div className="flex flex-row align-middle">
        <Link href="/play">
          <Button variant={ButtonType.play} onClick={() => start()}>
            Start
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default IndexPage;
