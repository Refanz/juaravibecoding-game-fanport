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
    <div className="absolute top-4 left-4 z-50 flex flex-col gap-2.5 pointer-events-auto bg-dark-panel/90 backdrop-blur-md border-2 border-hospital-sky/40 p-2 lg:p-3 rounded-xl shadow-[0_4px_25px_rgba(79,195,247,0.25)] transition-all hover:bg-dark-panel hover:border-hospital-sky/80 hover:shadow-[0_4px_30px_rgba(79,195,247,0.4)] w-fit scale-[0.65] sm:scale-[0.8] lg:scale-[1.05] origin-top-left">
      
      {/* Decorative Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-hospital-sky/20 via-hospital-sky to-hospital-sky/20 rounded-t-lg opacity-90" />

      {/* Top Row: Floor & Tickets */}
      <div className="flex items-center gap-2 mt-1">
        {/* Lantai Badge */}
        <div className="flex items-center gap-2 bg-dark-card border-l-4 border-l-hospital-sky border-y border-r border-y-white/10 border-r-white/10 px-2 lg:px-3 py-1.5 rounded-r-md shadow-inner transition-all hover:bg-dark-card/80">
          <span className="text-[12px] lg:text-[14px] drop-shadow-md">🏥</span>
          <span className="text-[9px] lg:text-[10px] font-bold text-hospital-sky tracking-widest uppercase font-[var(--font-pixel)] mt-0.5">
            Lt. {currentFloor}
          </span>
        </div>
        
        {/* Tiket Badge */}
        <div className="flex items-center gap-3 bg-dark-card border-l-4 border-l-red-alert border-y border-r border-y-white/10 border-r-white/10 px-2 lg:px-3 py-1.5 rounded-r-md shadow-inner font-[var(--font-pixel)] text-[9px] lg:text-[10px] text-white transition-all hover:bg-dark-card/80">
          <div className={`flex items-center gap-1.5 text-red-alert drop-shadow-md ${activeTickets > 0 ? 'animate-pulse' : ''}`}>
            <span className="text-[11px] lg:text-[12px]">🎫</span> 
            <span className="mt-0.5">{activeTickets}</span>
          </div>
          <span className="opacity-30 text-xs mt-0.5">|</span>
          <div className="flex items-center gap-1.5 text-medical-light drop-shadow-md">
            <span className="text-[11px] lg:text-[12px]">✅</span> 
            <span className="mt-0.5">{completedTickets}</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Tanggal & Waktu */}
      <div className="flex items-center justify-between gap-3 bg-dark-card border border-white/10 px-2.5 lg:px-3 py-2 rounded-md shadow-inner font-[var(--font-pixel)] text-[9px] lg:text-[10px] text-text-bright transition-all w-full relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-hospital-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="flex items-center gap-2 text-hospital-sky opacity-90 leading-none relative z-10">
          <span className="drop-shadow-md text-[11px] lg:text-[12px]">📅</span> 
          <span className="mt-0.5">{currentDate}</span>
        </span>
        <span className="opacity-30 relative z-10 text-xs">|</span>
        <span className="flex items-center gap-2 font-bold tracking-wider leading-none relative z-10 text-white">
          <span className="drop-shadow-md text-[11px] lg:text-[12px]">{periodIcon}</span> 
          <span className="mt-0.5">{currentTime}</span>
        </span>
      </div>

      {/* Bottom Row: Budget */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-medical-green/40 to-dark-card border border-medical-light/40 px-2.5 lg:px-3 py-2 rounded-md shadow-[inset_0_1px_4px_rgba(102,187,106,0.2)] font-[var(--font-pixel)] text-[10px] lg:text-[11px] text-medical-light transition-all w-full relative group">
        <div className="absolute inset-0 bg-medical-green/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
        <span className="drop-shadow-md text-[12px] lg:text-[14px] relative z-10">💰</span>
        <span className="font-bold tracking-widest relative z-10 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mt-0.5">
          Rp {currentBudget.toLocaleString("id-ID")}
        </span>
      </div>
    </div>
  );
}
