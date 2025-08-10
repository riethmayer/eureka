"use client";
import Button, { ButtonType } from "@/components/common/button";
import EurekaLogo from "@/components/eureka-logo";
import Link from "next/link";
import { useGameStore } from "@/zustand/game-store";
import { useEffect, useRef } from "react";
import { getCookie, setCookie } from "@/utils/cookie-utils";

const TitleAnimation: React.FC = () => {
  return (
    <div className="relative w-full h-72 overflow-hidden flex flex-col items-center bg-gradient-to-b from-sky-500 via-sky-300 to-sky-200">
      {/* Moving clouds */}
      <div className="cloud cloud1"></div>
      <div className="cloud cloud2"></div>

      {/* Waves */}
      <div className="wave wave1">
        <svg
          viewBox="0 0 1440 80"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40 Q 80 60 160 40 T 320 40 T 480 40 T 640 40 T 800 40 T 960 40 T 1120 40 T 1280 40 T 1440 40 V80 H0 Z"
            fill="rgb(96 165 250 / 0.5)"
          />
        </svg>
        <svg
          viewBox="0 0 1440 80"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40 Q 80 60 160 40 T 320 40 T 480 40 T 640 40 T 800 40 T 960 40 T 1120 40 T 1280 40 T 1440 40 V80 H0 Z"
            fill="rgb(96 165 250 / 0.5)"
          />
        </svg>
        <svg
          viewBox="0 0 1440 80"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40 Q 80 60 160 40 T 320 40 T 480 40 T 640 40 T 800 40 T 960 40 T 1120 40 T 1280 40 T 1440 40 V80 H0 Z"
            fill="rgb(96 165 250 / 0.5)"
          />
        </svg>
      </div>
      <div className="wave wave2">
        <svg
          viewBox="0 0 1440 80"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 30 Q 60 50 120 30 T 240 30 T 360 30 T 480 30 T 600 30 T 720 30 T 840 30 T 960 30 T 1080 30 T 1200 30 T 1320 30 T 1440 30 V80 H0 Z"
            fill="rgb(37 99 235 / 0.5)"
          />
        </svg>
        <svg
          viewBox="0 0 1440 80"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 30 Q 60 50 120 30 T 240 30 T 360 30 T 480 30 T 600 30 T 720 30 T 840 30 T 960 30 T 1080 30 T 1200 30 T 1320 30 T 1440 30 V80 H0 Z"
            fill="rgb(37 99 235 / 0.5)"
          />
        </svg>
        <svg
          viewBox="0 0 1440 80"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 30 Q 60 50 120 30 T 240 30 T 360 30 T 480 30 T 600 30 T 720 30 T 840 30 T 960 30 T 1080 30 T 1200 30 T 1320 30 T 1440 30 V80 H0 Z"
            fill="rgb(37 99 235 / 0.5)"
          />
        </svg>
      </div>

      {/* Boat with character */}
      <div className="boat">
        <div className="boat-body"></div>
        <div className="character"></div>
      </div>

      {/* Title/logo on top of the animation */}
      <div className="absolute inset-x-0 top-4 flex justify-center">
        <EurekaLogo variant="large" />
      </div>

      {/* Component-specific styling */}
      <style jsx>{`
        .wave {
          position: absolute;
          bottom: 0;
          width: 300%;
          height: 80px;
          display: flex;
          overflow: hidden;
        }
        .wave-svg {
          width: 33.3333%;
          height: 100%;
        }
        .wave1 {
          animation: waveSlide1 15s linear infinite;
        }
        .wave2 {
          bottom: -10px;
          animation: waveSlide2 20s linear infinite;
        }
        @keyframes waveSlide1 {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.3333%);
          }
        }
        @keyframes waveSlide2 {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .boat {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          animation: boatFloat 6s ease-in-out infinite;
        }
        @keyframes boatFloat {
          0%,
          100% {
            transform: translate(-50%, 0);
          }
          50% {
            transform: translate(-50%, -10px);
          }
        }
        .boat-body {
          width: 100px;
          height: 40px;
          background: #8b4513;
          border-bottom-left-radius: 60% 100%;
          border-bottom-right-radius: 60% 100%;
        }
        .character {
          position: absolute;
          bottom: 35px;
          left: 50%;
          width: 20px;
          height: 20px;
          background: #ffd700;
          border-radius: 50%;
          transform: translateX(-50%);
        }
        .cloud {
          position: absolute;
          top: 20px;
          width: 120px;
          height: 60px;
          background: #ffffff;
          border-radius: 50%;
          opacity: 0.8;
          box-shadow:
            40px 10px 0 0 #ffffff,
            -40px 10px 0 0 #ffffff,
            0 10px 0 0 #ffffff;
        }
        .cloud1 {
          position: absolute;
          top: 20px;
          left: -200px; /* start well off-screen */
          width: 140px;
          height: 70px;
          opacity: 0.85;
          background: #ffffff;
          border-radius: 50%;
          box-shadow:
            60px 20px 0 0 #ffffff,
            -40px 15px 0 0 #ffffff,
            20px 25px 0 0 #ffffff;
          animation: cloudMove1 50s linear infinite;
        }

        .cloud2 {
          position: absolute;
          top: 60px;
          left: -300px;
          width: 160px;
          height: 80px;
          opacity: 0.8;
          background: #ffffff;
          border-radius: 50%;
          box-shadow:
            50px 20px 0 0 #ffffff,
            -30px 15px 0 0 #ffffff,
            25px 25px 0 0 #ffffff;
          animation: cloudMove2 70s linear infinite;
        }

        @keyframes cloudMove1 {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(200vw);
          } /* travel across the viewport plus extra */
        }

        @keyframes cloudMove2 {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(220vw);
          }
        }
      `}</style>
    </div>
  );
};

const IndexPage: React.FC = () => {
  const { start, changeName } = useGameStore();
  const name = useGameStore((state) => state.name);
  const hasRunOnce = useRef(false);

  // load and save cookie (unchanged)...

  return (
    <div className="flex flex-col justify-center py-12 items-center">
      <TitleAnimation />
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
