import React from "react";

interface Props {
  onPause: () => void;
  onDesktop: () => void;
  onMap: () => void;
  onTopology: () => void;
  onInfo: () => void;
  unsolvedCount: number;
  onNotifications: () => void;
  notificationCount: number;
}

export default function ActionButtons({
  onPause,
  onDesktop,
  onMap,
  onTopology,
  onInfo,
  unsolvedCount,
  onNotifications,
  notificationCount,
}: Props) {
  return (
    <div className="absolute top-[110px] left-4 translate-x-0 sm:top-auto sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 z-50 pointer-events-auto bg-black/60 backdrop-blur-md border border-white/20 p-1.5 lg:p-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center gap-1.5 lg:gap-3 transition-all hover:bg-black/70 hover:border-white/30 scale-[0.85] lg:scale-100 origin-left sm:origin-bottom">
      <button
        onClick={onPause}
        className="text-hospital-sky hover:text-white bg-dark/50 hover:bg-dark border border-hospital-blue/40 hover:border-hospital-blue w-[38px] h-[38px] lg:w-[60px] lg:h-[60px] rounded-xl cursor-pointer transition-all duration-300 opacity-80 hover:opacity-100 shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-sm flex flex-col items-center justify-center gap-0.5 lg:gap-1 group relative"
        title="Pause Game"
      >
        <span className="text-[16px] lg:text-[28px] leading-none group-hover:scale-110 transition-transform">
          ⏸️
        </span>
        <span className="text-[7px] lg:text-[10px] font-bold tracking-wider opacity-80 group-hover:opacity-100">
          PAUSE
        </span>
      </button>
      <button
        onClick={onDesktop}
        className="text-hospital-sky hover:text-white bg-dark/50 hover:bg-dark border border-hospital-blue/40 hover:border-hospital-blue w-[38px] h-[38px] lg:w-[60px] lg:h-[60px] rounded-xl cursor-pointer transition-all duration-300 opacity-80 hover:opacity-100 shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-sm flex flex-col items-center justify-center gap-0.5 lg:gap-1 group relative"
        title="Sistem Tiketing OS"
      >
        <span className="text-[16px] lg:text-[28px] leading-none group-hover:scale-110 transition-transform">
          💻
        </span>
        <span className="text-[7px] lg:text-[10px] font-bold tracking-wider opacity-80 group-hover:opacity-100">
          LAPTOP
        </span>
        {/* Notification Badge if there are unsolved tickets */}
        {unsolvedCount > 0 && (
          <span className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 flex h-3.5 w-3.5 lg:h-5 lg:w-5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 lg:h-5 lg:w-5 bg-red-500 text-[7px] lg:text-[10px] text-white font-bold items-center justify-center border border-white/20 shadow-sm">
              !
            </span>
          </span>
        )}
      </button>
      <button
        onClick={onNotifications}
        className="text-hospital-sky hover:text-white bg-dark/50 hover:bg-dark border border-hospital-blue/40 hover:border-hospital-blue w-[38px] h-[38px] lg:w-[60px] lg:h-[60px] rounded-xl cursor-pointer transition-all duration-300 opacity-80 hover:opacity-100 shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-sm flex flex-col items-center justify-center gap-0.5 lg:gap-1 group relative"
        title="Notifikasi"
      >
        <span className="text-[16px] lg:text-[28px] leading-none group-hover:scale-110 transition-transform">
          🔔
        </span>
        <span className="text-[7px] lg:text-[10px] font-bold tracking-wider opacity-80 group-hover:opacity-100">
          NOTIF
        </span>
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 flex h-3.5 w-3.5 lg:h-5 lg:w-5 items-center justify-center">
             <span className="relative inline-flex rounded-full h-3.5 w-3.5 lg:h-5 lg:w-5 bg-red-500 text-[7px] lg:text-[10px] text-white font-bold items-center justify-center border border-white/20 shadow-sm">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          </span>
        )}
      </button>
      <button
        onClick={onMap}
        className="text-hospital-sky hover:text-white bg-dark/50 hover:bg-dark border border-hospital-blue/40 hover:border-hospital-blue w-[38px] h-[38px] lg:w-[60px] lg:h-[60px] rounded-xl cursor-pointer transition-all duration-300 opacity-80 hover:opacity-100 shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-sm flex flex-col items-center justify-center gap-0.5 lg:gap-1 group relative"
        title="Buka Map"
      >
        <span className="text-[16px] lg:text-[28px] leading-none group-hover:scale-110 transition-transform">
          🗺️
        </span>
        <span className="text-[7px] lg:text-[10px] font-bold tracking-wider opacity-80 group-hover:opacity-100">
          MAP
        </span>
      </button>
      <button
        onClick={onTopology}
        className="text-hospital-sky hover:text-white bg-dark/50 hover:bg-dark border border-hospital-blue/40 hover:border-hospital-blue w-[38px] h-[38px] lg:w-[60px] lg:h-[60px] rounded-xl cursor-pointer transition-all duration-300 opacity-80 hover:opacity-100 shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-sm flex flex-col items-center justify-center gap-0.5 lg:gap-1 group relative"
        title="Topologi Jaringan"
      >
        <span className="text-[16px] lg:text-[28px] leading-none group-hover:scale-110 transition-transform">
          🌐
        </span>
        <span className="text-[7px] lg:text-[10px] font-bold tracking-wider opacity-80 group-hover:opacity-100">
          TOPOLOGI
        </span>
      </button>
      <button
        onClick={onInfo}
        className="text-hospital-sky hover:text-white bg-dark/50 hover:bg-dark border border-hospital-blue/40 hover:border-hospital-blue w-[38px] h-[38px] lg:w-[60px] lg:h-[60px] rounded-xl cursor-pointer transition-all duration-300 opacity-80 hover:opacity-100 shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-sm flex flex-col items-center justify-center gap-0.5 lg:gap-1 group relative"
        title="Informasi Ikon"
      >
        <span className="text-[16px] lg:text-[28px] leading-none group-hover:scale-110 transition-transform">
          ℹ️
        </span>
        <span className="text-[7px] lg:text-[10px] font-bold tracking-wider opacity-80 group-hover:opacity-100">
          INFO
        </span>
      </button>
    </div>
  );
}

