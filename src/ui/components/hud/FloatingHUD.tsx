import React from "react";

interface Props {
  currentFloor: number;
  currentDate: string;
  currentTime: string;
  currentPeriod: "pagi" | "siang" | "sore" | "malam";
  activeTickets: number;
  completedTickets: number;
  currentBudget: number;
}

export default function FloatingHUD({
  currentFloor,
  currentDate,
  currentTime,
  currentPeriod,
  activeTickets,
  completedTickets,
  currentBudget,
}: Props) {
  const periodIcon = {
    pagi: "🌅",
    siang: "☀️",
    sore: "🌇",
    malam: "🌙",
  }[currentPeriod];

  return (
    <div className="absolute top-4 left-4 z-50 flex flex-col gap-1.5 pointer-events-auto bg-black/60 backdrop-blur-md border border-white/20 p-1.5 lg:p-2 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all hover:bg-black/70 hover:border-white/30 w-fit scale-[0.8] lg:scale-[1.1] origin-top-left">
      <div className="flex items-center gap-1.5">
        {/* Lantai Badge */}
        <div className="flex items-center gap-1.5 bg-black/40 border border-hospital-sky/30 px-1.5 lg:px-2 py-1 rounded-md shadow-inner backdrop-blur-sm transition-all hover:bg-black/50">
          <span className="text-[12px] lg:text-[14px] drop-shadow-md">🏥</span>
          <span className="text-[9px] lg:text-[10px] font-bold text-hospital-sky tracking-widest uppercase">
            Lt. {currentFloor}
          </span>
        </div>
        {/* Tiket Badge */}
        <div className="flex items-center gap-2 bg-black/40 border border-hospital-sky/30 px-1.5 lg:px-2 py-1 rounded-md shadow-inner backdrop-blur-sm font-[var(--font-pixel)] text-[9px] lg:text-[10px] text-white transition-all hover:bg-black/50">
          <span className="flex items-center gap-1 text-hospital-alert drop-shadow-md">
            <span>🎫</span> {activeTickets}
          </span>
          <span className="opacity-40">|</span>
          <span className="flex items-center gap-1 text-green-400 drop-shadow-md">
            <span>✅</span> {completedTickets}
          </span>
        </div>
      </div>
      {/* Tanggal & Waktu Badge */}
      <div className="flex items-center justify-center gap-2 bg-black/40 border border-white/10 px-1.5 lg:px-2 py-1 rounded-md shadow-inner backdrop-blur-sm font-[var(--font-pixel)] text-[9px] lg:text-[10px] text-medical-light transition-all hover:bg-black/50 w-full">
        <span className="flex items-center gap-1.5 text-hospital-sky opacity-90 leading-none">
          <span className="drop-shadow-md text-[10px] lg:text-[12px]">📅</span> {currentDate}
        </span>
        <span className="opacity-30">|</span>
        <span className="flex items-center gap-1.5 font-bold tracking-wider leading-none">
          <span className="drop-shadow-md text-[10px] lg:text-[12px]">{periodIcon}</span> {currentTime}
        </span>
      </div>
      {/* Budget Badge */}
      <div className="flex items-center gap-1.5 bg-black/40 border border-green-500/30 px-1.5 lg:px-2 py-1 rounded-md shadow-inner backdrop-blur-sm font-[var(--font-pixel)] text-[9px] lg:text-[10px] text-green-400 transition-all hover:bg-black/50 w-fit">
        <span className="drop-shadow-md text-[10px] lg:text-[12px]">💰</span>
        <span className="font-bold tracking-widest">
          Rp {currentBudget.toLocaleString("id-ID")}
        </span>
      </div>
    </div>
  );
}
