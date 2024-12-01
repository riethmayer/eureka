import Link from "next/link";
import { PlayButton } from "@/components/common/button";

const GameOver = () => {
  return (
    <div className="bg-slate-200 px-10 py-10">
      <h1>GAME OVER</h1>

      <div className="relative bg-slate-200 rounded-xl py-4">
        <Link href="/play">
          <PlayButton>Play</PlayButton>
        </Link>
      </div>
    </div>
  );
};

export default GameOver;
