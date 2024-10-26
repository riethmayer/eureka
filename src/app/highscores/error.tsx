"use client";
import Link from "next/link";
import { PlayButton } from "@/components/common/button";

const Error = () => {
  return (
    <div className="flex mt-8 flex-col justify-top h-screen w-screen items-center">
      <div className="w-[50%] rounded-xl border-8 border-red-300">
        <h1 className="text-5xl text-white bg-purple-700 w-full text-center font-extrabold py-2">
          Highscore
        </h1>
        <p className="text-red-500 p-1">
          Failed to load highscores. Please try again later.
        </p>
      </div>
      <div className="relative bg-slate-200 mt-8 rounded-xl px-10 py-4">
        <Link href="/play">
          <PlayButton>Play</PlayButton>
        </Link>
      </div>
    </div>
  );
};

export default Error;
