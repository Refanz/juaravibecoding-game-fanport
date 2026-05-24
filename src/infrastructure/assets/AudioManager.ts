// ==========================================
// infrastructure/assets/AudioManager.ts
// Procedural SFX via Web Audio API
// ==========================================

const AudioCtxCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
let audioCtx: AudioContext | null = null;
let isMuted = localStorage.getItem('jvc_sound') === 'off';

function beep(freq: number, dur: number, type: OscillatorType = 'square'): void {
  if (isMuted) return;
  if (!audioCtx) audioCtx = new AudioCtxCtor();
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = 0.08;
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
  o.connect(g);
  g.connect(audioCtx.destination);
  o.start();
  o.stop(audioCtx.currentTime + dur);
}

export const AudioManager = {
  setMuted: (muted: boolean) => {
    isMuted = muted;
    localStorage.setItem('jvc_sound', muted ? 'off' : 'on');
  },
  isMuted: () => isMuted,
  click:    () => beep(440, 0.1),
  correct:  () => { beep(523,0.1); setTimeout(()=>beep(659,0.1),100); setTimeout(()=>beep(784,0.15),200); },
  wrong:    () => { beep(200,0.2,'sawtooth'); setTimeout(()=>beep(150,0.3,'sawtooth'),200); },
  interact: () => { beep(440,0.05); beep(660,0.05); },
  complete: () => { [523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,0.15),i*120)); },
  elevator: () => { beep(330,0.15); setTimeout(()=>beep(440,0.15),150); setTimeout(()=>beep(550,0.2),300); },
};
