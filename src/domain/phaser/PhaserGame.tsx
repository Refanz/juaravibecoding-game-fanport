// ==========================================
// domain/phaser/PhaserGame.tsx
// Komponen React yang membungkus instance Phaser
// ==========================================

import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { GameScene } from './GameScene';
import { FloorManager } from '../FloorManager';
import { GameState } from '../GameState';

interface PhaserGameProps {
  floorManager: FloorManager;
  gameState: GameState;
}

export const PhaserGame: React.FC<PhaserGameProps> = ({ floorManager, gameState }) => {
  const gameContainer = useRef<HTMLDivElement>(null);
  const gameInstance = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameContainer.current || gameInstance.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.RESIZE,
        parent: gameContainer.current,
        width: '100%',
        height: '100%'
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scene: [GameScene],
      backgroundColor: '#e0e8f0'
    };

    gameInstance.current = new Phaser.Game(config);

    // Pass data to scene
    gameInstance.current.scene.start('GameScene', { floorManager, gameState });

    return () => {
      if (gameInstance.current) {
        gameInstance.current.destroy(true);
        gameInstance.current = null;
      }
    };
  }, [floorManager, gameState]);

  return <div ref={gameContainer} id="phaser-container" className="w-full h-full" />;
};
