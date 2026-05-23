// ==========================================
// ui/hooks/useInput.ts
// Custom hook untuk keyboard state
// ==========================================

import { useEffect, useRef } from 'react';

export type KeyMap = Record<string, boolean>;

export function useInput(): { keys: KeyMap; consumeKey: (k: string) => void } {
  const keys = useRef<KeyMap>({});

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      keys.current[e.code] = true;
      if (e.code === 'Space') e.preventDefault();
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
      keys.current[e.code] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const consumeKey = (k: string) => { keys.current[k] = false; };

  return { keys: keys.current, consumeKey };
}
