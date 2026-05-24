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

  const handleStart = () => { setGameKey(k => k + 1); setScreen('game'); };
  const handleReturnToWelcome = () => setScreen('welcome');

  return (
    <>
      {screen === 'welcome' && <WelcomeScreen onStart={handleStart} />}
      {screen === 'game'    && (
        <GameScreen key={gameKey} onReturnToWelcome={handleReturnToWelcome} />
      )}
    </>
  );
}
