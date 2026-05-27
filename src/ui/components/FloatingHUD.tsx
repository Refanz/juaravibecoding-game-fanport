import React from "react";

interface Props {
  currentFloor: number;
  solvedCount: number;
  totalObjects: number;
  currentDate: string;
  currentTime: string;
  currentPeriod: "pagi" | "siang" | "sore" | "malam";
}

export default function FloatingHUD({
  currentFloor,
  solvedCount,
  totalObjects,
  currentDate,
  currentTime,
  currentPeriod,
}: Props) {
  const periodIcon = {
    pagi: "🌅",
    siang: "☀️",
    sore: "🌇",
    malam: "🌙",
  }[currentPeriod];

  return (
    <div className="absolute top-4 left-4 z-50 flex flex-col gap-2 pointer-events-auto bg-black/60 backdrop-blur-md border border-white/20 p-2 sm:p-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all hover:bg-black/70 hover:border-white/30 w-fit">
      <div className="flex items-center gap-2">
        {/* Lantai Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 border border-hospital-sky/30 px-2.5 sm:px-4 py-1.5 rounded-lg shadow-inner backdrop-blur-sm transition-all hover:bg-black/50">
          <span className="text-[0.7rem] sm:text-sm drop-shadow-md">🏥</span>
          <span className="text-[0.55rem] sm:text-[0.65rem] font-bold text-hospital-sky tracking-widest uppercase">
            <span className="hidden sm:inline">Lantai </span>
            <span className="sm:hidden">Lt. </span>
            {currentFloor}
          </span>
        </div>
        {/* Skor Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 border border-medical-green/30 px-2.5 sm:px-4 py-1.5 rounded-lg shadow-inner backdrop-blur-sm transition-all hover:bg-black/50">
          <span className="text-[0.7rem] sm:text-sm drop-shadow-md">📊</span>
          <span className="text-[0.55rem] sm:text-[0.65rem] font-bold text-medical-green tracking-widest uppercase">
            <span className="hidden sm:inline">Skor: </span>
            {solvedCount}/{totalObjects}
          </span>
        </div>
      </div>
      {/* Tanggal & Waktu Badge */}
      <div className="flex items-center justify-center gap-2 bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg shadow-inner backdrop-blur-sm font-[var(--font-pixel)] text-[0.45rem] sm:text-[0.55rem] text-medical-light transition-all hover:bg-black/50 w-full">
        <span className="flex items-center gap-1.5 text-hospital-sky opacity-90 leading-none">
          <span className="drop-shadow-md">📅</span> {currentDate}
        </span>
        <span className="opacity-30">|</span>
        <span className="flex items-center gap-1.5 font-bold tracking-wider leading-none">
          <span className="drop-shadow-md">{periodIcon}</span> {currentTime}
        </span>
      </div>
    </div>
  );
}
