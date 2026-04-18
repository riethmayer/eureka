"use client";
import Link from "next/link";
import { useGameStore } from "@/zustand/game-store";

const Paused = () => {
  const { resume } = useGameStore();
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-10 px-4">
      <h1 className="text-white text-5xl font-extrabold tracking-wider">PAUSED</h1>
      <Link href="/play">
        <button
          onClick={resume}
          className="flex items-center gap-3 px-10 py-4 bg-[#6b2070] hover:bg-[#8f2297] text-white text-xl font-bold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
          </svg>
          Resume
        </button>
      </Link>
    </div>
  );
};

export default Paused;
