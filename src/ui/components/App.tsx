// ==========================================
// ui/components/App.tsx
// Root React component — routing antar screen
// + asset preload pada startup
// ==========================================

import { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import GameScreen from './GameScreen';
import { InstallPWAPrompt } from './InstallPWAPrompt';

type AppScreen = 'welcome' | 'game';

export default function App() {
  const [screen,  setScreen]  = useState<AppScreen>('welcome');
  const [gameKey, setGameKey] = useState(0);

  const handleStart = () => { setScreen('game'); };
  const handleReturnToWelcome = () => { setGameKey(k => k + 1); setScreen('welcome'); };

  return (
    <div className="relative w-full h-[100dvh] overflow-x-hidden overflow-y-auto bg-dark-deep">
      {/* WelcomeScreen overlays on top when active */}
      {screen === 'welcome' && (
        <div className="absolute inset-0 z-[100]">
          <WelcomeScreen onStart={handleStart} />
        </div>
      )}

      {/* GameScreen mounts and preloads assets only after Start Game is pressed */}
      {screen === 'game' && (
        <GameScreen 
          key={gameKey} 
          onReturnToWelcome={handleReturnToWelcome} 
          isWelcome={false} 
        />
      )}

      <InstallPWAPrompt />
    </div>
  );
}
