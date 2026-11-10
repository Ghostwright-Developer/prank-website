/**
 * Extra synthesized sounds + speech for the comedy screens. No audio files.
 * Everything is silent until the viewer's first click / key press / tap
 * (browser rule), and ?s=0 on the link keeps a prank silent.
 */
import { audioCtx } from "@/lib/sfx"
import { CLIP_IDS } from "@/lib/voice-manifest"

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

const sfxCache = new Map<string, Promise<AudioBuffer | null>>()
function loadSfx(name: string): Promise<AudioBuffer | null> {
  let p = sfxCache.get(name)
  if (!p) {
    p = (async () => {
      const ctx = audioCtx()
      if (!ctx) { sfxCache.delete(name); return null }
      try {
        const r = await fetch(`/sfx/${name}.mp3`)
        if (!r.ok) return null
        return await ctx.decodeAudioData(await r.arrayBuffer())
      } catch { return null }
    })()
    sfxCache.set(name, p)
  }
  return p
}
const pickOf = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]
/** Plays one of several recorded-style crowd clips; calls the synth fallback if none can load. */
function crowd(names: string[], gain: number, fallback: () => void) {
  const ctx = audioCtx()
  if (!ctx) return
  void loadSfx(pickOf(names)).then((buf) => {
    if (!buf) { fallback(); return }
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.playbackRate.value = 0.97 + Math.random() * 0.06
    const g = ctx.createGain()
    g.gain.value = gain
    src.connect(g).connect(ctx.destination)
    src.start()
  })
}
export const preloadCrowd = () => {
  for (const n of ["cheer-1", "cheer-2", "cheer-3", "cheer-big-1", "cheer-big-2", "roar-1", "roar-2", "roar-3", "boo-1", "boo-2", "boo-3", "groan-1", "groan-2", "groan-3", "groan-4", "ooh-1", "ooh-2", "gasp-1", "gasp-2", "applause-1", "applause-2", "applause-3", "murmur-1", "murmur-2", "airhorn-1", "airhorn-2", "airhorn-3"]) void loadSfx(n)
}

export const fx = {
  /** Crowd cheers. dur picks the size: short < 2.8 < medium < 5 <= big. */
  cheer(dur = 3.5) {
    const names = dur < 2.8 ? ["cheer-3", "cheer-1"] : dur < 5 ? ["cheer-1", "cheer-2", "cheer-3"] : ["cheer-big-1", "cheer-big-2"]
    crowd(names, 0.9, () => fx.cheerSynth(dur))
  },
  /** The big one: a goal, a corner, a comeback. */
  roar() { crowd(["roar-1", "roar-2", "roar-3"], 1, () => fx.cheerSynth(5)) },
  /** Collective "ooooh, so close". */
  groan(long = false) { crowd(long ? ["groan-2", "groan-4"] : ["groan-1", "groan-3"], 0.95, () => fx.groanSynth()) },
  boo(long = false) { crowd(long ? ["boo-2", "boo-3"] : ["boo-1", "boo-2"], 0.95, () => fx.groanSynth()) },
  gasp() { crowd(["gasp-1", "gasp-2"], 0.9, () => fx.murmurSynth(1)) },
  /** Rising "ooooh": something is about to happen. */
  ooh() { crowd(["ooh-1", "ooh-2"], 0.85, () => fx.murmurSynth(2)) },
  applause(big = false) { crowd(big ? ["applause-2", "applause-3"] : ["applause-1", "applause-2"], 0.9, () => fx.cheerSynth(3)) },
  murmur(dur = 2) { crowd(["murmur-1", "murmur-2"], dur > 5 ? 0.45 : 0.3, () => fx.murmurSynth(dur)) },
  airhorn(n = 1) { crowd(n >= 3 ? ["airhorn-3"] : n === 2 ? ["airhorn-2"] : ["airhorn-1"], 0.8, () => fx.airhornSynth()) },
  /** Stadium crowd going wild. */
  cheerSynth(dur = 3.5) {
    burst(dur, { freq: 1100, q: 0.6, gain: 0.32, attack: 0.5 })
    burst(dur, { freq: 2600, q: 0.8, gain: 0.12, attack: 0.3, delay: 0.1 })
    for (let i = 0; i < 14; i++) burst(0.08, { type: "highpass", freq: 3000, gain: 0.08, delay: Math.random() * dur * 0.8 }) // claps
  },
  /** Collective "ooooh, so close". */
  groanSynth() {
    burst(1.6, { freq: 700, freqTo: 260, q: 1.4, gain: 0.3, attack: 0.15 })
    tone(330, 1.4, { type: "sawtooth", slideTo: 150, gain: 0.025, attack: 0.2 })
    tone(247, 1.4, { type: "sawtooth", slideTo: 110, gain: 0.02, attack: 0.2 })
  },
  murmurSynth(dur = 2) {
    burst(dur, { freq: 500, q: 0.7, gain: 0.09, attack: 0.6 })
  },
  airhornSynth() {
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

/* ───────────────────── Speech ─────────────────────
 * Every spoken line is a pre-rendered clip (public/voice, made with an open neural voice) so it
 * sounds the same on every device. Only if a clip is missing do we fall back to the browser's own
 * voice, which we now pick carefully and read with per-sentence energy.
 */

export type VoiceName = "rex" | "tony" | "biff" | "nigel" | "pa" | "robot" | "cat"

/** How each character sounds when the browser's own voice has to stand in. */
const FALLBACK: Record<VoiceName, { gender: "male" | "female"; hype: boolean; rate: number; pitch: number }> = {
  rex: { gender: "male", hype: true, rate: 1.2, pitch: 1.1 },
  tony: { gender: "male", hype: true, rate: 1.15, pitch: 0.95 },
  biff: { gender: "male", hype: true, rate: 1.1, pitch: 1.0 },
  nigel: { gender: "male", hype: false, rate: 1.0, pitch: 0.85 },
  pa: { gender: "female", hype: false, rate: 0.92, pitch: 1.0 },
  robot: { gender: "female", hype: false, rate: 0.95, pitch: 1.05 },
  cat: { gender: "female", hype: false, rate: 0.85, pitch: 1.0 },
}

function fnv1a(str: string): string {
  let h = 0x811c9dc5
  for (const b of new TextEncoder().encode(str)) {
    h ^= b
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(16).padStart(8, "0")
}
const clipId = (voice: VoiceName, text: string) => fnv1a(`${voice}|${text}`)

const clipCache = new Map<string, Promise<AudioBuffer | null>>()
function loadClip(id: string): Promise<AudioBuffer | null> {
  let p = clipCache.get(id)
  if (!p) {
    p = (async () => {
      const ctx = audioCtx()
      if (!ctx) { clipCache.delete(id); return null }
      try {
        const r = await fetch(`/voice/${id}.mp3`)
        if (!r.ok) return null
        return await ctx.decodeAudioData(await r.arrayBuffer())
      } catch { return null }
    })()
    clipCache.set(id, p)
  }
  return p
}

/** Fetch clips ahead of time so the first reaction is instant. */
export function preloadSpeech(voice: VoiceName, texts: string[]) {
  for (const t of texts) { const id = clipId(voice, t); if (CLIP_IDS.has(id)) void loadClip(id) }
}

export const speechAvailable = () => typeof window !== "undefined" && "speechSynthesis" in window

/* Browser-voice fallback ------------------------------------------------ */

const MALE = /\b(guy|davis|jason|tony|christopher|eric|roger|steffan|ryan|mark|david|daniel|alex|fred|aaron|reed|rocko|gordon|arthur|oliver|thomas|james|george|lewis|male)\b/i
const FEMALE = /\b(aria|jenny|michelle|sara|ana|zira|samantha|karen|moira|tessa|allison|ava|joanna|kendra|kimberly|salli|nicole|emma|libby|sonia|susan|hazel|female|victoria)\b/i
const NOVELTY = /(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|zarvox|wobble|deranged|hysterical|eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley)/i

function scoreVoice(v: SpeechSynthesisVoice, gender: "male" | "female"): number {
  let sc = 0
  const n = v.name
  if (!v.lang.toLowerCase().startsWith("en")) return -1000
  if (NOVELTY.test(n)) sc -= 300
  if (/natural|neural|online|premium|enhanced|siri/i.test(n)) sc += 120
  if (/google/i.test(n)) sc += 40
  if (v.lang.toLowerCase().replace("_", "-") === "en-us") sc += 25
  else if (v.lang.toLowerCase().startsWith("en-gb")) sc += 5
  const isM = MALE.test(n), isF = FEMALE.test(n)
  if (gender === "male") sc += isM ? 60 : isF ? -60 : 0
  else sc += isF ? 60 : isM ? -60 : 0
  if (v.localService === false) sc += 10 // network voices are usually the better ones
  return sc
}

let voiceListReady: Promise<SpeechSynthesisVoice[]> | null = null
function voicesReady(): Promise<SpeechSynthesisVoice[]> {
  if (!voiceListReady) {
    voiceListReady = new Promise((resolve) => {
      if (!speechAvailable()) return resolve([])
      const have = window.speechSynthesis.getVoices()
      if (have.length) return resolve(have)
      const done = () => resolve(window.speechSynthesis.getVoices())
      window.speechSynthesis.addEventListener?.("voiceschanged", done, { once: true })
      setTimeout(done, 1500)
    })
  }
  return voiceListReady
}

/** Split into sentences; an ALL-CAPS sentence ("WAIT!") is delivered slower and harder. */
function chunks(text: string): string[] {
  return text.replace(/\.\.\./g, "…").split(/(?<=[.!?…])\s+/).map((c) => c.trim()).filter(Boolean)
}

let gen = 0
let curSource: AudioBufferSourceNode | null = null

function speakBrowser(text: string, voice: VoiceName, volume: number, myGen: number): Promise<void> {
  return new Promise((resolve) => {
    if (!speechAvailable()) return resolve()
    void voicesReady().then(async (all) => {
      const f = FALLBACK[voice]
      const best = all.slice().sort((a, b) => scoreVoice(b, f.gender) - scoreVoice(a, f.gender))[0]
      for (const part of chunks(text)) {
        if (myGen !== gen) return resolve()
        const caps = /[A-Z]{3,}/.test(part) && part === part.toUpperCase()
        const bang = part.endsWith("!"), q = part.endsWith("?")
        const u = new SpeechSynthesisUtterance(caps ? part.toLowerCase() : part)
        if (best) u.voice = best
        const jitter = f.hype ? (Math.random() - 0.5) * 0.12 : 0
        u.rate = Math.min(1.5, f.rate * (f.hype && bang ? 1.1 : 1) * (caps ? 0.9 : 1))
        u.pitch = Math.min(2, f.pitch * (f.hype ? (bang ? 1.16 : q ? 1.08 : 1) + jitter : 1) * (caps ? 1.1 : 1))
        u.volume = volume
        await new Promise<void>((done) => {
          u.onend = () => done()
          u.onerror = () => done()
          try { window.speechSynthesis.speak(u) } catch { done() }
          setTimeout(done, 3500 + part.length * 110)
        })
        if (/…$/.test(part)) await new Promise((r) => setTimeout(r, 260))
      }
      resolve()
    })
  })
}

/**
 * Say a line as a character. Plays the pre-rendered clip when there is one, otherwise falls back to
 * the browser's voice. Resolves when finished. Does nothing before audio is unlocked or with ?s=0.
 */
export async function speak(text: string, { voice = "robot", volume = 1 }: { voice?: VoiceName; volume?: number } = {}): Promise<void> {
  const ctx = audioCtx()
  if (!ctx) return
  const myGen = gen
  const id = clipId(voice, text)
  if (CLIP_IDS.has(id)) {
    const buf = await loadClip(id)
    if (myGen !== gen) return
    if (buf) {
      await new Promise<void>((resolve) => {
        const src = ctx.createBufferSource()
        src.buffer = buf
        const g = ctx.createGain()
        g.gain.value = volume
        src.connect(g).connect(ctx.destination)
        curSource = src
        src.onended = () => { if (curSource === src) curSource = null; resolve() }
        src.start()
      })
      return
    }
  }
  await speakBrowser(text, voice, volume, myGen)
}

export function stopSpeaking() {
  gen++
  try { curSource?.stop() } catch { /* already stopped */ }
  curSource = null
  try { if (speechAvailable()) window.speechSynthesis.cancel() } catch { /* ignore */ }
}
