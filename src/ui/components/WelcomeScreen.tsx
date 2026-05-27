// ==========================================
// ui/components/WelcomeScreen.tsx
// ==========================================

import { useState } from "react";
import { AudioManager } from "../../infrastructure/assets/AudioManager";
import SettingsModal from "./SettingsModal";

interface Props {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: Props) {
  const [showSettings, setShowSettings] = useState(false);

  const handleStart = () => {
    AudioManager.click();
    onStart();
  };
  return (
    <div className="w-full min-h-full relative bg-black/50 backdrop-blur-[2px] overflow-y-auto overflow-x-hidden flex flex-col items-center pointer-events-auto py-8 sm:py-4 custom-scrollbar">
      {/* Radial Gradient Overlay to ensure text readability */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(4,16,32,0.9)_100%)]"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 text-center p-4 sm:p-8 animate-fade-in w-full max-w-2xl mx-auto my-auto shrink-0">
        <div className="text-[clamp(2rem,10vmin,5rem)] animate-pulse-icon drop-shadow-[0_0_15px_rgba(79,195,247,0.5)]">
          🏥
        </div>
        <h1 className="text-[clamp(1rem,5vmin,2rem)] text-hospital-sky leading-relaxed [text-shadow:0_0_20px_#4fc3f7aa]">
          IT SUPPORT
          <br />
          HOSPITAL VIBE
        </h1>
        <div className="flex gap-3 sm:gap-4 mt-2">
          <button
            id="btn-start"
            onClick={handleStart}
            className="bg-linear-to-br from-hospital-blue to-[#0d47a1] border-2 border-hospital-sky text-white font-[var(--font-pixel)] text-[clamp(0.5rem,2vmin,0.8rem)] py-2 px-6 sm:py-3.5 sm:px-8 cursor-pointer rounded uppercase tracking-widest transition-all duration-200 hover:bg-hospital-sky hover:text-dark-deep hover:scale-105 hover:shadow-[0_0_20px_#4fc3f7]"
          >
            ▶ START GAME
          </button>
          <button
            onClick={() => {
              AudioManager.click();
              setShowSettings(true);
            }}
            className="bg-dark/50 border-2 border-[#607d8b] text-text-light font-[var(--font-pixel)] text-[clamp(0.5rem,2vmin,0.8rem)] py-2 px-4 sm:py-3.5 sm:px-4 cursor-pointer rounded transition-all duration-200 hover:bg-[#607d8b] hover:text-white hover:scale-105 backdrop-blur-sm"
            title="Pengaturan"
          >
            ⚙️
          </button>
        </div>
        <div className="mt-4 text-[0.55rem] sm:text-[0.6rem] text-hospital-sky/80 leading-[2.2] bg-dark/80 px-8 py-4 rounded-lg border border-hospital-sky/20 backdrop-blur-md shadow-xl">
          🕹️ <strong className="text-hospital-sky">WASD / Arrow Keys</strong> —
          Gerak
          <br />
          ⌨️ <strong className="text-hospital-sky">SPASI</strong> — Interaksi /
          Lift
          <br />
          🎯 Temukan dan perbaiki semua perangkat IT rusak!
        </div>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
