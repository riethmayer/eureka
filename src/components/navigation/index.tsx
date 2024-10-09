import Link from "next/link";
import EurekaLogo from "@/components/eureka-logo";
import ProfilePicture from "./profile-picture";
import ProgressBar from "./progress-bar";
import Score from "./score";
import Level from "./level";
import GameControl from "@/components/game-control";
import TimeRemaining from "./time-remaining";
import LogoButton from "@/components/navigation/logo-button";
const Navigation = () => {
  return (
    <>
      <div className="flex w-full items-center bg-gray-300 justify-between py-4">
        <LogoButton />
        <div className="flex items-center justify-center gap-6">
          <GameControl />
          <TimeRemaining />
          <Link href="/highscores">
            <Score />
          </Link>
          <Level />

          <div className="flex items-center justify-center mr-8">
            <ProfilePicture imageUrl="" />
          </div>
        </div>
      </div>
      <ProgressBar />
    </>
  );
};

export default Navigation;
