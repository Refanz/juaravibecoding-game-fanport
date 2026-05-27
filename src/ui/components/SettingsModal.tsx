// ==========================================
// ui/components/SettingsModal.tsx
// ==========================================

import React, { useState, useEffect } from 'react';
import { AudioManager } from '../../infrastructure/assets/AudioManager';

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
      <div className="bg-dark-deep border-2 border-hospital-sky rounded-xl p-4 sm:p-6 w-full max-w-[320px] max-h-[95dvh] overflow-y-auto custom-scrollbar shadow-[0_0_20px_rgba(79,195,247,0.3)]">
        <h2 className="text-hospital-sky font-[var(--font-pixel)] text-center text-lg mb-6 border-b border-hospital-sky/30 pb-2">
          ⚙️ PENGATURAN
        </h2>

        <div className="flex flex-col gap-5">
          {/* Sound Setting */}
          <div className="flex justify-between items-center bg-dark/50 p-3 rounded border border-hospital-blue/30">
            <span className="text-text-light text-sm">🔊 Suara Game</span>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 text-xs rounded transition-colors ${soundEnabled ? 'bg-medical-green text-white' : 'bg-gray-700 text-gray-400'}`}
                onClick={() => handleSoundChange(true)}
              >
                ON
              </button>
              <button
                className={`px-3 py-1 text-xs rounded transition-colors ${!soundEnabled ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'}`}
                onClick={() => handleSoundChange(false)}
              >
                OFF
              </button>
            </div>
          </div>

          {/* Gamepad Layout */}
          <div className="flex flex-col gap-2 bg-dark/50 p-3 rounded border border-hospital-blue/30">
            <span className="text-text-light text-sm">🔄 Tata Letak Gamepad</span>
            <div className="flex gap-2 text-[0.65rem]">
              <button
                className={`flex-1 py-2 rounded transition-colors border ${gamepadLayout === 'right' ? 'bg-hospital-blue border-hospital-sky text-white' : 'bg-dark border-gray-600 text-gray-400'}`}
                onClick={() => handleLayoutChange('right')}
              >
                Kiri: Gerak<br/>Kanan: Aksi
              </button>
              <button
                className={`flex-1 py-2 rounded transition-colors border ${gamepadLayout === 'left' ? 'bg-hospital-blue border-hospital-sky text-white' : 'bg-dark border-gray-600 text-gray-400'}`}
                onClick={() => handleLayoutChange('left')}
              >
                Kiri: Aksi<br/>Kanan: Gerak
              </button>
            </div>
          </div>

          {/* Gamepad Type */}
          <div className="flex flex-col gap-2 bg-dark/50 p-3 rounded border border-hospital-blue/30">
            <span className="text-text-light text-sm">🕹️ Tipe Kontrol</span>
            <div className="flex gap-2 text-[0.65rem]">
              <button
                className={`flex-1 py-2 rounded transition-colors border ${gamepadType === 'dpad' ? 'bg-hospital-blue border-hospital-sky text-white' : 'bg-dark border-gray-600 text-gray-400'}`}
                onClick={() => handleTypeChange('dpad')}
              >
                D-Pad (Tombol)
              </button>
              <button
                className={`flex-1 py-2 rounded transition-colors border ${gamepadType === 'joystick' ? 'bg-hospital-blue border-hospital-sky text-white' : 'bg-dark border-gray-600 text-gray-400'}`}
                onClick={() => handleTypeChange('joystick')}
              >
                Joystick (Analog)
              </button>
            </div>
          </div>

          {/* Orientation Settings */}
          <div className="flex flex-col gap-2 bg-dark/50 p-3 rounded border border-hospital-blue/30">
            <span className="text-text-light text-sm">📱 Orientasi Layar (Mobile)</span>
            <div className="flex gap-2 text-[0.65rem]">
              <button
                className={`flex-1 py-2 rounded transition-colors border ${orientation === 'landscape' ? 'bg-hospital-blue border-hospital-sky text-white' : 'bg-dark border-gray-600 text-gray-400'}`}
                onClick={() => handleOrientationChange('landscape')}
              >
                Landscape
              </button>
              <button
                className={`flex-1 py-2 rounded transition-colors border ${orientation === 'portrait' ? 'bg-hospital-blue border-hospital-sky text-white' : 'bg-dark border-gray-600 text-gray-400'}`}
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
