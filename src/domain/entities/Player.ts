// ==========================================
// domain/entities/Player.ts
// Entitas Player — OOP dengan enkapsulasi (Phaser Extension)
// ==========================================

import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  // Kecepatan gerak player disesuaikan menjadi lebih lambat
  public readonly speed = 110; 

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setSize(24, 24);
    this.setOffset(12, 24);
    this.setDepth(y + 24);
    this.setCollideWorldBounds(true);
    this.setData('dir', 'down');

    this.createAnimations();
  }

  private createAnimations() {
    const anims = this.scene.anims;

    if (!anims.exists('walk_down')) {
      anims.create({
        key: 'walk_down',
        frames: anims.generateFrameNumbers('player', { start: 0, end: 2 }),
        frameRate: 8,
        repeat: -1
      });
      anims.create({
        key: 'walk_up',
        frames: anims.generateFrameNumbers('player', { start: 3, end: 5 }),
        frameRate: 8,
        repeat: -1
      });
      anims.create({
        key: 'walk_right',
        frames: anims.generateFrameNumbers('player', { start: 6, end: 8 }),
        frameRate: 8,
        repeat: -1
      });
      
      anims.create({ key: 'idle_down', frames: [{ key: 'player', frame: 0 }], frameRate: 1 });
      anims.create({ key: 'idle_up', frames: [{ key: 'player', frame: 3 }], frameRate: 1 });
      anims.create({ key: 'idle_right', frames: [{ key: 'player', frame: 6 }], frameRate: 1 });
    }
  }

  public updateMovement(vx: number, vy: number) {
    // Normalize diagonal velocity
    if (vx !== 0 && vy !== 0) {
      vx *= Math.SQRT1_2;
      vy *= Math.SQRT1_2;
    }

    this.setVelocity(vx, vy);

    let dir = this.getData('dir');
    if (vx < 0) dir = 'left';
    else if (vx > 0) dir = 'right';
    else if (vy < 0) dir = 'up';
    else if (vy > 0) dir = 'down';

    this.setData('dir', dir);

    if (vx !== 0 || vy !== 0) {
      if (dir === 'left') {
        this.setFlipX(true);
        this.anims.play('walk_right', true);
      } else if (dir === 'right') {
        this.setFlipX(false);
        this.anims.play('walk_right', true);
      } else if (dir === 'up') {
        this.anims.play('walk_up', true);
      } else if (dir === 'down') {
        this.anims.play('walk_down', true);
      }
    } else {
      if (dir === 'left') {
        this.setFlipX(true);
        this.anims.play('idle_right');
      } else if (dir === 'right') {
        this.setFlipX(false);
        this.anims.play('idle_right');
      } else if (dir === 'up') {
        this.anims.play('idle_up');
      } else if (dir === 'down') {
        this.anims.play('idle_down');
      }
    }
  }
}
