// ==========================================
// ui/components/App.tsx
// Root React component — routing antar screen
// + asset preload pada startup
// ==========================================

import { useState, useEffect } from 'react';
import { preloadSprites, SpriteMap } from '../../infrastructure/assets/AssetManager';
import WelcomeScreen from './WelcomeScreen';
import GameScreen from './GameScreen';

type AppScreen = 'welcome' | 'game';

export default function App() {
  const [sprites, setSprites] = useState<SpriteMap | null>(null);
  const [screen,  setScreen]  = useState<AppScreen>('welcome');
  const [gameKey, setGameKey] = useState(0);

  // Preload semua SVG sprite satu kali saat mount
  useEffect(() => {
    preloadSprites().then(setSprites);
  }, []);

  const handleStart = () => { setGameKey(k => k + 1); setScreen('game'); };
  const handleReturnToWelcome = () => setScreen('welcome');

  if (!sprites) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
        height:'100vh', fontFamily:'monospace', color:'#4fc3f7', fontSize:'1rem' }}>
        🏥 Loading assets...
      </div>
    );
  }

  return (
    <>
      {screen === 'welcome' && <WelcomeScreen onStart={handleStart} />}
      {screen === 'game'    && (
        <GameScreen key={gameKey} sprites={sprites} onReturnToWelcome={handleReturnToWelcome} />
      )}
    </>
  );
}
