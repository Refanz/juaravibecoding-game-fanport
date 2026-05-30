import React, { useState, useEffect } from 'react';
import { SVG_DEFS } from '../../../infrastructure/assets/svg';
import { npcSpriteKey } from '../../../infrastructure/assets/AssetManager';
import { NPC_DIALOGS } from '../../../infrastructure/data/npcDialogs';

interface NPCDialogModalProps {
  role: 'doctor' | 'nurse' | 'guest' | 'nurseWheelchair' | 'nurseBed' | 'walkingNurse' | 'security';
  label: string;
  onClose: () => void;
}

const svgToDataUri = (svgString: string) => {
  return `data:image/svg+xml;base64,${btoa(svgString)}`;
};

const getDialogForNPC = (label: string, role: string) => {
  const exactMatch = NPC_DIALOGS[`${label}_${role}`];
  if (exactMatch) return exactMatch;
  const fallbackMatch = NPC_DIALOGS[`default_${role}`];
  if (fallbackMatch) return fallbackMatch;
  return NPC_DIALOGS[`default_generic`];
};

export const NPCDialogModal: React.FC<NPCDialogModalProps> = ({ role, label, onClose }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [fullText, setFullText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const dialog = getDialogForNPC(label, role);
    const randomMsg = dialog.messages[Math.floor(Math.random() * dialog.messages.length)];
    const text = `${dialog.greeting} ${randomMsg}`;
    setFullText(text);
    setDisplayedText('');
    setIsTyping(true);

    let i = 0;
    const typingInterval = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [label, role]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, fullText, onClose]);

  const handleSkip = () => {
    onClose();
  };

  const spriteKey = npcSpriteKey(role);
  const spriteSvg = SVG_DEFS[spriteKey];
  const imgSrc = spriteSvg ? svgToDataUri(spriteSvg) : '';

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-2 pb-4 sm:p-6 sm:pb-[90px] pointer-events-none">
      <div 
        className="pointer-events-auto relative w-[95%] max-w-[400px] sm:w-full sm:max-w-3xl bg-slate-900/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-sky-400/50 shadow-[0_0_20px_rgba(79,195,247,0.3)] overflow-hidden flex flex-row"
      >
        {/* Left Side: Avatar */}
        <div className="w-[70px] sm:w-1/3 sm:min-w-[140px] bg-gradient-to-br from-sky-900/40 to-slate-800/80 p-2 sm:p-6 flex items-center justify-center border-r border-sky-500/20 shrink-0">
          <div className="w-12 h-12 sm:w-32 sm:h-32 rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center bg-slate-800/50 border border-sky-500/30 shadow-inner">
            {imgSrc && (
              <img 
                src={imgSrc} 
                alt={label} 
                className="w-8 h-8 sm:w-24 sm:h-24 object-contain filter drop-shadow-lg"
              />
            )}
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 p-2 sm:p-6 flex flex-col relative min-h-[70px] sm:min-h-[160px]">
          <div className="mb-0.5 sm:mb-3 flex items-center gap-1.5 sm:gap-3">
            <h3 className="text-xs sm:text-2xl font-bold text-[#4fc3f7] uppercase tracking-wide leading-none">
              {label}
            </h3>
            <span className="px-1 py-0.5 text-[7px] sm:text-xs font-semibold bg-sky-500/20 text-sky-300 rounded border border-sky-500/30 uppercase leading-none">
              {role}
            </span>
          </div>

          <div className="flex-1 mt-0.5 sm:mt-2 mb-5 sm:mb-0 pr-1">
            <p className="text-white text-[9px] sm:text-lg leading-[1.4] sm:leading-[1.6] font-sans">
              "{displayedText}"
              {isTyping && <span className="inline-block w-1 h-2 sm:w-2 sm:h-5 bg-sky-400 ml-1 animate-pulse" />}
            </p>
          </div>

          <button 
            onClick={handleSkip}
            className="absolute bottom-1.5 right-1.5 sm:bottom-5 sm:right-5 px-2 py-0.5 sm:px-5 sm:py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-[8px] sm:text-sm rounded sm:rounded-lg transition-colors flex items-center gap-1 sm:gap-2"
          >
            {isTyping ? 'Lewati ▶' : 'Tutup ⏩'}
          </button>
        </div>
      </div>
    </div>
  );
};
