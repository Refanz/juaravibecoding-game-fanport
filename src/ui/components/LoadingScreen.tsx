// ==========================================
// ui/components/LoadingScreen.tsx
// ==========================================

import React, { useEffect, useState } from 'react';
import { EventBus } from '../../infrastructure/events/EventBus';

interface Props {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleProgress = (val: number) => {
      setProgress(Math.floor(val * 100));
    };

    const handleComplete = () => {
      setProgress(100);
      setTimeout(() => {
        onComplete();
      }, 500); // give a little delay to show 100%
    };

    EventBus.on('preload_progress', handleProgress);
    EventBus.on('preload_complete', handleComplete);

    return () => {
      EventBus.off('preload_progress', handleProgress);
      EventBus.off('preload_complete', handleComplete);
    };
  }, [onComplete]);

  return (
    <div className="w-full h-[100dvh] flex flex-col items-center justify-center bg-dark-deep relative pointer-events-auto">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(4,16,32,0.9)_100%)]"></div>
      
      <div className="z-10 flex flex-col items-center gap-6 p-4 text-center animate-fade-in w-full max-w-sm">
        <img 
          src="/icons/icon.svg" 
          alt="VibeHospital Icon" 
          className="w-24 h-24 sm:w-32 sm:h-32 object-contain animate-pulse-icon drop-shadow-[0_0_15px_rgba(79,195,247,0.5)]"
        />
        <h1 className="text-hospital-sky font-[var(--font-pixel)] text-lg sm:text-xl animate-pulse [text-shadow:0_0_10px_#4fc3f7aa]">MEMUAT ASET...</h1>
        
        <div className="w-full h-4 sm:h-5 bg-dark rounded border-2 border-hospital-blue overflow-hidden relative shadow-[0_0_15px_rgba(79,195,247,0.3)]">
          <div 
            className="h-full bg-medical-light transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-white font-[var(--font-pixel)] text-xs sm:text-sm">{progress}%</p>
      </div>
    </div>
  );
}
