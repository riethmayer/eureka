import Link from "next/link";
import Button, { ButtonType } from "../common/button";
import { useGameStore } from "@/zustand/game-store";

const PausedButton = () => {
  const { pause } = useGameStore();
  return (
    <Link href="/paused">
      <div className="flex flex-row gap-3 items-center">
        <Button variant={ButtonType.pause} onClick={pause}>
          Pause
        </Button>
      </div>
    </Link>
  );
};
export default PausedButton;
