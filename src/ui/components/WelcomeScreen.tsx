// ==========================================
// ui/components/WelcomeScreen.tsx
// ==========================================

import { AudioManager } from '../../infrastructure/assets/AudioManager';

interface Props { onStart: () => void; }

export default function WelcomeScreen({ onStart }: Props) {
  const handleStart = () => { AudioManager.click(); onStart(); };
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-8 text-center p-8 bg-[radial-gradient(ellipse_at_center,_#0a2a4a_0%,_#041020_100%)] animate-fade-in">
      <div className="text-[clamp(3rem,8vw,5rem)] animate-pulse-icon">🏥</div>
      <h1 className="text-[clamp(1.2rem,4vw,2rem)] text-hospital-sky leading-relaxed [text-shadow:0_0_20px_#4fc3f7aa]">
        IT SUPPORT<br />HOSPITAL VIBE
      </h1>
      <p className="text-[clamp(0.55rem,1.5vw,0.85rem)] text-text-dim">
        #JuaraVibeCoding — Google Cloud Run
      </p>
      <button
        id="btn-start"
        onClick={handleStart}
        className="bg-linear-to-br from-hospital-blue to-[#0d47a1] border-2 border-hospital-sky text-white font-[var(--font-pixel)] text-[clamp(0.5rem,1.5vw,0.8rem)] py-3.5 px-8 cursor-pointer rounded uppercase tracking-widest transition-all duration-200 hover:bg-hospital-sky hover:text-dark-deep hover:scale-105 hover:shadow-[0_0_20px_#4fc3f7]"
      >
        ▶ START GAME
      </button>
      <div className="text-[0.5rem] text-[#607d8b] leading-[2.2]">
        🕹️ WASD / Arrow Keys — Gerak<br />
        ⌨️ SPASI — Interaksi / Lift<br />
        🎯 Temukan dan perbaiki semua perangkat IT rusak!
      </div>
      <div className="text-[0.45rem] text-hospital-sky border border-hospital-sky/30 py-1 px-3 rounded-full">
        🏆 Submission #JuaraVibeCoding 2025
      </div>
    </div>
  );
}
