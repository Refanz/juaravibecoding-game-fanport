// ==========================================
// ui/components/App.tsx
// Root React component — routing antar screen
// + asset preload pada startup
// ==========================================

import { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import GameScreen from './GameScreen';

type AppScreen = 'welcome' | 'game';

export default function App() {
  const [screen,  setScreen]  = useState<AppScreen>('welcome');
  const [gameKey, setGameKey] = useState(0);

  const handleStart = () => { setScreen('game'); };
  const handleReturnToWelcome = () => { setGameKey(k => k + 1); setScreen('welcome'); };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* GameScreen runs continuously in the background */}
      <GameScreen 
        key={gameKey} 
        onReturnToWelcome={handleReturnToWelcome} 
        isWelcome={screen === 'welcome'} 
      />

      {/* WelcomeScreen overlays on top of the game when active */}
      {screen === 'welcome' && (
        <div className="absolute inset-0 z-[100]">
          <WelcomeScreen onStart={handleStart} />
        </div>
      )}
    </div>
  );
}
