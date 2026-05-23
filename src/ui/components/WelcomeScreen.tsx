// ==========================================
// ui/components/WelcomeScreen.tsx
// ==========================================

import { AudioManager } from '../../infrastructure/assets/AudioManager';

interface Props { onStart: () => void; }

export default function WelcomeScreen({ onStart }: Props) {
  const handleStart = () => { AudioManager.click(); onStart(); };
  return (
    <div className="screen welcome">
      <div className="hospital-icon">🏥</div>
      <h1 className="logo">IT SUPPORT<br />HOSPITAL VIBE</h1>
      <p className="subtitle">#JuaraVibeCoding — Google Cloud Run</p>
      <button id="btn-start" className="btn-start" onClick={handleStart}>▶ START GAME</button>
      <div className="controls">
        🕹️ WASD / Arrow Keys — Gerak<br />
        ⌨️ SPASI — Interaksi / Lift<br />
        🎯 Temukan dan perbaiki semua perangkat IT rusak!
      </div>
      <div className="badge">🏆 Submission #JuaraVibeCoding 2025</div>
    </div>
  );
}
