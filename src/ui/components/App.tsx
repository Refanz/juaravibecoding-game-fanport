// ==========================================
// ui/components/App.tsx
// Root React component — routing antar screen
// + asset preload pada startup
// ==========================================

import { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import GameScreen from './GameScreen';
import SplashScreen from './SplashScreen';
import { InstallPWAPrompt } from './InstallPWAPrompt';

type AppScreen = 'splash' | 'welcome' | 'game';

export default function App() {
  const [screen,  setScreen]  = useState<AppScreen>('splash');
  const [gameKey, setGameKey] = useState(0);

  const handleSplashComplete = () => { setScreen('welcome'); };
  const handleStart = () => { setScreen('game'); };
  const handleReturnToWelcome = () => { setGameKey(k => k + 1); setScreen('welcome'); };

  return (
    <div className="relative w-full h-[100dvh] overflow-x-hidden overflow-y-auto">
      {/* GameScreen runs continuously in the background so it can preload */}
      <GameScreen 
        key={gameKey} 
        onReturnToWelcome={handleReturnToWelcome} 
        isWelcome={screen !== 'game'} 
      />

      {/* Splash Screen overlays everything at the very beginning */}
      {screen === 'splash' && (
        <div className="absolute inset-0 z-[200]">
          <SplashScreen onComplete={handleSplashComplete} />
        </div>
      )}

      {/* WelcomeScreen overlays on top of the game when active */}
      {screen === 'welcome' && (
        <div className="absolute inset-0 z-[100]">
          <WelcomeScreen onStart={handleStart} />
        </div>
      )}

      <InstallPWAPrompt />
    </div>
  );
}
