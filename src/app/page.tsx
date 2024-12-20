"use client";
import Button, { ButtonType } from "@/components/common/button";
import EurekaLogo from "@/components/eureka-logo";
import Link from "next/link";
import { useGameStore } from "@/zustand/game-store";
import { useEffect, useRef } from "react";
import { getCookie, setCookie } from "@/utils/cookie-utils";

const IndexPage: React.FC = () => {
  const { start } = useGameStore();
  const { changeName } = useGameStore();
  const name = useGameStore((state) => state.name);
  const hasRunOnce = useRef(false);

  // Load the user's name from the cookie.
  useEffect(() => {
    const storedName = getCookie("userName");
    if (storedName && !hasRunOnce.current) {
      changeName(storedName);
    }
    hasRunOnce.current = true;
  }, [changeName]);

  // Save the user's changed name to the cookie.
  useEffect(() => {
    setCookie("userName", name);
  }, [name]);

  return (
    <div className="flex flex-col justify-center py-12 items-center">
      <EurekaLogo variant="large" />
      <h1 className="text-center py-4 text-yellow-50">
        Eureka, a mahjong style solitaire game.
      </h1>
      <p className="mb-4">
        <span className="text-white mr-2">Enter your name:</span>
        <input
          maxLength={24}
          type="text"
          placeholder="for highscores only"
          value={name}
          onChange={(e) => changeName(e.target.value)}
          className="border-2 border-gray-200 rounded-md bg-inherit border-none p-1 inline-flex text-white focus:ring-4 focus:ring-yellow-500 focus:outline-none"
        />
      </p>
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
