import { useEffect, useState } from 'react';
import { EventBus } from '../../infrastructure/events/EventBus';

export default function VirtualGamepad() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  if (!isTouchDevice) return null;

  const emitMove = (dir: 'up' | 'down' | 'left' | 'right', isDown: boolean) => {
    EventBus.emit('virtual_pad_move', { dir, isDown });
  };

  const emitInteract = () => {
    EventBus.emit('virtual_pad_interact');
  };

  return (
    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none z-[100]">
      {/* D-Pad */}
      <div className="relative w-32 h-32 opacity-80 pointer-events-auto">
        {/* Up */}
        <button
          className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-12 bg-white/20 active:bg-white/50 rounded-t-lg shadow-sm border border-white/30"
          onTouchStart={(e) => { e.preventDefault(); emitMove('up', true); }}
          onTouchEnd={(e) => { e.preventDefault(); emitMove('up', false); }}
          onTouchCancel={() => emitMove('up', false)}
        />
        {/* Down */}
        <button
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-12 bg-white/20 active:bg-white/50 rounded-b-lg shadow-sm border border-white/30"
          onTouchStart={(e) => { e.preventDefault(); emitMove('down', true); }}
          onTouchEnd={(e) => { e.preventDefault(); emitMove('down', false); }}
          onTouchCancel={() => emitMove('down', false)}
        />
        {/* Left */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-10 bg-white/20 active:bg-white/50 rounded-l-lg shadow-sm border border-white/30"
          onTouchStart={(e) => { e.preventDefault(); emitMove('left', true); }}
          onTouchEnd={(e) => { e.preventDefault(); emitMove('left', false); }}
          onTouchCancel={() => emitMove('left', false)}
        />
        {/* Right */}
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-10 bg-white/20 active:bg-white/50 rounded-r-lg shadow-sm border border-white/30"
          onTouchStart={(e) => { e.preventDefault(); emitMove('right', true); }}
          onTouchEnd={(e) => { e.preventDefault(); emitMove('right', false); }}
          onTouchCancel={() => emitMove('right', false)}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/30 rounded-full" />
      </div>

      {/* Action Button */}
      <div className="opacity-80 pointer-events-auto">
        <button
          className="w-16 h-16 bg-hospital-blue/70 active:bg-hospital-blue border-2 border-hospital-sky rounded-full text-white text-[0.6rem] font-bold shadow-lg flex items-center justify-center font-[var(--font-pixel)] leading-none"
          onTouchStart={(e) => { e.preventDefault(); emitInteract(); }}
          onClick={(e) => { e.preventDefault(); emitInteract(); }}
        >
          AKSI
        </button>
      </div>
    </div>
  );
}
