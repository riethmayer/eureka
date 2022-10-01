import React, { useEffect, useState } from "react";
import { useAppSelector } from "@store/hooks";
import { selectTimeLeft } from "@store/constraints";
import { TIME_TO_SOLVE as maxTime } from "@store/constraints";
import { selectScore } from "@store/score";
import EurekaLogo from "./EurekaLogo";
import { useStytchUser } from "@stytch/nextjs";
import GameControl from "./GameControl";
import Image from "next/image";

function NavBar() {
  const timeLeft = useAppSelector(selectTimeLeft);
  const percentage = (timeLeft / maxTime) * 100;
  const score = useAppSelector(selectScore);
  const { user } = useStytchUser();
  const [picUrl, setPic] = useState(null);

  const ProfilePicture = () => {
    useEffect(() => {
      if (user) {
        const profilePicture = user.providers.find(
          (p) => p.profile_picture_url !== undefined
        )?.profile_picture_url;
        if (profilePicture) {
          setPic(profilePicture);
        } else {
          setPic(null);
        }
      }
    }, [user]);

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
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex w-full items-center bg-gray-300 justify-between px-2 py-4">
        <div className="flex items-center text-gray-700">
          <a href="/" className="px-1 ml-8">
            <EurekaLogo variant="small" />
          </a>
        </div>

        <div className="flex items-center text-gray-700">
          <GameControl />
          <a style={styles.link} href="/highscore">
            {score} Points
          </a>
          <ProfilePicture />
        </div>
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
