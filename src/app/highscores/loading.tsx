const Loading = () => {
  return (
    <div className="flex flex-col items-center px-4 pt-8 pb-4 h-full">
      {/* Header — identical to the loaded page */}
      <div className="mb-6 text-center shrink-0">
        <h1 className="text-5xl font-extrabold text-white tracking-widest uppercase">
          Highscores
        </h1>
        <p className="text-slate-400 mt-1 text-sm tracking-wide">Top 10 all-time players</p>
      </div>

      {/* Table card — same shell as the loaded page */}
      <div className="w-[80vw] rounded-2xl overflow-hidden shadow-2xl border border-slate-600 flex flex-col flex-1 min-h-0">
        {/* Column headers */}
        <div className="grid grid-cols-[5rem_1fr_10rem_8rem] bg-slate-900 text-slate-400 uppercase text-sm font-bold tracking-widest px-6 py-4 shrink-0">
          <span className="text-center">#</span>
          <span>Player</span>
          <span className="text-right">Score</span>
          <span className="text-right">Level</span>
        </div>

        {/* Loading indicator */}
        <div className="flex-1 flex items-center justify-center bg-slate-700">
          <p className="text-slate-400 text-lg font-semibold animate-pulse">
            Loading highscores…
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
