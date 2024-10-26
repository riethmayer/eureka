"use client";

import React from "react";
import { useGameStore } from "@/zustand/game-store";
import Link from "next/link";

export enum ButtonType {
  default = "default",
  play = "play",
  pause = "pause",
  resume = "resume",
  restart = "restart",
}

const icons = {
  [ButtonType.default]: null,
  [ButtonType.play]: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6 mr-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
      />
    </svg>
  ),
  [ButtonType.pause]: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2.5"
      stroke="currentColor"
      className="w-6 h-6 mr-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 5.25v13.5m-7.5-13.5v13.5"
      />
    </svg>
  ),
  [ButtonType.resume]: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2.5"
      stroke="currentColor"
      className="w-6 h-6 mr-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
      />
    </svg>
  ),
  [ButtonType.restart]: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2.5"
      stroke="currentColor"
      className="w-6 h-6 mr-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
  ),
};

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  path: string;
  variant: keyof typeof icons;
  children: React.ReactNode;
};

export const Button = ({ path, variant, children, ...props }: Props) => (
  <Link href={path}>
    <button
      className="flex px-4 py-1 justify-center text-white font-semibold rounded-lg ease-in-out bg-[#6b2070] hover:-transform-y-1 hover:scale-110 hover:bg-[#8f2297] duration-300"
      {...props}
    >
      {icons[variant]}
      {children}
    </button>
  </Link>
);

export const PlayButton = (props: Omit<Props, "variant" | "path">) => (
  <Button
    {...props}
    path="/play"
    variant={ButtonType.play}
    onClick={useGameStore.getState().start}
  />
);

export const PauseButton = (props: Omit<Props, "variant" | "path">) => (
  <Button
    {...props}
    path="/paused"
    variant={ButtonType.pause}
    onClick={useGameStore.getState().pause}
  />
);

export const ResumeButton = (props: Omit<Props, "variant" | "path">) => (
  <Button
    {...props}
    path="/play"
    variant={ButtonType.resume}
    onClick={useGameStore.getState().resume}
  />
);

export const RestartButton = (props: Omit<Props, "variant" | "path">) => (
  <Button
    {...props}
    path="/play"
    variant={ButtonType.restart}
    onClick={useGameStore.getState().restart}
  />
);

export const NextLevelButton = (props: Omit<Props, "variant" | "path">) => (
  <Button
    {...props}
    path="/play"
    variant={ButtonType.play}
    onClick={useGameStore.getState().continueNextLevel}
  />
);

export default Button;
