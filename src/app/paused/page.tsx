"use client";
import { ResumeButton } from "@/components/common/button";

const Paused = () => {
  return (
    <div className=" flex flex-col align-middle items-center">
      <h1 className="my-12 text-white text-5xl">PAUSE</h1>
      <ResumeButton>Resume</ResumeButton>
    </div>
  );
};

export default Paused;
