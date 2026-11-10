"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Medal, Settings, Trophy, Wifi, WifiOff, X } from "lucide-react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { unlockAudio } from "@/lib/sfx"
import { playVoice, playSfx, preloadSfx, preloadVoices, stopAllAudio, type VoiceName } from "@/lib/fx"
import { allClockPieces, clockSequence, timeLabel, type ClockKind } from "@/lib/clock-words"
import { ALL_LINES, BRENDA, CHEER, CLOCK, COACH, GARY, TYLER, WIFI, type L } from "./lines"

/* ───────────── Cast ───────────── */

type Who = "coach" | "cheer" | "clock" | "tyler" | "gary" | "brenda" | "wifi"
const CAST: Record<Who, { name: string; role: string; color: string; init: string }> = {
  coach: { name: "Coach", role: "Your Coach", color: "#2f9e6b", init: "C" },
  cheer: { name: "Cheerleader", role: "Team Spirit", color: "#e0529c", init: "T" },
  clock: { name: "The Clock", role: "Time", color: "#5b6677", init: "⏱" },
  tyler: { name: "Tyler", role: "Intern", color: "#4f7fdc", init: "Ty" },
  gary: { name: "Gary", role: "Accounting", color: "#a77a2a", init: "G" },
  brenda: { name: "Brenda", role: "Progress", color: "#8b5cf6", init: "B" },
  wifi: { name: "Wi-Fi", role: "Connection", color: "#0e9bb5", init: "Wi" },
}
const WHO_OF: Record<string, Who> = { coach: "coach", coachw: "coach", cheer: "cheer", clock: "clock", tyler: "tyler", tylerw: "tyler", gary: "gary", brenda: "brenda", wifi: "wifi" }

type Horn = "small" | "stadium" | "buzzer" | "fog" | "vuvuzela" | "train" | "fanfare"
const HORN: Record<Horn, { n: string; g: number }> = {
  small: { n: "horn-small", g: 0.5 },
  stadium: { n: "horn-stadium", g: 0.55 },
  buzzer: { n: "buzzer", g: 0.45 },
  fog: { n: "fog-1", g: 0.6 },
  vuvuzela: { n: "vuvuzela", g: 0.3 },
  train: { n: "train", g: 0.4 },
  fanfare: { n: "fanfare", g: 0.7 },
}

const ACH = [
  { id: "open", name: "Opened the App", tier: "Bronze", tone: "#b4783a" },
  { id: "timer", name: "Looked at the Timer", tier: "Bronze", tone: "#b4783a" },
  { id: "exist", name: "Existed", tier: "Silver", tone: "#8a94a3" },
  { id: "thought", name: "Thought About It", tier: "Gold (very rare)", tone: "#d4a017" },
  { id: "hover", name: "Hovered Aggressively", tier: "Silver", tone: "#8a94a3" },
  { id: "left", name: "Left. Came Back. We Noticed.", tier: "Gold", tone: "#d4a017" },
  { id: "prod", name: "Total Productivity: 3.2%", tier: "Platinum", tone: "#5b6fb0" },
] as const
type AchId = (typeof ACH)[number]["id"]

const CREDITS: [string, string][] = [
  ["The Coach", "as himself, barely"],
  ["The Cheerleader", "as herself, loudly"],
  ["The Stern Clock", "as the time"],
  ["Tyler", "as the intern (day three)"],
  ["Gary", "as someone who emailed you"],
  ["Brenda", "as 99%"],
  ["The Wi-Fi", "as unavailable"],
  ["The Fog Horn", "as the fog horn"],
]

const mmss = (sec: number) => {
  const s = Math.max(0, Math.round(sec))
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]

/** The timer is a lie. This is the lie. */
function timerText(t: number): string {
  if (t >= 464) return "25:00"
  if (t >= 430) return "00:00"
  if (t < 90) return mmss(1500 - t)
  if (t < 210) {
    const rem = 1410 - (t - 90) * 0.45
    switch (Math.floor((t - 90) / 6) % 6) {
      case 0: return mmss(rem)
      case 1: return "23 minutes, give or take a Tuesday"
      case 2: return "about 22 min (ish)"
      case 3: return `${mmss(rem)} (probably)`
      case 4: return `${Math.round(rem).toLocaleString()} seconds remaining (rounded)`
      default: return "a decent amount of time"
    }
  }
  if (t < 360) {
    const k = Math.floor(t / 1.3)
    const wob = [1022, 1021, 1024, 1019, 1180, 993, 1011, -192, 1011, 1010][k % 10]
    const odd = ["soon", "TIME", "11:11", "—", "any minute now"]
    if (k % 17 === 0) return odd[(k / 17) % odd.length | 0]
    return wob < 0 ? `-${mmss(-wob)}` : mmss(wob)
  }
  return mmss(760 * Math.pow(1 - (t - 360) / 70, 1.4))
}
function pctAt(t: number): number {
  if (t >= 464) return 0
  if (t >= 430) return 100
  if (t < 90) return (t / 90) * 18
  if (t < 210) return 18 + ((t - 90) / 120) * 79
  if (t < 250) return 97 + ((t - 210) / 40) * 2
  if (t < 388) return 99
  return 99.9
}

interface Bubble { id: number; who: Who; text: string }
interface Job { who: Who | null; caption: string; run: () => Promise<void> }

export default function FocusScreen() {
  const [phase, setPhase] = useState<"splash" | "intro" | "app" | "credits" | "end">("splash")
  const [introLine, setIntroLine] = useState("")
  const [running, setRunning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [t, setT] = useState(0)
  const [task, setTask] = useState("Write the thing.")
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [speaking, setSpeaking] = useState<Who[]>([])
  const [toasts, setToasts] = useState<{ id: number; text: string; sub: string }[]>([])
  const [unlocked, setUnlocked] = useState<Partial<Record<AchId, number>>>({})
  const [panel, setPanel] = useState<null | "settings" | "trophies">(null)
  const [vol, setVol] = useState(7)
  const [notif, setNotif] = useState("On")
  const [intensity, setIntensity] = useState("Low")
  const [dark, setDark] = useState(false)
  const [wifiOk, setWifiOk] = useState(true)
  const [timer2, setTimer2] = useState(false)
  const [btn2, setBtn2] = useState(false)
  const [resting, setResting] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [deleteAsk, setDeleteAsk] = useState(false)
  const [streakGlitch, setStreakGlitch] = useState(false)
  const [finalLine, setFinalLine] = useState(false)

  // Mutable engine state (the timeline must not depend on React renders).
  const S = useRef({
    phase: "splash" as string, running: false, paused: false, t: 0, vol: 7, chaos: false,
    fired: new Set<number>(), lastInput: 0, idleFired: new Set<number>(), cool: {} as Record<string, number>,
    clicks: [] as { k: string; at: number }[], hoverEnters: 0, garyMode: false, nextGary: 0, bid: 0, deleteTries: 0,
    queue: [] as Job[], busy: false, lastMouse: 0, keys: 0, afterCredits: 0, appShownAt: 0, exiting: false,
  })
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const act = useRef<{ start: () => void; pause: () => void; unlock: (id: AchId) => void } | null>(null)

  const vm = () => (S.current.vol === 0 ? 0 : S.current.vol / 7)

  /* ── voices & horns ── */
  const horn = useCallback(async (h: Horn, o: { force?: boolean; gain?: number } = {}): Promise<number> => {
    const g = o.force ? 1 : vm()
    if (g === 0) return 0.6
    return playSfx(HORN[h].n, { gain: HORN[h].g * g * (o.gain ?? 1) })
  }, [])
  const voice = useCallback(async (l: L, o: { force?: boolean; gain?: number; pan?: number; maxDur?: number } = {}) => {
    const g = o.force ? 1 : vm()
    const d = await playVoice(l.voice as VoiceName, l.text, { gain: 0.95 * g * (o.gain ?? 1), pan: o.pan, maxDur: o.maxDur })
    if (!d) await sleep(Math.min(5000, l.text.length * 55))
  }, [])

  const runJob = useCallback(async (j: Job) => {
    const id = ++S.current.bid
    if (j.who) {
      const who = j.who
      setBubbles((b) => [...b.slice(-5), { id, who, text: j.caption }])
      setSpeaking((s) => [...s, who])
    }
    const t0 = performance.now()
    try { await j.run() } catch { /* ignore */ }
    if (j.who) {
      const who = j.who
      setSpeaking((s) => { const i = s.indexOf(who); return i < 0 ? s : [...s.slice(0, i), ...s.slice(i + 1)] })
      const left = Math.max(1200, 2200 - (performance.now() - t0))
      setTimeout(() => setBubbles((b) => b.filter((x) => x.id !== id)), left)
    }
  }, [])
  const pump = useCallback(async () => {
    if (S.current.busy) return
    S.current.busy = true
    while (S.current.queue.length) await runJob(S.current.queue.shift()!)
    S.current.busy = false
  }, [runJob])
  const enqueue = useCallback((j: Job, urgent = false) => {
    if (S.current.exiting) return
    if (S.current.chaos) { void runJob(j); return }
    if (urgent) S.current.queue.unshift(j); else S.current.queue.push(j)
    void pump()
  }, [pump, runJob])

  const say = useCallback((l: L, o: { horn?: Horn; urgent?: boolean; pre?: number; force?: boolean; maxDur?: number; pan?: number; hornGain?: number } = {}) => {
    const who = WHO_OF[l.voice]
    const pan = o.pan ?? (S.current.chaos ? (Math.random() - 0.5) * 1.2 : 0)
    enqueue({
      who, caption: l.text,
      run: async () => {
        if (o.pre) await sleep(o.pre)
        if (o.horn) { const d = await horn(o.horn, { force: o.force, gain: o.hornGain }); await sleep(Math.min(1500, d * 450)) }
        await voice(l, { force: o.force, pan, maxDur: o.maxDur })
      },
    }, o.urgent)
  }, [enqueue, horn, voice])

  const clockSay = useCallback((kind: ClockKind, o: { horn?: Horn; urgent?: boolean; pre?: number } = {}) => {
    const seq = clockSequence(kind, new Date())
    enqueue({
      who: "clock", caption: seq.caption,
      run: async () => {
        if (o.pre) await sleep(o.pre)
        if (o.horn) { const d = await horn(o.horn); await sleep(Math.min(900, d * 400)) }
        for (const p of seq.parts) await voice({ voice: "clock", text: p }, { gain: 1 })
      },
    }, o.urgent)
  }, [enqueue, horn, voice])

  const fogThen = useCallback((after?: L) => {
    enqueue({
      who: null, caption: "",
      run: async () => {
        const d = await horn("fog")
        await sleep(Math.max(2400, d * 700)) // silence is the setup, and the payoff
      },
    })
    if (after) say(after, { pre: 900 })
  }, [enqueue, horn, say])

  const cool = (k: string, ms: number) => { const n = performance.now(); if (n - (S.current.cool[k] ?? -1e9) < ms) return false; S.current.cool[k] = n; return true }

  const unlock = useCallback((id: AchId) => {
    setUnlocked((u) => {
      if (u[id]) return u
      const a = ACH.find((x) => x.id === id)!
      const sub = id === "prod" ? "Down from 3.3%. Not a trend, but we're watching." : `${a.tier} achievement`
      const tid = Date.now() + Math.random()
      setToasts((ts) => [...ts, { id: tid, text: a.name, sub }])
      setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== tid)), 4800)
      if (vm() > 0) void playSfx("ding", { gain: 0.5 * vm() })
      return { ...u, [id]: Date.now() }
    })
  }, [])

  /* ── the timeline: a minute-by-minute disaster ── */
  const timelineRef = useRef<{ at: number; run: () => void }[]>([])
  timelineRef.current = [
    // ACT 1: This Is Fine
    { at: 6, run: () => say(COACH.deep) },
    { at: 18, run: () => say(Date.now() - S.current.lastMouse < 12000 ? CHEER.mouse[0] : CHEER.here, { horn: "small" }) },
    { at: 30, run: () => say(COACH.gotThis) },
    { at: 40, run: () => fogThen() },
    { at: 46, run: () => say(COACH.working) },
    { at: 62, run: () => say(CHEER.blink, { horn: "small" }) },
    { at: 76, run: () => say(COACH.sitting) },
    // ACT 2: Wait.
    { at: 92, run: () => { setTimer2(true); say(TYLER.timer2) } },
    { at: 104, run: () => clockSay("isSec") },
    { at: 114, run: () => say(COACH.clockThink) },
    { at: 124, run: () => say(GARY.thought, { horn: "buzzer" }) },
    { at: 138, run: () => say(BRENDA.mid) },
    { at: 148, run: () => { say(CHEER.opened, { horn: "stadium" }); say(CHEER.opened2) } },
    { at: 160, run: () => { setBtn2(true); say(TYLER.startStop) } },
    { at: 168, run: () => { say(COACH.askClock); clockSay("is") } },
    { at: 178, run: () => say(COACH.narrate) },
    { at: 188, run: () => clockSay("was") },
    { at: 194, run: () => say(GARY.goodTime, { horn: "buzzer" }) },
    { at: 200, run: () => say(BRENDA.ninetyNine) },
    { at: 206, run: () => say(COACH.overInvolved) },
    // ACT 3: Everyone, Please.
    { at: 212, run: () => { setStreakGlitch(true); setTimeout(() => setStreakGlitch(false), 9000); say(COACH.everyone); say(GARY.lastEmail, { horn: "buzzer" }); say(TYLER.deleted); say(CHEER.chaos, { horn: "small" }); clockSay("is") } },
    { at: 224, run: () => { say(CHEER.missed); say(GARY.followUp, { horn: "buzzer" }) } },
    { at: 232, run: () => say(BRENDA.notTime) },
    { at: 236, run: () => clockSay("isSec") },
    { at: 241, run: () => say(BRENDA.notTime2) },
    { at: 245, run: () => clockSay("now") },
    { at: 250, run: () => { say(WIFI.lost, { maxDur: 1.15 }); setTimeout(() => { void playSfx("wifi-drop", { gain: 0.5 * vm() }); setWifiOk(false) }, 1200); say(TYLER.mistakes) } },
    { at: 258, run: () => say(WIFI.partly) },
    { at: 266, run: () => { void horn("train") } }, // ten seconds, for nothing, never mentioned
    { at: 282, run: () => { say(GARY.loop, { horn: "buzzer" }); say(CHEER.here, { horn: "vuvuzela" }) } },
    { at: 292, run: () => say(BRENDA.cant) },
    { at: 298, run: () => say(TYLER.whisper) },
    { at: 306, run: () => { say(WIFI.break); say(TYLER.extra[0]) } },
    { at: 316, run: () => { say(GARY.brief, { horn: "buzzer" }); say(GARY.ramble, { pre: 1200 }) } },
    { at: 332, run: () => { setResting(true); say(COACH.rest) } },
    { at: 342, run: () => say(BRENDA.stopWatching) },
    { at: 352, run: () => { say(BRENDA.going); clockSay("is") } },
    // ACT 4: Great Work Today.
    { at: 364, run: () => { setWifiOk(true); say(WIFI.back) } },
    { at: 368, run: () => say(COACH.giveUp) },
    { at: 378, run: () => say(COACH.dayOff) },
    { at: 390, run: () => say(BRENDA.point9) },
    { at: 400, run: () => say(COACH.knee) },
    { at: 412, run: () => say(TYLER.extra[3]) },
    { at: 420, run: () => say(COACH.almost) },
    { at: 430, run: () => { setConfetti(true); setTimeout(() => setConfetti(false), 7000); setResting(false); void horn("fanfare"); setTimeout(() => void horn("vuvuzela"), 900); say(CHEER.done, { horn: "stadium" }) } },
    { at: 438, run: () => say(BRENDA.hundred) },
    { at: 444, run: () => say(CLOCK.done, { urgent: true }) },
    { at: 451, run: () => say(COACH.greatWork) },
    { at: 458, run: () => setTask("Plan to write the thing.") },
    { at: 464, run: () => setTask("Plan to plan to write the thing.") },
    { at: 470, run: () => { S.current.running = false; setRunning(false); S.current.phase = "credits"; setPhase("credits") } },
  ]

  /* ── the engine: clock, timeline, idle watcher ── */
  useEffect(() => {
    const iv = setInterval(() => {
      const s = S.current
      if (s.phase !== "app" && s.phase !== "credits") return
      if (s.running && !s.paused) {
        s.t += 0.25
        s.chaos = s.t >= 210 && s.t < 360
        for (const ev of timelineRef.current) if (s.t >= ev.at && !s.fired.has(ev.at)) { s.fired.add(ev.at); ev.run() }
        setT(s.t)
      }
    }, 250)
    const idle = setInterval(() => {
      const s = S.current
      if (s.phase !== "app" || (s.running && !s.paused)) return
      const secs = (performance.now() - s.lastInput) / 1000
      const stage = (n: number, fn: () => void) => { if (secs >= n && !s.idleFired.has(n)) { s.idleFired.add(n); fn() } }
      stage(10, () => say(pick(COACH.idle10)))
      stage(30, () => say(pick(CHEER.idle30), { horn: "small" }))
      stage(50, () => { if (Math.random() < 0.4) unlock("thought") })
      stage(120, () => say(CLOCK.twoMinutes))
      stage(180, () => say(CLOCK.threeMinutes))
    }, 1000)
    const gary = setInterval(() => {
      const s = S.current
      if (s.garyMode && s.running && !s.paused && s.t > s.nextGary) { s.nextGary = s.t + 24; say(pick([GARY.circling, GARY.followUp, GARY.loop]), { horn: "buzzer" }) }
    }, 1000)
    return () => { clearInterval(iv); clearInterval(idle); clearInterval(gary) }
  }, [say, clockSay, unlock])
  // "It has been one minute" reads a fixed line (the clip), not the composed clock
  useEffect(() => {
    const id = setInterval(() => {
      const s = S.current
      if (s.phase !== "app" || (s.running && !s.paused)) return
      const secs = (performance.now() - s.lastInput) / 1000
      if (secs >= 60 && !s.idleFired.has(60.5)) { s.idleFired.add(60.5); say(CLOCK.oneMinute) }
    }, 1000)
    return () => clearInterval(id)
  }, [say])

  /* ── session control ── */
  const startSession = useCallback(() => {
    const s = S.current
    s.running = true; s.paused = false; s.t = 0; s.fired = new Set(); s.chaos = false
    setRunning(true); setPaused(false); setT(0); setTask("Write the thing."); setTimer2(false); setBtn2(false); setResting(false); setWifiOk(true)
    say(pick(CHEER.start), { horn: "small", urgent: true })
    say(pick(COACH.start))
    setTimeout(() => unlock("prod"), 90000)
  }, [say, unlock])
  const togglePause = useCallback(() => {
    const s = S.current
    if (!s.running) return
    s.paused = !s.paused
    setPaused(s.paused)
    if (s.paused) { clockSay("distract", { horn: "buzzer", urgent: true }) } else say(COACH.resume[0])
  }, [clockSay, say])
  act.current = { start: startSession, pause: togglePause, unlock }

  const onEnter = () => {
    unlockAudio()
    S.current.phase = "intro"; setPhase("intro")
    preloadSfx(["horn-small", "horn-stadium", "buzzer", "fog-1", "fog-far", "vuvuzela", "train", "fanfare", "ding", "wifi-drop", "pop"])
    preloadVoices(ALL_LINES.map((l) => [l.voice as VoiceName, l.text] as [VoiceName, string]))
    preloadVoices(allClockPieces().map((p) => ["clock" as VoiceName, p] as [VoiceName, string]))
    const d = new Date()
    const seq = clockSequence("splash", d)
    setIntroLine(seq.caption)
    void (async () => {
      await sleep(900)
      for (const p of seq.parts) await playVoice("clock", p, { gain: 1.0 * (S.current.vol / 7) })
      await sleep(1500)
      S.current.phase = "app"; S.current.appShownAt = performance.now(); S.current.lastInput = performance.now()
      setPhase("app")
      unlock("open")
      setTimeout(() => unlock("timer"), 9000)
      setTimeout(() => unlock("exist"), 22000)
    })()
  }

  /* ── the triggers ── */
  useEffect(() => {
    const touch = () => { S.current.lastInput = performance.now(); S.current.idleFired = new Set() }
    const onDown = (e: PointerEvent) => {
      const s = S.current
      if (s.phase !== "app") return
      touch()
      const el = e.target as HTMLElement
      const btn = el.closest("[data-btn]") as HTMLElement | null
      if (btn) {
        const k = btn.dataset.btn!
        const now = performance.now()
        s.clicks = [...s.clicks.filter((c) => now - c.at < 4000), { k, at: now }]
        if (s.clicks.filter((c) => c.k === k).length >= 5 && cool("bug", 20000)) { s.clicks = []; say(TYLER.bug, { urgent: true }) }
      } else if (!el.closest("button, a, input, select, [data-ui]") && cool("blank", 6000)) {
        say(pick(COACH.clickBlank), { urgent: true })
      }
    }
    const onKey = (e: KeyboardEvent) => {
      const s = S.current
      if (s.phase !== "app" || e.ctrlKey || e.metaKey || e.altKey || e.key === "Escape" || e.key === "Tab" || e.key.toLowerCase() === "q") return
      if ((e.target as HTMLElement)?.tagName === "INPUT") return
      touch()
      s.keys++
      if (s.keys === 1 && cool("type", 45000)) fogThen(pick(COACH.typeAfterFog))
      else if (s.running && s.keys % 7 === 0 && cool("missed", 60000)) say(CHEER.missed)
    }
    const onMove = () => {
      const s = S.current
      if (s.phase !== "app") return
      touch()
      const now = Date.now()
      const was = s.lastMouse
      s.lastMouse = now
      if (now - was > 9000 && s.running && s.t < 200 && cool("mouse", 40000)) say(pick(CHEER.mouse), { horn: "small" })
    }
    const onVis = () => {
      const s = S.current
      if (s.phase !== "app") return
      if (document.visibilityState === "hidden") {
        say(pick(WIFI.saved), { urgent: true })
        setTimeout(() => say(pick(WIFI.someone), { pre: 1400 }), 400)
        s.cool.away = performance.now()
      } else if (s.cool.away) {
        s.cool.away = 0
        say(pick(COACH.back), { urgent: true })
        unlock("left")
      }
    }
    document.addEventListener("pointerdown", onDown, true)
    window.addEventListener("keydown", onKey)
    window.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("visibilitychange", onVis)
    return () => {
      document.removeEventListener("pointerdown", onDown, true)
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [say, fogThen, unlock])

  // Credits roll, the last faint horn, and the line that explains nothing.
  useEffect(() => {
    if (phase !== "credits") return
    let dead = false
    void (async () => {
      await sleep(30000)
      if (dead) return
      setPhase("end"); S.current.phase = "end"
      await sleep(3500)
      if (dead) return
      if (vm() > 0) void playSfx("fog-far", { gain: 0.22 * vm() })
      await sleep(4200)
      if (dead) return
      setFinalLine(true)
      await sleep(22000)
      if (dead) return
      // and we begin again
      const s = S.current
      s.phase = "app"; s.running = false; s.paused = false; s.t = 0; s.fired = new Set(); s.idleFired = new Set(); s.lastInput = performance.now(); s.chaos = false; s.queue = []
      setFinalLine(false); setPhase("app"); setRunning(false); setPaused(false); setT(0); setTask("Write the thing."); setTimer2(false); setBtn2(false); setResting(false); setWifiOk(true)
    })()
    return () => { dead = true }
  }, [phase])

  useEffect(() => () => { if (!S.current.exiting) stopAllAudio() }, [])

  const onExit = useCallback(() => {
    S.current.exiting = true
    stopAllAudio()
    const seq = clockSequence("is", new Date())
    void (async () => { for (const p of seq.parts) await playVoice("clock", p, { gain: 1 }) })()
  }, [])
  const exitMessage = useCallback(() => `It is ${timeLabel(new Date())}.`, [])

  /* ── render ── */
  const displayT = timerText(t)
  const longTimer = displayT.length > 7
  const pct = pctAt(t)
  const pctLabel = pct === 99.9 ? "99.9" : String(Math.round(pct))
  const bg = dark ? "bg-[#14161a] text-zinc-100" : "bg-[#f6f4ee] text-zinc-900"
  const sub = dark ? "text-zinc-500" : "text-zinc-400"
  const card = dark ? "bg-[#1c1f25] border-zinc-700" : "bg-white border-zinc-200"
  const btnLabel = !running ? "Start Focus Session" : btn2 ? "Start / Stop" : paused ? "Resume Session" : "Pause Session"

  return (
    <FullscreenPrank exitMessage={exitMessage} onExit={onExit} className={`${bg} font-sans`}>
      {/* SPLASH */}
      {phase === "splash" && (
        <div className="grid h-full place-items-center bg-[#f6f4ee] px-5 text-zinc-900">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_20px_60px_rgba(40,50,40,.15)]">
            <div className="flex items-center gap-3 border-b border-zinc-100 bg-[#eaf4ee] px-5 py-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white text-center leading-none shadow-sm">
                <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#2f9e6b]">{new Date().toLocaleDateString("en-US", { month: "short" })}</p><p className="text-lg font-semibold">{new Date().getDate()}</p></div>
              </div>
              <div><p className="text-[11px] font-semibold uppercase tracking-widest text-[#2f9e6b]">FOCUS™</p><p className="text-sm font-medium">Appointment</p></div>
            </div>
            <div className="px-6 py-6">
              <p className="text-lg font-semibold leading-snug">Your focus session is ready.</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">Please click to enter Focus Mode. Focus Mode is mandatory.</p>
              <button onClick={onEnter} className="mt-6 w-full rounded-xl bg-[#2f9e6b] px-4 py-3 text-[15px] font-semibold text-white transition hover:bg-[#278a5c]">Enter Focus Mode</button>
            </div>
          </div>
        </div>
      )}

      {/* THE FLAT LINE */}
      {phase === "intro" && (
        <div className="grid h-full place-items-center bg-[#f6f4ee]">
          <p key={introLine} className="text-[clamp(22px,3.4vw,38px)] font-light tracking-tight text-zinc-700 [animation:fc-in_.6s_ease]">{introLine}</p>
        </div>
      )}

      {/* THE APP */}
      {(phase === "app" || phase === "credits" || phase === "end") && (
        <div className={`relative h-full w-full ${phase === "app" ? "" : "pointer-events-none"}`}>
          <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#2f9e6b] text-[11px] font-bold text-white">F</span>
              <span className="text-[15px] font-semibold tracking-tight">FOCUS<sup className="text-[9px]">™</sup></span>
            </div>
            <div className="hidden items-center gap-1.5 md:flex" aria-label="In this session">
              {(Object.keys(CAST) as Who[]).map((w) => (
                <div key={w} title={`${CAST[w].name} · ${CAST[w].role}`} className="relative">
                  <div className={`grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold text-white transition-all duration-300 ${speaking.includes(w) ? "scale-110 ring-2 ring-offset-2" : "opacity-80"} ${dark ? "ring-offset-[#14161a]" : "ring-offset-[#f6f4ee]"}`} style={{ background: CAST[w].color, "--tw-ring-color": CAST[w].color, transform: w === "coach" && resting ? "rotate(90deg)" : undefined } as React.CSSProperties}>{CAST[w].init}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className={`mr-1 ${wifiOk ? sub : "text-red-500"}`} aria-label={wifiOk ? "Connected" : "Connection lost"}>{wifiOk ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}</span>
              <button data-btn="trophies" onClick={() => setPanel(panel === "trophies" ? null : "trophies")} aria-label="Achievements" className={`rounded-lg p-2 ${dark ? "hover:bg-white/10" : "hover:bg-black/5"}`}><Trophy className="h-[18px] w-[18px]" /></button>
              <button data-btn="settings" onClick={() => setPanel(panel === "settings" ? null : "settings")} aria-label="Settings" className={`rounded-lg p-2 ${dark ? "hover:bg-white/10" : "hover:bg-black/5"}`}><Settings className="h-[18px] w-[18px]" /></button>
            </div>
          </header>

          <main className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${sub}`}>Current task</p>
            <h1 key={task} className="mt-3 text-[clamp(26px,4.4vw,46px)] font-medium tracking-tight [animation:fc-in_.5s_ease]">{task}</h1>
            <p className={`mt-1 text-[11px] ${sub}`}>Due: Previously.</p>

            <div data-ui onPointerEnter={() => setTimeout(() => unlock("timer"), 1500)} className={`mt-8 w-full select-none font-extralight tracking-tight tabular-nums ${longTimer ? "text-[clamp(26px,5vw,56px)] leading-tight" : "text-[clamp(84px,19vw,210px)] leading-none"}`}>{displayT}</div>

            {timer2 && <p className={`mt-3 text-sm ${sub}`}>Timer 2 <span className="opacity-70">(for Timer 1)</span>: {mmss(Math.max(0, 1500 - t * 0.97))}</p>}

            {running && (
              <div data-ui className="mt-5 w-full max-w-md">
                <div className={`h-1.5 w-full overflow-hidden rounded-full ${dark ? "bg-zinc-700" : "bg-zinc-200"}`}><div className="h-full rounded-full bg-[#8b5cf6] transition-all duration-700" style={{ width: `${pct}%` }} /></div>
                <p className={`mt-1.5 text-[11px] ${sub}`}>Progress: {pctLabel}%</p>
              </div>
            )}

            <button
              data-btn="start"
              onClick={() => (running ? act.current?.pause() : act.current?.start())}
              onPointerEnter={() => {
                const s = S.current
                s.hoverEnters++
                if (s.hoverEnters >= 8) act.current?.unlock("hover")
                if (!s.running) { clearTimeout(hoverTimer.current); hoverTimer.current = setTimeout(() => { if (!S.current.running && cool("hover", 25000)) say(pick(COACH.hover), { urgent: true }) }, 3000) }
              }}
              onPointerLeave={() => clearTimeout(hoverTimer.current)}
              className={`mt-8 rounded-2xl px-9 py-4 text-[17px] font-semibold shadow-sm transition ${running ? (dark ? "border border-zinc-600 bg-transparent text-zinc-100 hover:bg-white/5" : "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50") : "bg-[#34a853] text-white hover:bg-[#2e964a]"}`}
            >
              {btnLabel}
            </button>

            <footer className={`absolute bottom-5 left-0 right-0 text-center text-[12px] ${sub}`}>
              <p>{streakGlitch ? "Streak: days." : "Streak: 0 days."} We believe in you.</p>
              <p className="text-[10px] opacity-60">(Internal memo: we do not.)</p>
            </footer>
          </main>

          {/* speech bubbles */}
          <div className="pointer-events-none absolute bottom-16 left-3 right-3 z-30 flex flex-col items-end gap-2 sm:bottom-5 sm:left-auto sm:right-5 sm:w-[340px]">
            {bubbles.slice(-5).map((b) => (
              <div key={b.id} className={`flex w-full items-start gap-3 rounded-2xl border px-3.5 py-3 shadow-lg [animation:fc-pop_.25s_ease] ${card}`}>
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: CAST[b.who].color }}>{CAST[b.who].init}</div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: CAST[b.who].color }}>{CAST[b.who].name} <span className={`font-normal normal-case tracking-normal ${sub}`}>· {CAST[b.who].role}</span></p>
                  <p className="mt-0.5 text-[14px] leading-snug">{b.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* achievement toasts */}
          <div className="pointer-events-none absolute left-3 top-16 z-30 flex flex-col gap-2 sm:left-5">
            {toasts.map((ts) => (
              <div key={ts.id} className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 shadow-lg [animation:fc-pop_.25s_ease] ${card}`}>
                <Medal className="h-5 w-5 shrink-0 text-[#d4a017]" />
                <div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#d4a017]">Achievement unlocked</p><p className="text-[13px] font-medium leading-tight">{ts.text}</p><p className={`text-[11px] ${sub}`}>{ts.sub}</p></div>
              </div>
            ))}
          </div>

          {/* panels */}
          {panel && (
            <div data-ui className={`absolute bottom-0 right-0 top-0 z-40 w-full max-w-sm overflow-auto border-l p-5 shadow-2xl ${card}`}>
              <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">{panel === "settings" ? "Settings" : "Achievements"}</h2><button onClick={() => setPanel(null)} aria-label="Close" className="rounded-lg p-1.5 hover:bg-black/5"><X className="h-5 w-5" /></button></div>
              {panel === "settings" ? (
                <div className="space-y-5 text-sm">
                  <label className="block"><span className="font-medium">Volume <span className={sub}>({vol})</span></span>
                    <input type="range" min={0} max={11} value={vol} onChange={(e) => {
                      const v = Number(e.target.value); setVol(v); S.current.vol = v
                      if (v === 0 && cool("niceTry", 4000)) { void horn("small", { force: true }); say(COACH.niceTry, { force: true, urgent: true, pre: 350 }) }
                    }} className="mt-2 w-full accent-[#34a853]" />
                    <span className={`text-[11px] ${sub}`}>Goes up to 11.</span></label>
                  <label className="block"><span className="font-medium">Notifications</span>
                    <select value={notif} onChange={(e) => { const v = e.target.value; setNotif(v); if (v === "Very On") { for (let i = 0; i < 3; i++) setTimeout(() => void horn("small"), i * 220) } else if (v === "Respectfully On") { void horn("buzzer"); say(COACH.notif, { pre: 600, urgent: true }) } }} className={`mt-2 w-full rounded-lg border px-3 py-2 ${dark ? "border-zinc-600 bg-zinc-800" : "border-zinc-300 bg-white"}`}>
                      <option>On</option><option>Very On</option><option>Respectfully On</option></select></label>
                  <label className="block"><span className="font-medium">Focus Intensity</span>
                    <select value={intensity} onChange={(e) => { const v = e.target.value; setIntensity(v); if (v === "Gary") { S.current.garyMode = true; S.current.nextGary = S.current.t + 10; say(GARY.picked, { horn: "buzzer", urgent: true }) } else S.current.garyMode = false }} className={`mt-2 w-full rounded-lg border px-3 py-2 ${dark ? "border-zinc-600 bg-zinc-800" : "border-zinc-300 bg-white"}`}>
                      <option>Low</option><option>Medium</option><option>Gary</option></select></label>
                  <label className="flex items-center justify-between"><span className="font-medium">Dark Mode</span>
                    <input type="checkbox" checked={dark} onChange={(e) => { setDark(e.target.checked); if (e.target.checked) say(COACH.darkMode, { urgent: true }) }} className="h-5 w-5 accent-[#34a853]" /></label>
                  <div className="border-t pt-4"><button onClick={() => setDeleteAsk(true)} className="w-full rounded-lg border border-red-300 px-3 py-2 font-medium text-red-600 hover:bg-red-50">Delete Account</button></div>
                </div>
              ) : (
                <ul className="space-y-2">
                  {ACH.map((a) => (
                    <li key={a.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${unlocked[a.id] ? "" : "opacity-45"} ${dark ? "border-zinc-700" : "border-zinc-200"}`}>
                      <Medal className="h-5 w-5 shrink-0" style={{ color: a.tone }} />
                      <div><p className="text-[13px] font-medium">{a.name}</p><p className={`text-[11px] ${sub}`}>{unlocked[a.id] ? (a.id === "prod" ? "Down from 3.3%. Not a trend, but we're watching." : a.tier) : "Locked"}</p></div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {deleteAsk && (
            <div data-ui className="absolute inset-0 z-50 grid place-items-center bg-black/40 px-5" onClick={() => setDeleteAsk(false)}>
              <div className={`w-full max-w-sm rounded-2xl border p-6 shadow-2xl ${card}`} onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold">Delete account?</h3>
                <p className={`mt-2 text-sm ${sub}`}>Deleting your account is at 99%. Brenda has asked you to stay.</p>
                <div className="mt-5 flex gap-2">
                  <button onClick={() => { setDeleteAsk(false); say(S.current.deleteTries++ ? BRENDA.stay2 : BRENDA.stay, { urgent: true }) }} className="flex-1 rounded-lg bg-[#34a853] px-3 py-2 font-semibold text-white">Stay</button>
                  <button onClick={() => { setDeleteAsk(false); say(S.current.deleteTries++ ? BRENDA.stay2 : BRENDA.stay, { urgent: true }) }} className="flex-1 rounded-lg border border-red-300 px-3 py-2 font-medium text-red-600">Delete anyway</button>
                </div>
              </div>
            </div>
          )}

          {confetti && (
            <div className="pointer-events-none absolute inset-0 z-[35] overflow-hidden" aria-hidden="true">
              {Array.from({ length: 90 }).map((_, i) => (
                <span key={i} className="absolute top-[-20px] block h-3 w-2 rounded-[1px]" style={{ left: `${(i * 37) % 100}%`, background: ["#34a853", "#f4b400", "#e0529c", "#4f7fdc", "#8b5cf6"][i % 5], animation: `fc-fall ${3 + (i % 7) * 0.5}s linear ${(i % 10) * 0.12}s forwards` }} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* THE CREDITS */}
      {(phase === "credits" || phase === "end") && (
        <div className="pointer-events-none absolute inset-0 z-[60] overflow-hidden bg-black text-white">
          {phase === "credits" && (
            <div className="absolute inset-x-0 text-center [animation:fc-roll_30s_linear_forwards]" style={{ top: "100%" }}>
              <p className="text-[clamp(32px,6vw,64px)] font-light tracking-[0.2em]">FOCUS™</p>
              <p className="mt-2 text-sm uppercase tracking-[0.4em] text-white/50">Get things done. Eventually. By someone.</p>
              <div className="mt-24 space-y-10">
                {CREDITS.map(([a, b]) => (
                  <div key={a}><p className="text-[clamp(18px,2.4vw,26px)] font-medium">{a}</p><p className="text-sm text-white/55">{b}</p></div>
                ))}
              </div>
              <p className="mt-32 text-xs uppercase tracking-[0.4em] text-white/35">No productivity was harmed</p>
            </div>
          )}
          {phase === "end" && finalLine && <p className="absolute inset-0 grid place-items-center px-8 text-center text-[clamp(16px,2.2vw,22px)] font-light text-white/80 [animation:fc-in_2s_ease]">That one was for someone else.</p>}
        </div>
      )}

      <style>{`
        @keyframes fc-in { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
        @keyframes fc-pop { from { opacity: 0; transform: translateY(8px) scale(.97) } to { opacity: 1; transform: none } }
        @keyframes fc-roll { from { transform: translateY(0) } to { transform: translateY(-190%) } }
        @keyframes fc-fall { to { transform: translateY(110vh) rotate(720deg); opacity: .9 } }
      `}</style>
    </FullscreenPrank>
  )
}
