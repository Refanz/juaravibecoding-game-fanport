import React from "react";

interface Props {
  onReturnToWelcome: () => void;
}

export default function WinModal({ onReturnToWelcome }: Props) {
  return (
    <div className="fixed inset-0 bg-black/88 flex flex-col items-center justify-start sm:justify-center z-300 animate-fade-in p-4 overflow-y-auto">
      <div className="bg-dark border-2 border-medical-green rounded-lg p-8 text-center flex flex-col gap-5 max-w-[400px] w-full my-auto shrink-0 max-h-[95vh] overflow-y-auto">
        <div className="text-[2.5rem]">🏆</div>
        <div className="text-[clamp(0.8rem,2vw,1.2rem)] text-medical-light">
          MISI SELESAI!
        </div>
        <div className="text-[0.5rem] text-text-dim leading-[2]">
          Semua perangkat IT di Rumah Sakit
          <br />
          telah berhasil diperbaiki!
          <br />
          Pasien aman, sistem berjalan normal. ✅
        </div>
        <button
          id="btn-play-again"
          onClick={onReturnToWelcome}
          className="bg-medical-green border-2 border-medical-light text-white font-[var(--font-pixel)] text-[0.55rem] py-3 px-6 cursor-pointer rounded transition-all duration-200 hover:scale-105 hover:shadow-[0_0_16px_#66bb6a]"
        >
          🔄 MAIN LAGI
        </button>
      </div>
    </div>
  );
}
