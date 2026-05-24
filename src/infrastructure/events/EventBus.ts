// ==========================================
// infrastructure/events/EventBus.ts
// Komunikasi antara Phaser dan React
// ==========================================

import Phaser from 'phaser';

// Singleton event emitter
export const EventBus = new Phaser.Events.EventEmitter();
