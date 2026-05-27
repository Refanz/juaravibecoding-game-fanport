import React, { useState, useEffect } from 'react';
import { SVG_DEFS } from '../../infrastructure/assets/svg';
import { npcSpriteKey } from '../../infrastructure/assets/AssetManager';
import { NPC_DIALOGS } from '../../infrastructure/data/npcDialogs';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
      <div 
        className="pointer-events-auto relative w-full max-w-2xl bg-slate-900/95 backdrop-blur-md rounded-2xl border border-sky-400/50 shadow-[0_0_20px_rgba(79,195,247,0.3)] overflow-hidden flex flex-row"
      >
        {/* Left Side: Avatar */}
        <div className="w-1/3 min-w-[120px] bg-gradient-to-br from-sky-900/40 to-slate-800/80 p-4 flex items-center justify-center border-r border-sky-500/20">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex items-center justify-center bg-slate-800/50 border border-sky-500/30 shadow-inner">
            {imgSrc && (
              <img 
                src={imgSrc} 
                alt={label} 
                className="w-16 h-16 sm:w-24 sm:h-24 object-contain filter drop-shadow-lg"
              />
            )}
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 p-6 flex flex-col relative min-h-[160px]">
          <div className="mb-2 flex items-center gap-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#4fc3f7] uppercase tracking-wide">
              {label}
            </h3>
            <span className="px-2 py-0.5 text-[10px] sm:text-xs font-semibold bg-sky-500/20 text-sky-300 rounded border border-sky-500/30 uppercase">
              {role}
            </span>
          </div>

          <div className="flex-1 mt-2">
            <p className="text-white text-sm sm:text-base leading-[1.6] font-sans">
              "{displayedText}"
              {isTyping && <span className="inline-block w-2 h-4 bg-sky-400 ml-1 animate-pulse" />}
            </p>
          </div>

          <button 
            onClick={handleSkip}
            className="absolute bottom-4 right-4 px-4 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-sm rounded-lg transition-colors flex items-center gap-2"
          >
            {isTyping ? 'Lewati ▶' : 'Tutup ⏩'}
          </button>
        </div>
      </div>
    </div>
  );
};
