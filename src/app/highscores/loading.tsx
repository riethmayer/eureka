import { PlayButton } from "@/components/common/button";

const Loading = () => {
  return (
    <div className="flex mt-8 flex-col justify-top h-screen w-screen items-center">
      <div className="w-[50%] rounded-xl border-8 border-red-300">
        <h1 className="text-5xl text-white bg-purple-700 w-full text-center font-extrabold py-2">
          Highscore
        </h1>
        <div className="flex justify-center items-center">
          <div className="loader m-6"></div>
        </div>
      </div>
      <div className="relative bg-slate-200 mt-8 rounded-xl px-10 py-4">
        <PlayButton>Play</PlayButton>
      </div>
    </div>
  );
};

export default Loading;
