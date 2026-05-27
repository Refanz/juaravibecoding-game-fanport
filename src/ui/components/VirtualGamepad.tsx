import React, { useEffect, useState, useRef } from 'react';
import { EventBus } from '../../infrastructure/events/EventBus';

export default function VirtualGamepad() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [layout, setLayout] = useState<'right' | 'left'>('right');
  const [type, setType] = useState<'dpad' | 'joystick'>('dpad');

  const joystickRef = useRef<HTMLDivElement>(null);
  const [joyPos, setJoyPos] = useState({ x: 0, y: 0 });
  const [activeDirs, setActiveDirs] = useState({ up: false, down: false, left: false, right: false });

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    
    const savedLayout = localStorage.getItem('jvc_gamepad_layout');
    if (savedLayout === 'left' || savedLayout === 'right') setLayout(savedLayout);
    const savedType = localStorage.getItem('jvc_gamepad_type');
    if (savedType === 'joystick' || savedType === 'dpad') setType(savedType);

    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  if (!isTouchDevice) return null;

  const emitMove = (dir: 'up' | 'down' | 'left' | 'right', isDown: boolean) => {
    EventBus.emit('virtual_pad_move', { dir, isDown });
  };

  const emitInteract = () => {
    EventBus.emit('virtual_pad_interact');
  };

  const handleJoyMove = (e: React.TouchEvent) => {
    if (!joystickRef.current) return;
    const touch = e.touches[0];
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const max = rect.width / 2;
    
    let nx = dx;
    let ny = dy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist > max) {
      nx = (dx / dist) * max;
      ny = (dy / dist) * max;
    }
    setJoyPos({ x: nx, y: ny });

    const threshold = max * 0.3;
    const newDirs = {
      up: ny < -threshold,
      down: ny > threshold,
      left: nx < -threshold,
      right: nx > threshold
    };
    
    (['up', 'down', 'left', 'right'] as const).forEach(dir => {
      if (newDirs[dir] !== activeDirs[dir]) {
        emitMove(dir, newDirs[dir]);
      }
    });
    setActiveDirs(newDirs);
  };

  const handleJoyEnd = () => {
    setJoyPos({ x: 0, y: 0 });
    (['up', 'down', 'left', 'right'] as const).forEach(dir => {
      if (activeDirs[dir]) emitMove(dir, false);
    });
    setActiveDirs({ up: false, down: false, left: false, right: false });
  };

  const renderDPad = () => (
    <div className="relative w-32 h-32 opacity-80 pointer-events-auto touch-none select-none">
      <button
        className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-12 bg-white/20 active:bg-white/50 rounded-t-lg shadow-sm border border-white/30"
        onTouchStart={(e) => { if (e.cancelable) e.preventDefault(); emitMove('up', true); }}
        onTouchEnd={(e) => { if (e.cancelable) e.preventDefault(); emitMove('up', false); }}
        onTouchCancel={() => emitMove('up', false)}
      />
      <button
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-12 bg-white/20 active:bg-white/50 rounded-b-lg shadow-sm border border-white/30"
        onTouchStart={(e) => { if (e.cancelable) e.preventDefault(); emitMove('down', true); }}
        onTouchEnd={(e) => { if (e.cancelable) e.preventDefault(); emitMove('down', false); }}
        onTouchCancel={() => emitMove('down', false)}
      />
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-10 bg-white/20 active:bg-white/50 rounded-l-lg shadow-sm border border-white/30"
        onTouchStart={(e) => { if (e.cancelable) e.preventDefault(); emitMove('left', true); }}
        onTouchEnd={(e) => { if (e.cancelable) e.preventDefault(); emitMove('left', false); }}
        onTouchCancel={() => emitMove('left', false)}
      />
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-10 bg-white/20 active:bg-white/50 rounded-r-lg shadow-sm border border-white/30"
        onTouchStart={(e) => { if (e.cancelable) e.preventDefault(); emitMove('right', true); }}
        onTouchEnd={(e) => { if (e.cancelable) e.preventDefault(); emitMove('right', false); }}
        onTouchCancel={() => emitMove('right', false)}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/30 rounded-full" />
    </div>
  );

  const renderJoystick = () => (
    <div 
      ref={joystickRef}
      className="relative w-32 h-32 opacity-80 pointer-events-auto bg-white/10 border-2 border-white/20 rounded-full shadow-inner touch-none select-none"
      onTouchStart={(e) => { if (e.cancelable) e.preventDefault(); handleJoyMove(e); }}
      onTouchMove={(e) => { if (e.cancelable) e.preventDefault(); handleJoyMove(e); }}
      onTouchEnd={(e) => { if (e.cancelable) e.preventDefault(); handleJoyEnd(); }}
      onTouchCancel={(e) => { if (e.cancelable) e.preventDefault(); handleJoyEnd(); }}
    >
      <div 
        className="absolute top-1/2 left-1/2 w-14 h-14 bg-white/40 border border-white/50 rounded-full shadow-md transition-none"
        style={{ transform: `translate(calc(-50% + ${joyPos.x}px), calc(-50% + ${joyPos.y}px))` }}
      />
    </div>
  );

  return (
    <div className={`absolute bottom-6 left-6 right-6 flex items-end pointer-events-none z-[100] ${layout === 'left' ? 'flex-row-reverse justify-between' : 'justify-between'}`}>
      {/* Direction Control */}
      {type === 'dpad' ? renderDPad() : renderJoystick()}

      {/* Action Button */}
      <div className="opacity-80 pointer-events-auto touch-none select-none">
        <button
          className="w-16 h-16 bg-hospital-blue/70 active:bg-hospital-blue border-2 border-hospital-sky rounded-full text-white text-[0.6rem] font-bold shadow-lg flex items-center justify-center font-[var(--font-pixel)] leading-none"
          onTouchStart={(e) => { if (e.cancelable) e.preventDefault(); emitInteract(); }}
          onClick={(e) => { if (e.cancelable) e.preventDefault(); emitInteract(); }}
        >
          AKSI
        </button>
      </div>
    </div>
  );
}
