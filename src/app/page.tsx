"use client";
import Link from "next/link";
import EurekaLogo from "@/components/eureka-logo";
import { useGameStore } from "@/zustand/game-store";
import { useEffect } from "react";
import { setCookie } from "@/utils/cookie-utils";

const IndexPage: React.FC = () => {
  const { changeName, start } = useGameStore();
  const name = useGameStore((state) => state.name);

  // Persist name changes to cookie (only when non-empty to avoid wiping a stored name).
  useEffect(() => {
    if (name) setCookie("userName", name);
  }, [name]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-10 px-4">
      <EurekaLogo variant="large" />

      <p className="text-slate-300 text-xl text-center leading-relaxed max-w-sm">
        Match all tiles before the timer runs out.
      </p>

      <div className="flex flex-col items-center gap-3">
        <label className="text-slate-400 text-sm uppercase tracking-widest font-semibold">
          Your name <span className="normal-case text-slate-500">(for highscores)</span>
        </label>
        <input
          maxLength={24}
          type="text"
          placeholder="anonymous"
          value={name}
          onChange={(e) => changeName(e.target.value)}
          className="w-64 px-4 py-3 rounded-xl bg-slate-700 border-2 border-slate-500 text-white text-lg text-center placeholder:text-slate-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 transition-colors"
        />
      </div>

      <Link href="/play">
        <button
          onClick={() => start()}
          className="flex items-center gap-3 px-10 py-4 bg-[#6b2070] hover:bg-[#8f2297] text-white text-xl font-bold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
          </svg>
          Start Game
        </button>
      </Link>
    </div>
  );
};

export default IndexPage;
