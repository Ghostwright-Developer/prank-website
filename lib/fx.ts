/**
 * Extra synthesized sounds + speech for the comedy screens. No audio files.
 * Everything is silent until the viewer's first click / key press / tap
 * (browser rule), and ?s=0 on the link keeps a prank silent.
 */
import { audioCtx } from "@/lib/sfx"

interface ToneOpts { type?: OscillatorType; gain?: number; slideTo?: number; delay?: number; attack?: number }

function tone(freq: number, dur: number, { type = "sine", gain = 0.1, slideTo, delay = 0, attack = 0.01 }: ToneOpts = {}) {
  const ctx = audioCtx()
  if (!ctx) return
  const t0 = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

let noise: AudioBuffer | null = null
function noiseBuffer(ctx: AudioContext) {
  if (!noise) {
    noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const d = noise.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  return noise
}

/** Filtered noise with an attack/decay envelope. */
function burst(dur: number, { type = "bandpass" as BiquadFilterType, freq = 1000, q = 1, gain = 0.2, attack = 0.01, delay = 0, freqTo }: { type?: BiquadFilterType; freq?: number; q?: number; gain?: number; attack?: number; delay?: number; freqTo?: number } = {}) {
  const ctx = audioCtx()
  if (!ctx) return
  const t0 = ctx.currentTime + delay
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer(ctx)
  src.loop = true
  const f = ctx.createBiquadFilter()
  f.type = type
  f.frequency.setValueAtTime(freq, t0)
  if (freqTo) f.frequency.exponentialRampToValueAtTime(freqTo, t0 + dur)
  f.Q.value = q
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  src.connect(f).connect(g).connect(ctx.destination)
  src.start(t0, Math.random())
  src.stop(t0 + dur + 0.05)
}

export const fx = {
  /** Stadium crowd going wild. */
  cheer(dur = 3.5) {
    burst(dur, { freq: 1100, q: 0.6, gain: 0.32, attack: 0.5 })
    burst(dur, { freq: 2600, q: 0.8, gain: 0.12, attack: 0.3, delay: 0.1 })
    for (let i = 0; i < 14; i++) burst(0.08, { type: "highpass", freq: 3000, gain: 0.08, delay: Math.random() * dur * 0.8 }) // claps
  },
  /** Collective "ooooh, so close". */
  groan() {
    burst(1.6, { freq: 700, freqTo: 260, q: 1.4, gain: 0.3, attack: 0.15 })
    tone(330, 1.4, { type: "sawtooth", slideTo: 150, gain: 0.025, attack: 0.2 })
    tone(247, 1.4, { type: "sawtooth", slideTo: 110, gain: 0.02, attack: 0.2 })
  },
  murmur(dur = 2) {
    burst(dur, { freq: 500, q: 0.7, gain: 0.09, attack: 0.6 })
  },
  airhorn() {
    for (const f of [466, 554, 698]) tone(f, 0.9, { type: "sawtooth", gain: 0.05, attack: 0.03 })
    tone(233, 0.9, { type: "square", gain: 0.04, attack: 0.03 })
  },
  /** Mechanical flap clatter. */
  flap(n = 1) {
    for (let i = 0; i < n; i++) burst(0.025, { type: "highpass", freq: 2400 + Math.random() * 1500, gain: 0.07, delay: i * 0.045 + Math.random() * 0.02 })
  },
  /** Airport PA two-tone chime. */
  paChime() {
    tone(659, 0.55, { gain: 0.11 })
    tone(523, 0.9, { gain: 0.11, delay: 0.42 })
  },
  bubble() {
    const f = 280 + Math.random() * 300
    tone(f, 0.11, { slideTo: f * 2.2, gain: 0.07 })
  },
  splash() {
    burst(0.5, { type: "lowpass", freq: 1800, freqTo: 300, gain: 0.25, attack: 0.02 })
  },
  squeak() {
    tone(900, 0.07, { type: "square", slideTo: 1500, gain: 0.05 })
    tone(1300, 0.1, { type: "square", slideTo: 800, gain: 0.05, delay: 0.08 })
  },
  /** Two-note shark theme. */
  shark() {
    tone(82.4, 0.55, { type: "sawtooth", gain: 0.1, attack: 0.05 })
    tone(87.3, 0.55, { type: "sawtooth", gain: 0.1, delay: 0.7, attack: 0.05 })
    tone(82.4, 0.4, { type: "sawtooth", gain: 0.12, delay: 1.4, attack: 0.03 })
    tone(87.3, 0.4, { type: "sawtooth", gain: 0.13, delay: 1.8, attack: 0.03 })
  },
  thud(strength = 1) {
    const s = Math.min(1, strength)
    tone(110, 0.14, { slideTo: 45, gain: 0.05 + 0.2 * s })
    burst(0.05, { type: "lowpass", freq: 900, gain: 0.04 + 0.1 * s })
  },
  whoosh() {
    burst(0.7, { type: "bandpass", freq: 300, freqTo: 3000, q: 1.2, gain: 0.16, attack: 0.25 })
  },
  pop() {
    tone(500, 0.07, { slideTo: 1200, gain: 0.08 })
  },
  scurry() {
    for (let i = 0; i < 6; i++) burst(0.02, { type: "highpass", freq: 4500, gain: 0.015, delay: i * 0.04 })
  },
  meow() {
    const ctx = audioCtx()
    if (!ctx) return
    const t0 = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.type = "sawtooth"
    osc.frequency.setValueAtTime(420, t0)
    osc.frequency.linearRampToValueAtTime(760, t0 + 0.18)
    osc.frequency.linearRampToValueAtTime(520, t0 + 0.5)
    const vib = ctx.createOscillator(); vib.frequency.value = 6
    const vg = ctx.createGain(); vg.gain.value = 14
    vib.connect(vg).connect(osc.frequency)
    const f1 = ctx.createBiquadFilter(); f1.type = "bandpass"; f1.Q.value = 5
    f1.frequency.setValueAtTime(700, t0); f1.frequency.linearRampToValueAtTime(1500, t0 + 0.2); f1.frequency.linearRampToValueAtTime(900, t0 + 0.5)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.16, t0 + 0.07)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55)
    osc.connect(f1).connect(g).connect(ctx.destination)
    osc.start(t0); vib.start(t0); osc.stop(t0 + 0.6); vib.stop(t0 + 0.6)
  },
  /** Fly buzz that lasts `dur` seconds and swoops. */
  buzz(dur = 1.2) {
    const ctx = audioCtx()
    if (!ctx) return
    const t0 = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.type = "sawtooth"
    osc.frequency.setValueAtTime(190, t0)
    osc.frequency.linearRampToValueAtTime(260, t0 + dur * 0.4)
    osc.frequency.linearRampToValueAtTime(170, t0 + dur)
    const am = ctx.createOscillator(); am.frequency.value = 38
    const amg = ctx.createGain(); amg.gain.value = 0.02
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.045, t0 + 0.12)
    g.gain.setValueAtTime(0.045, t0 + dur - 0.2)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    const lp = ctx.createBiquadFilter(); lp.type = "bandpass"; lp.frequency.value = 600; lp.Q.value = 0.8
    am.connect(amg).connect(g.gain)
    osc.connect(lp).connect(g).connect(ctx.destination)
    osc.start(t0); am.start(t0); osc.stop(t0 + dur + 0.05); am.stop(t0 + dur + 0.05)
  },
  confetti() {
    for (let i = 0; i < 10; i++) burst(0.05, { type: "highpass", freq: 5000, gain: 0.05, delay: Math.random() * 0.6 })
  },
}

/* ───────────────────── Hold music ───────────────────── */

/** Cheesy lobby-jazz loop. Returns a stop function. Waits for audio to be unlocked. */
export function startHoldMusic(): () => void {
  let stopped = false
  let timer: ReturnType<typeof setTimeout> | undefined
  const chords = [
    [261.6, 329.6, 392, 493.9], // Cmaj7
    [220, 261.6, 329.6, 392], //   Am7
    [293.7, 349.2, 440, 523.3], // Dm7
    [196, 246.9, 293.7, 349.2], // G7
  ]
  let step = 0
  const beat = 0.34
  const tick = () => {
    if (stopped) return
    if (audioCtx()) {
      const chord = chords[Math.floor(step / 8) % chords.length]
      const note = chord[[0, 1, 2, 3, 2, 1, 3, 2][step % 8]] * (step % 16 >= 8 ? 2 : 1)
      tone(note, beat * 1.8, { type: "triangle", gain: 0.06 })
      if (step % 8 === 0) for (const n of chord) tone(n / 2, beat * 7.5, { type: "sine", gain: 0.022, attack: 0.15 })
      if (step % 2 === 0) burst(0.04, { type: "highpass", freq: 7000, gain: 0.025 }) // hi-hat
      step++
    }
    timer = setTimeout(tick, beat * 1000)
  }
  tick()
  return () => { stopped = true; if (timer) clearTimeout(timer) }
}

/* ───────────────────── Speech ───────────────────── */

export const speechAvailable = () => typeof window !== "undefined" && "speechSynthesis" in window

function englishVoices(): SpeechSynthesisVoice[] {
  if (!speechAvailable()) return []
  return window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en"))
}

/**
 * Speak with a built-in voice. `voice` 0, 1, 2... picks different English
 * voices (so two announcers can sound different). Resolves when finished (or
 * after a safety timeout). Does nothing before audio is unlocked or with ?s=0.
 */
export function speak(text: string, { voice = 0, rate = 1, pitch = 1, volume = 1 }: { voice?: number; rate?: number; pitch?: number; volume?: number } = {}): Promise<void> {
  return new Promise((resolve) => {
    if (!speechAvailable() || !audioCtx()) return resolve()
    try {
      const u = new SpeechSynthesisUtterance(text)
      const vs = englishVoices()
      if (vs.length) u.voice = vs[voice % vs.length]
      u.rate = rate
      u.pitch = pitch
      u.volume = volume
      const done = () => resolve()
      u.onend = done
      u.onerror = done
      window.speechSynthesis.speak(u)
      setTimeout(done, 4000 + text.length * 120)
    } catch {
      resolve()
    }
  })
}

export function stopSpeaking() {
  try { if (speechAvailable()) window.speechSynthesis.cancel() } catch { /* ignore */ }
}
