import React from "react";
import Image from "next/image";
import eurekaLogo from "/public/Eureka-logo.svg";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  pause,
  resume,
  restart,
  selectGameOver,
  selectGameRunning,
  selectTimeLeft,
  startGame,
} from "@store/constraints";
import { TIME_TO_SOLVE as maxTime } from "@store/constraints";
import { selectScore } from "@store/score";
import GameControl from "./GameControl";

function NavBar() {
  const timeLeft = useAppSelector(selectTimeLeft);
  const percentage = (timeLeft / maxTime) * 100;
  const score = useAppSelector(selectScore);

  return (
    <>
      <div className="flex w-full items-center bg-gray-300 justify-between px-2 py-4">
        <div className="flex items-center text-gray-700">
          <a href="/" className="px-1">
            <Image alt="Eureka logo" height={50} src={eurekaLogo} width={220} />
          </a>
        </div>

        <a style={styles.link} href="/highscore">
          {score} Punkte
        </a>
      </div>
      <div className="bg-gray-700">
        <div
          className={`${percentage <= 50 ? "bg-red-700" : "bg-green-600"} h-1`}
          style={{ width: `${percentage}%` }}
        ></div>
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
};

export default NavBar;
