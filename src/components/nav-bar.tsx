import React, { useEffect, useState } from "react";
import { useAppSelector } from "@store/hooks";
import { selectTimeLeft } from "@store/controls";
import { TIME_TO_SOLVE as maxTime } from "@store/controls";
import { selectScore } from "@store/score";
import level, { selectLevel } from "@store/level";
import EurekaLogo from "./eureka-logo";
import GameControl from "./game-control";
import Image from "next/image";
import Link from "next/link";

function NavBar() {
  const timeLeft = useAppSelector(selectTimeLeft);
  const percentage = (timeLeft / maxTime) * 100;
  const score = useAppSelector(selectScore);
  const level = useAppSelector(selectLevel);
  const [picUrl, setPic] = useState(null);

  const ProfilePicture = () => {
    return (
      <div className="flex items-center justify-center mr-8">
        {picUrl && (
          <Image
            src={picUrl}
            className="w-12 h-12 rounded-full border-white border-2 shadow-sm hover:border-yellow-400 hover:shadow-lg shadow-black"
            width={48}
            height={48}
            alt="Profile Picture"
            referrerPolicy="no-referrer"
            priority
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex w-full items-center bg-gray-300 justify-between px-2 py-4">
        <div className="flex items-center text-gray-700">
          <Link href="/" className="px-1 ml-8">
            <EurekaLogo variant="small" />
          </Link>
        </div>

        <div className="flex items-center text-gray-700">
          <GameControl />
          <Link href="/highscore" style={styles.link}>
            {score} Points
          </Link>
          <div className="flex items-center text-gray-700" style={styles.text}>
            Level {level}
          </div>
          <ProfilePicture />
        </div>
      </div>
      <div className="bg-gray-700">
        <div
          className={`${percentage <= 50 ? "bg-red-700" : "bg-green-600"} h-2`}
          style={{ width: `${percentage}%` }}
        >
        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  link: {
    cursor: "pointer",
    fontSize: "20px",
    fontWeight: 500,
    lineHeight: "30px",
    padding: "0 3rem",
    textDecoration: "none",
  },
  text: {
    fontSize: "20px",
    fontWeight: 500,
    lineHeight: "30px",
    padding: "0 3rem",
    textDecoration: "none",
  },
};

export default NavBar;
