// Procedural Web Audio API sound synthesizer for Shelf Match

class AudioManager {
  private ctx: AudioContext | null = null;
  private soundEnabled = true;
  private musicEnabled = false;
  private vibrationEnabled = true;
  private musicInterval: number | null = null;
  private musicStep = 0;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  public setVibrationEnabled(enabled: boolean) {
    this.vibrationEnabled = enabled;
  }

  public vibrate(pattern: number | number[] = 20) {
    if (!this.vibrationEnabled || typeof window === 'undefined') return;
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Ignore vibration errors
    }
  }

  // --- SOUND EFFECTS ---

  public playTap() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
    this.vibrate(10);
  }

  public playDrag() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(380, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
    this.vibrate(15);
  }

  public playDrop() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.09);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
    this.vibrate(20);
  }

  public playMatch() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Harmonic 3-note chime (C5, E5, G5)
    const freqs = [523.25, 659.25, 783.99];
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.28);
    });
    this.vibrate([30, 20, 40]);
  }

  public playCombo(multiplier: number = 2) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // 4 ascending triumphant notes
    const baseFreqs = [523.25, 659.25, 783.99, 1046.5];
    const pitchShift = Math.min(1.4, 1 + (multiplier - 1) * 0.1);

    baseFreqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * pitchShift, startTime);

      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
    this.vibrate([40, 30, 40, 30, 60]);
  }

  public playReveal() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Soft celestial harp sparkle (D6, F#6, A6, C#7)
    const freqs = [1174.66, 1479.98, 1760.0, 2217.46];
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.045;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
    this.vibrate(25);
  }

  public playUnlock() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.setValueAtTime(1400, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
    this.vibrate(30);
  }

  public playIceShatter() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Crisp high frequency burst
    [1800, 2200, 2600].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + i * 0.02;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, startTime + 0.08);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.08);
    });
    this.vibrate([20, 20, 40]);
  }

  public playFridgeAlarmBeep() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Dual electronic refrigerator door alarm beep (B5 - 987.77 Hz)
    [0, 0.12].forEach((delay) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + delay;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.08);
    });
    this.vibrate([30, 30, 30]);
  }

  public playFridgeDoorSlam() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Heavy metallic thud + rubber seal compression + latch click sound
    const now = this.ctx.currentTime;

    // Low frequencies for heavy body impact thud (60Hz - 180Hz)
    const lowOsc = this.ctx.createOscillator();
    const lowGain = this.ctx.createGain();
    lowOsc.type = 'triangle';
    lowOsc.frequency.setValueAtTime(160, now);
    lowOsc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

    lowGain.gain.setValueAtTime(0.6, now);
    lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    lowOsc.connect(lowGain);
    lowGain.connect(this.ctx.destination);
    lowOsc.start(now);
    lowOsc.stop(now + 0.35);

    // Mid noise hit for metallic latch click at the end of the swing
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.15, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1200, now + 0.15);
    noiseFilter.Q.setValueAtTime(3, now + 0.15);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0, now);
    noiseGain.gain.setValueAtTime(0.4, now + 0.15);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.3);

    this.vibrate([80, 50, 100]);
  }

  public playFreezeTime() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Crystalline freeze sound sweep
    const freqs = [2400, 2000, 1600, 1200];
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.04;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.15);
    });
    this.vibrate([20, 30, 50]);
  }

  public playHammerSmash() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Heavy crushing metal impact
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
    this.vibrate([60, 40, 80]);
  }

  public playWin() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Victory fanfare (C5, G5, C6, E6, G6)
    const melody = [523.25, 783.99, 1046.5, 1318.51, 1567.98];
    melody.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.11;
      const duration = idx === melody.length - 1 ? 0.6 : 0.2;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
    this.vibrate([50, 40, 80, 40, 150]);
  }

  public playFail() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const freqs = [440, 392, 349, 293];
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.12;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.22);
    });
    this.vibrate([80, 50, 120]);
  }

  public playError() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
    this.vibrate([30, 20, 30]);
  }

  // --- BACKGROUND MUSIC ---
  // Ambient supermarket lo-fi synth chord progression (relaxed, soft, pleasant)
  private startMusic() {
    if (this.musicInterval) return;
    this.initCtx();

    // Chords: Cmaj7 -> Am7 -> Dm7 -> G7
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [293.66, 349.23, 440.00, 523.25], // Dm7
      [196.00, 246.94, 293.66, 349.23], // G7
    ];

    this.musicStep = 0;
    this.playChord(chords[0]);

    this.musicInterval = window.setInterval(() => {
      if (!this.musicEnabled) {
        this.stopMusic();
        return;
      }
      this.musicStep = (this.musicStep + 1) % chords.length;
      this.playChord(chords[this.musicStep]);
    }, 2400);
  }

  private playChord(notes: number[]) {
    if (!this.ctx || !this.musicEnabled) return;
    const now = this.ctx.currentTime;

    notes.forEach((freq) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Very soft ambient pad volume
      gain.gain.setValueAtTime(0.018, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 2.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.3);
    });
  }

  private stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const audio = new AudioManager();
