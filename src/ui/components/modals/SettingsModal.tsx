// ==========================================
// ui/components/SettingsModal.tsx
// ==========================================

import React, { useState, useEffect } from 'react';
import { AudioManager } from '../../../infrastructure/assets/AudioManager';

interface Props {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: Props) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gamepadLayout, setGamepadLayout] = useState<'right' | 'left'>('right');
  const [gamepadType, setGamepadType] = useState<'dpad' | 'joystick'>('dpad');
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');

  useEffect(() => {
    setSoundEnabled(!AudioManager.isMuted());
    const savedLayout = localStorage.getItem('jvc_gamepad_layout') as 'right' | 'left' | null;
    if (savedLayout) setGamepadLayout(savedLayout);
    const savedType = localStorage.getItem('jvc_gamepad_type') as 'dpad' | 'joystick' | null;
    if (savedType) setGamepadType(savedType);
    const savedOrient = localStorage.getItem('jvc_orientation') as 'landscape' | 'portrait' | null;
    if (savedOrient) setOrientation(savedOrient);
  }, []);

  const handleSoundChange = (enabled: boolean) => {
    setSoundEnabled(enabled);
    AudioManager.setMuted(!enabled);
    if (enabled) AudioManager.click();
  };

  const handleLayoutChange = (layout: 'right' | 'left') => {
    setGamepadLayout(layout);
    localStorage.setItem('jvc_gamepad_layout', layout);
    AudioManager.click();
  };

  const handleTypeChange = (type: 'dpad' | 'joystick') => {
    setGamepadType(type);
    localStorage.setItem('jvc_gamepad_type', type);
    AudioManager.click();
  };

  const handleOrientationChange = async (type: 'landscape' | 'portrait') => {
    setOrientation(type);
    localStorage.setItem('jvc_orientation', type);
    AudioManager.click();
    
    try {
      if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
        if (screen.orientation && (screen.orientation as any).lock) {
          await (screen.orientation as any).lock(type);
        }
      }
    } catch (err) {
      console.warn("Orientation lock failed", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[400] animate-fade-in p-2 sm:p-4">
      <div className="bg-dark-deep border-2 border-hospital-sky rounded-xl p-4 sm:p-6 w-[90vw] max-w-[340px] sm:max-w-[500px] md:max-w-[600px] max-h-[90dvh] flex flex-col shadow-[0_0_20px_rgba(79,195,247,0.3)]">
        <h2 className="text-hospital-sky font-[var(--font-pixel)] text-center text-lg sm:text-xl mb-4 sm:mb-6 border-b border-hospital-sky/30 pb-2 shrink-0">
          ⚙️ PENGATURAN
        </h2>

        <div className="grid grid-cols-1 landscape:grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 overflow-y-auto custom-scrollbar pr-1">
          {/* Sound Setting */}
          <div className="flex flex-col justify-center gap-2 bg-dark/50 p-3 rounded border border-hospital-blue/30 h-full">
            <span className="text-hospital-sky font-bold text-xs sm:text-sm tracking-wide">🔊 SUARA GAME</span>
            <div className="flex gap-2 mt-auto">
              <button
                className={`flex-1 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded transition-colors border ${soundEnabled ? 'bg-medical-green/80 border-medical-green text-white shadow-[0_0_10px_rgba(46,204,113,0.4)]' : 'bg-dark border-gray-600 text-gray-400'}`}
                onClick={() => handleSoundChange(true)}
              >
                ON
              </button>
              <button
                className={`flex-1 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded transition-colors border ${!soundEnabled ? 'bg-medical-red/80 border-medical-red text-white shadow-[0_0_10px_rgba(231,76,60,0.4)]' : 'bg-dark border-gray-600 text-gray-400'}`}
                onClick={() => handleSoundChange(false)}
              >
                OFF
              </button>
            </div>
          </div>

          {/* Gamepad Layout */}
          <div className="flex flex-col justify-center gap-2 bg-dark/50 p-3 rounded border border-hospital-blue/30 h-full">
            <span className="text-hospital-sky font-bold text-xs sm:text-sm tracking-wide">🔄 TATA LETAK GAMEPAD</span>
            <div className="flex gap-2 text-[0.65rem] sm:text-xs mt-auto">
              <button
                className={`flex-1 py-1.5 sm:py-2 rounded transition-colors border ${gamepadLayout === 'right' ? 'bg-hospital-blue/80 border-hospital-sky text-white shadow-[0_0_10px_rgba(79,195,247,0.4)]' : 'bg-dark border-gray-600 text-gray-400'}`}
                onClick={() => handleLayoutChange('right')}
              >
                <span className="font-bold">Kiri:</span> Gerak<br/>
                <span className="font-bold">Kanan:</span> Aksi
              </button>
              <button
                className={`flex-1 py-1.5 sm:py-2 rounded transition-colors border ${gamepadLayout === 'left' ? 'bg-hospital-blue/80 border-hospital-sky text-white shadow-[0_0_10px_rgba(79,195,247,0.4)]' : 'bg-dark border-gray-600 text-gray-400'}`}
                onClick={() => handleLayoutChange('left')}
              >
                <span className="font-bold">Kiri:</span> Aksi<br/>
                <span className="font-bold">Kanan:</span> Gerak
              </button>
            </div>
          </div>

          {/* Gamepad Type */}
          <div className="flex flex-col justify-center gap-2 bg-dark/50 p-3 rounded border border-hospital-blue/30 h-full">
            <span className="text-hospital-sky font-bold text-xs sm:text-sm tracking-wide">🕹️ TIPE KONTROL</span>
            <div className="flex gap-2 text-[0.65rem] sm:text-xs mt-auto">
              <button
                className={`flex-1 py-1.5 sm:py-2 rounded transition-colors border ${gamepadType === 'dpad' ? 'bg-hospital-blue/80 border-hospital-sky text-white shadow-[0_0_10px_rgba(79,195,247,0.4)]' : 'bg-dark border-gray-600 text-gray-400'}`}
                onClick={() => handleTypeChange('dpad')}
              >
                D-Pad<br/>(Tombol)
              </button>
              <button
                className={`flex-1 py-1.5 sm:py-2 rounded transition-colors border ${gamepadType === 'joystick' ? 'bg-hospital-blue/80 border-hospital-sky text-white shadow-[0_0_10px_rgba(79,195,247,0.4)]' : 'bg-dark border-gray-600 text-gray-400'}`}
                onClick={() => handleTypeChange('joystick')}
              >
                Joystick<br/>(Analog)
              </button>
            </div>
          </div>

          {/* Orientation Settings */}
          <div className="flex flex-col justify-center gap-2 bg-dark/50 p-3 rounded border border-hospital-blue/30 h-full">
            <span className="text-hospital-sky font-bold text-xs sm:text-sm tracking-wide">📱 ORIENTASI (MOBILE)</span>
            <div className="flex gap-2 text-[0.65rem] sm:text-xs mt-auto">
              <button
                className={`flex-1 py-1.5 sm:py-2 rounded transition-colors border ${orientation === 'landscape' ? 'bg-hospital-blue/80 border-hospital-sky text-white shadow-[0_0_10px_rgba(79,195,247,0.4)]' : 'bg-dark border-gray-600 text-gray-400'}`}
                onClick={() => handleOrientationChange('landscape')}
              >
                Landscape
              </button>
              <button
                className={`flex-1 py-1.5 sm:py-2 rounded transition-colors border ${orientation === 'portrait' ? 'bg-hospital-blue/80 border-hospital-sky text-white shadow-[0_0_10px_rgba(79,195,247,0.4)]' : 'bg-dark border-gray-600 text-gray-400'}`}
                onClick={() => handleOrientationChange('portrait')}
              >
                Portrait
              </button>
            </div>
          </div>
        </div>

        <button
          className="w-full mt-6 py-2 bg-hospital-blue/20 hover:bg-hospital-blue/40 border border-hospital-sky text-white text-sm rounded transition-all"
          onClick={() => { AudioManager.click(); onClose(); }}
        >
          KEMBALI
        </button>
      </div>
    </div>
  );
}
