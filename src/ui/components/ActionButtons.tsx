import React from "react";

interface Props {
  onPause: () => void;
  onDesktop: () => void;
  onMap: () => void;
  onTopology: () => void;
  onInfo: () => void;
  unsolvedCount: number;
}

export default function ActionButtons({
  onPause,
  onDesktop,
  onMap,
  onTopology,
  onInfo,
  unsolvedCount,
}: Props) {
  return (
    <div className="absolute top-[110px] left-4 translate-x-0 sm:top-auto sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 z-50 pointer-events-auto bg-black/60 backdrop-blur-md border border-white/20 p-2 sm:p-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center gap-2 sm:gap-4 transition-all hover:bg-black/70 hover:border-white/30">
      <button
        onClick={onPause}
        className="text-hospital-sky hover:text-white bg-dark/50 hover:bg-dark border border-hospital-blue/40 hover:border-hospital-blue w-12 h-12 sm:w-14 sm:h-14 rounded-xl cursor-pointer transition-all duration-300 opacity-80 hover:opacity-100 shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-sm flex flex-col items-center justify-center gap-1 group relative"
        title="Pause Game"
      >
        <span className="text-xl sm:text-2xl leading-none group-hover:scale-110 transition-transform">
          ⏸️
        </span>
        <span className="text-[0.45rem] sm:text-[0.55rem] font-bold tracking-wider opacity-80 group-hover:opacity-100 hidden sm:block">
          PAUSE
        </span>
      </button>
      <button
        onClick={onDesktop}
        className="text-hospital-sky hover:text-white bg-dark/50 hover:bg-dark border border-hospital-blue/40 hover:border-hospital-blue w-12 h-12 sm:w-14 sm:h-14 rounded-xl cursor-pointer transition-all duration-300 opacity-80 hover:opacity-100 shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-sm flex flex-col items-center justify-center gap-1 group relative"
        title="Sistem Tiketing OS"
      >
        <span className="text-xl sm:text-2xl leading-none group-hover:scale-110 transition-transform">
          💻
        </span>
        <span className="text-[0.45rem] sm:text-[0.55rem] font-bold tracking-wider opacity-80 group-hover:opacity-100 hidden sm:block">
          LAPTOP
        </span>
        {/* Notification Badge if there are unsolved tickets */}
        {unsolvedCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 sm:h-5 sm:w-5 bg-red-500 text-[0.45rem] sm:text-[0.55rem] text-white font-bold items-center justify-center border border-white/20 shadow-sm">
              !
            </span>
          </span>
        )}
      </button>
      <button
        onClick={onMap}
        className="text-hospital-sky hover:text-white bg-dark/50 hover:bg-dark border border-hospital-blue/40 hover:border-hospital-blue w-12 h-12 sm:w-14 sm:h-14 rounded-xl cursor-pointer transition-all duration-300 opacity-80 hover:opacity-100 shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-sm flex flex-col items-center justify-center gap-1 group relative"
        title="Buka Map"
      >
        <span className="text-xl sm:text-2xl leading-none group-hover:scale-110 transition-transform">
          🗺️
        </span>
        <span className="text-[0.45rem] sm:text-[0.55rem] font-bold tracking-wider opacity-80 group-hover:opacity-100 hidden sm:block">
          MAP
        </span>
      </button>
      <button
        onClick={onTopology}
        className="text-hospital-sky hover:text-white bg-dark/50 hover:bg-dark border border-hospital-blue/40 hover:border-hospital-blue w-12 h-12 sm:w-14 sm:h-14 rounded-xl cursor-pointer transition-all duration-300 opacity-80 hover:opacity-100 shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-sm flex flex-col items-center justify-center gap-1 group relative"
        title="Topologi Jaringan"
      >
        <span className="text-xl sm:text-2xl leading-none group-hover:scale-110 transition-transform">
          🌐
        </span>
        <span className="text-[0.45rem] sm:text-[0.55rem] font-bold tracking-wider opacity-80 group-hover:opacity-100 hidden sm:block">
          TOPOLOGI
        </span>
      </button>
      <button
        onClick={onInfo}
        className="text-hospital-sky hover:text-white bg-dark/50 hover:bg-dark border border-hospital-blue/40 hover:border-hospital-blue w-12 h-12 sm:w-14 sm:h-14 rounded-xl cursor-pointer transition-all duration-300 opacity-80 hover:opacity-100 shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-sm flex flex-col items-center justify-center gap-1 group relative"
        title="Informasi Ikon"
      >
        <span className="text-xl sm:text-2xl leading-none group-hover:scale-110 transition-transform">
          ℹ️
        </span>
        <span className="text-[0.45rem] sm:text-[0.55rem] font-bold tracking-wider opacity-80 group-hover:opacity-100 hidden sm:block">
          INFO
        </span>
      </button>
    </div>
  );
}
