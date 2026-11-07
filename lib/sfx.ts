/**
 * Tiny Web Audio synth: no audio files. Browsers only allow sound after a
 * user gesture, so everything is silent until unlockAudio() runs from the
 * first click / tap / key press (FullscreenPrank does this).
 * Add ?s=0 to a link to keep a prank silent.
 */
type Ctx = AudioContext
let ctx: Ctx | null = null

export function sfxEnabled(): boolean {
  try {
    return new URLSearchParams(location.search).get("s") !== "0"
  } catch {
    return true
  }
}

export function unlockAudio(): void {
  if (!sfxEnabled()) return
  try {
    if (!ctx) {
      const C = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!C) return
      ctx = new C()
    }
    if (ctx.state === "suspended") void ctx.resume()
  } catch {
    /* no audio available */
  }
}

const ready = () => !!ctx && ctx.state === "running" && sfxEnabled()

interface ToneOpts { type?: OscillatorType; gain?: number; slideTo?: number; delay?: number }
function tone(freq: number, dur: number, { type = "sine", gain = 0.12, slideTo, delay = 0 }: ToneOpts = {}) {
  if (!ready() || !ctx) return
  const t0 = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

export const sfx = {
  /** Windows-style error "ding". */
  ding() {
    tone(1318, 0.45, { gain: 0.1 })
    tone(1975, 0.3, { gain: 0.04 })
  },
  /** Harsher critical-stop sound. */
  error() {
    tone(392, 0.16, { type: "triangle", gain: 0.14 })
    tone(294, 0.28, { type: "triangle", gain: 0.14, delay: 0.14 })
  },
  /** Notification chime. */
  chime() {
    tone(784, 0.25, { gain: 0.08 })
    tone(1047, 0.4, { gain: 0.08, delay: 0.16 })
  },
  /** PC speaker beep (BIOS POST). */
  beep(ms = 150) {
    tone(1000, ms / 1000, { type: "square", gain: 0.05 })
  },
  /** Glass impact: short noise burst plus a couple of high clinks. */
  glass() {
    if (!ready() || !ctx) return
    const len = Math.floor(ctx.sampleRate * 0.35)
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2)
    const src = ctx.createBufferSource()
    src.buffer = buf
    const hp = ctx.createBiquadFilter()
    hp.type = "highpass"
    hp.frequency.value = 1800
    const g = ctx.createGain()
    g.gain.value = 0.35
    src.connect(hp).connect(g).connect(ctx.destination)
    src.start()
    tone(3100, 0.18, { gain: 0.05, delay: 0.02 })
    tone(4200, 0.12, { gain: 0.03, delay: 0.08 })
  },
  click() {
    tone(1800 + Math.random() * 600, 0.03, { type: "square", gain: 0.03 })
  },
}

export type LoopName = "siren" | "alarm" | "pulse" | "typing" | "beeps"

/** Starts an ambient loop; returns a stop function. Silent until audio is unlocked. */
export function startLoop(name: LoopName): () => void {
  const timers: ReturnType<typeof setInterval>[] = []
  let osc: OscillatorNode | null = null
  let lfo: OscillatorNode | null = null
  let master: GainNode | null = null
  let cancelled = false
  let tries = 0

  const begin = () => {
    if (cancelled) return
    if (!ready() || !ctx) {
      if (tries++ < 600) timers.push(setTimeout(begin, 500) as unknown as ReturnType<typeof setInterval>)
      return
    }
    if (name === "siren") {
      osc = ctx.createOscillator()
      lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      master = ctx.createGain()
      osc.type = "sawtooth"
      osc.frequency.value = 780
      lfo.frequency.value = 0.9
      lfoGain.gain.value = 170
      master.gain.value = 0.035
      lfo.connect(lfoGain).connect(osc.frequency)
      osc.connect(master).connect(ctx.destination)
      osc.start()
      lfo.start()
    } else if (name === "alarm") {
      timers.push(setInterval(() => { tone(1000, 0.12, { type: "square", gain: 0.04 }); tone(1000, 0.12, { type: "square", gain: 0.04, delay: 0.22 }) }, 2000))
    } else if (name === "pulse") {
      timers.push(setInterval(() => { tone(62, 0.22, { gain: 0.25 }); tone(55, 0.3, { gain: 0.22, delay: 0.28 }) }, 1300))
    } else if (name === "typing") {
      const schedule = () => { sfx.click(); timers.push(setTimeout(schedule, 40 + Math.random() * 190) as unknown as ReturnType<typeof setInterval>) }
      schedule()
    } else if (name === "beeps") {
      timers.push(setInterval(() => { sfx.beep(180); setTimeout(() => sfx.beep(180), 300); setTimeout(() => sfx.beep(600), 600) }, 5000))
    }
  }
  begin()

  return () => {
    cancelled = true
    timers.forEach((t) => { clearInterval(t); clearTimeout(t) })
    try { osc?.stop(); lfo?.stop() } catch { /* already stopped */ }
  }
}
