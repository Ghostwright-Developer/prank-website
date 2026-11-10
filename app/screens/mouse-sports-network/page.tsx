"use client"

import { useEffect, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { fx, speak, stopSpeaking } from "@/lib/fx"

interface Line { who: 0 | 1; text: string }
type Exchange = Line[]
const A = (text: string): Line => ({ who: 0, text })
const B = (text: string): Line => ({ who: 1, text })
const NAMES = ["BOB DAWSON", "TRACY KOWALSKI"]
const COLORS = ["#38bdf8", "#f472b6"]

const PREGAME: Exchange[] = [
  [A("Good evening, and welcome to the Mouse Sports Network. I'm Bob Dawson."), B("And I'm Tracy Kowalski. Tonight: one human, one desktop, no rules.")],
  [A("The cursor is on the field, Tracy. It has not moved in nine minutes."), B("Classic rope-a-dope. He's letting the screen come to him.")],
  [A("We're hearing the human may have stepped away."), B("Or he's resting. Conserving energy. Sources say he had a big lunch.")],
  [A("Still nothing. We'll go to the replay of nothing."), B("Here's nothing again, in slow motion. Look at that form.")],
  [B("Bob, twenty years in this business, and I have never seen a cursor sit this still."), A("It's a gift, Tracy. Some are born still.")],
  [A("Fun fact: the average person moves a mouse several hundred miles in a lifetime."), B("And this one is clearly saving his.")],
  [A("The desktop looks nervous."), B("Those icons have held their positions since 2019. Tremendous discipline.")],
  [A("Reports of movement out there."), B("Could be wind, Bob. Keep your eyes peeled.")],
  [A("Hour two of the stare-off."), B("Nobody blinks. Well. Except the cursor. It blinks in text boxes.")],
  [B("I want to remind the fans: no cursor has ever left the building."), A("Not yet, Tracy. Not yet.")],
]
const BACK: Exchange = [A("WAIT. WAIT! IS THAT MOVEMENT?!"), B("HE'S BACK! THE HUMAN HAS RETURNED TO THE ARENA!"), A("The crowd is on its FEET, Tracy!")]
const FAST: Exchange[] = [
  [A("Look at that speed! He's FLYING!"), B("Zero to the taskbar in one point two seconds. That's a record!")],
  [B("Did you SEE that flick?"), A("I saw a blur, Tracy. I saw a beautiful blur.")],
]
const CORNER: Exchange[] = [
  [A("He's heading for the corner... he's IN THE CORNER!"), B("Nobody goes to the corner anymore, Bob. This guy has heart.")],
  [B("Top left corner! Is he looking for the Start button?"), A("The Start button is not there, Tracy. That's a different sport.")],
]
const EDGE: Exchange[] = [
  [A("He's up at the very top of the screen. That's the address bar zone."), B("Dangerous territory, Bob.")],
  [A("Down to the bottom edge. That's the taskbar."), B("The taskbar. Where dreams go to be minimized.")],
]
const CLICK: Exchange[] = [
  [A("He clicks!"), B("...and nothing happens. A bold strategy.")],
  [B("Click! Absolutely nothing."), A("Questions for the desktop, Tracy. Serious questions.")],
  [A("A click! Right on the wallpaper!"), B("The wallpaper did not react. Cold. Very cold.")],
  [A("And he clicks again. Nothing."), B("You have to respect the commitment.")],
]
const DOUBLE: Exchange = [A("DOUBLE CLICK! He's going for the open!"), B("...and it's not opening anything. This is a mouse sport, not a miracle.")]
const RAGE: Exchange = [A("He's spamming it! RAGE-CLICKING!"), B("The desktop is definitely ignoring him, Bob. Definitely.")]
const RIGHT: Exchange = [B("RIGHT CLICK! The risky play!"), A("Haven't seen one of those since twenty twelve!")]
const JIGGLE: Exchange[] = [
  [A("He's shaking it! Is he looking for the cursor?!"), B("Rookie move. It's right there, big man! It's the thing you're moving!")],
  [B("Oh he's WIGGLING it. That's the international signal for 'where did I put it'."), A("It never leaves, Tracy. It never leaves.")],
]
const HOVER: Exchange[] = [
  [A("He's stopped. Just hovering."), B("That's hovering with intent, Bob. You can see him think.")],
  [B("The cursor is just sitting on that spot."), A("Staring. Contemplating. Unclear if he's about to click or about to retire.")],
]
const SCROLL: Exchange = [A("SCROLLING! In a stadium!"), B("There is nothing to scroll, Bob! It's a bold, bold decision.")]
const KEY: Exchange[] = [
  [A("A KEYBOARD?! This is a MOUSE sport!"), B("Somebody check his registration!")],
  [B("Keyboard use detected."), A("Disqualification talk is already happening in the booth.")],
]
const MILESTONE: Exchange = [A("He's covered another ten thousand pixels!"), B("A personal best, Bob! Somebody get this man a sandwich!")]
const REPLAY: Exchange = [A("And here's the replay, in slow motion."), B("Look at the technique. Look at the wrist. That's twenty years of practice.")]

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

interface Pt { t: number; x: number; y: number }

export default function MouseSportsNetwork() {
  const trail = useRef<HTMLCanvasElement>(null)
  const label = useRef<HTMLDivElement>(null)
  const [cap, setCap] = useState<(Line & { k: number }) | null>(null)
  const [replay, setReplay] = useState(false)
  const [stats, setStats] = useState({ dist: 0, top: 0, clicks: 0, idle: 0, energy: 8 })
  const [flash, setFlash] = useState("")

  useEffect(() => {
    const cv = trail.current!
    const g = cv.getContext("2d")!
    const fit = () => { cv.width = innerWidth; cv.height = innerHeight }
    fit(); addEventListener("resize", fit)

    let busy = false, curPrio = 0, token = 0, k = 0
    const lastAt: Record<string, number> = {}
    const start = performance.now()
    let lastInput = start
    let everInput = false
    let pre = 0
    let lastEx = performance.now()
    let dist = 0, top = 0, clicks = 0, energy = 8, nextMilestone = 10000
    let last: Pt | null = null
    const hist: Pt[] = []
    let lastVx = 0, flips: number[] = []
    let stillTimer: ReturnType<typeof setTimeout> | undefined
    let moveStreak = 0
    let clickTimes: number[] = []
    let lastReplay = 0
    let replayRaf = 0
    let mx = innerWidth / 2, my = innerHeight / 2

    const cool = (key: string, ms: number) => { const n = performance.now(); if (n - (lastAt[key] ?? -1e9) < ms) return false; lastAt[key] = n; return true }
    const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]

    async function play(ex: Exchange, prio: number) {
      if (busy && prio <= curPrio) return
      const my = ++token
      busy = true; curPrio = prio; lastEx = performance.now()
      stopSpeaking()
      for (const line of ex) {
        if (my !== token) return
        setCap({ ...line, k: ++k })
        await Promise.all([speak(line.text, { voice: line.who ? "tracy" : "bob" }), sleep(Math.max(1800, line.text.length * 50))])
        await sleep(220)
      }
      if (my === token) { busy = false; curPrio = 0; lastEx = performance.now() }
    }

    const hype = (n: number) => { energy = Math.min(100, energy + n) }
    const touchInput = () => {
      const now = performance.now()
      const away = now - lastInput
      if ((!everInput && now - start > 5000) || (everInput && away > 9000)) {
        play(BACK, 9); fx.cheer(3.5); hype(40); setFlash("HE'S BACK"); setTimeout(() => setFlash(""), 2600)
      }
      everInput = true
      lastInput = now
    }

    const onMove = (e: PointerEvent) => {
      touchInput()
      const t = performance.now()
      mx = e.clientX; my = e.clientY
      if (label.current) { label.current.style.display = "block"; label.current.style.transform = `translate(${mx + 18}px, ${my + 22}px)` }
      if (last) {
        const dt = Math.max(1, t - last.t)
        const d = Math.hypot(mx - last.x, my - last.y)
        dist += d
        const v = (d / dt) * 1000
        if (v > top && v < 20000) top = v
        // trail
        g.strokeStyle = "rgba(74,222,128,.9)"; g.lineWidth = 5; g.lineCap = "round"; g.shadowColor = "#4ade80"; g.shadowBlur = 14
        g.beginPath(); g.moveTo(last.x, last.y); g.lineTo(mx, my); g.stroke()
        // fast
        if (v > 3200 && cool("fast", 16000)) { play(pick(FAST), 4); hype(10) }
        // jiggle: count horizontal direction flips in 1s
        const vx = mx - last.x
        if (Math.abs(vx) > 3 && Math.sign(vx) !== Math.sign(lastVx) && lastVx !== 0) { flips.push(t); flips = flips.filter((f) => t - f < 1000); if (flips.length >= 7 && cool("jiggle", 14000)) { play(pick(JIGGLE), 6); hype(15) } }
        if (Math.abs(vx) > 3) lastVx = vx
        if (dist > nextMilestone) { nextMilestone += 10000; if (cool("mile", 20000)) { play(MILESTONE, 3); hype(10) } }
      }
      last = { t, x: mx, y: my }
      hist.push(last); while (hist.length && t - hist[0].t > 4500) hist.shift()
      moveStreak++
      // corners / edges
      const nearX = Math.min(mx, innerWidth - mx), nearY = Math.min(my, innerHeight - my)
      if (nearX < 50 && nearY < 50 && cool("corner", 18000)) { play(pick(CORNER), 7); fx.cheer(2.5); hype(25) }
      else if ((nearY < 6 || nearY > innerHeight - 8) && cool("edge", 20000)) { play(pick(EDGE), 2); hype(5) }
      // stopped moving -> hover talk + replay
      clearTimeout(stillTimer)
      stillTimer = setTimeout(() => {
        const streak = moveStreak; moveStreak = 0
        if (streak > 25 && performance.now() - lastReplay > 40000 && hist.length > 20) { lastReplay = performance.now(); doReplay() }
        else if (cool("hover", 22000)) play(pick(HOVER), 2)
      }, 3000)
    }

    function doReplay() {
      const pts = hist.slice()
      if (pts.length < 10) return
      play(REPLAY, 5)
      setReplay(true)
      const t0 = performance.now()
      const dur = (pts[pts.length - 1].t - pts[0].t) / 0.35
      const overlay = trail.current!.getContext("2d")!
      const step = () => {
        const p = Math.min(1, (performance.now() - t0) / dur)
        const idx = Math.floor(p * (pts.length - 1))
        overlay.clearRect(0, 0, cv.width, cv.height)
        overlay.strokeStyle = "rgba(250,204,21,.95)"; overlay.lineWidth = 6; overlay.shadowColor = "#facc15"; overlay.shadowBlur = 16
        overlay.beginPath(); overlay.moveTo(pts[0].x, pts[0].y)
        for (let i = 1; i <= idx; i++) overlay.lineTo(pts[i].x, pts[i].y)
        overlay.stroke()
        overlay.fillStyle = "#fff"; overlay.beginPath(); overlay.arc(pts[idx].x, pts[idx].y, 10, 0, 7); overlay.fill()
        if (p < 1) replayRaf = requestAnimationFrame(step)
        else setTimeout(() => { overlay.clearRect(0, 0, cv.width, cv.height); setReplay(false) }, 900)
      }
      step()
    }

    const onDown = (e: PointerEvent) => {
      touchInput()
      clicks++; hype(4)
      const t = performance.now()
      clickTimes.push(t); clickTimes = clickTimes.filter((c) => t - c < 2200)
      g.fillStyle = "rgba(250,204,21,.9)"; g.beginPath(); g.arc(e.clientX, e.clientY, 18, 0, 7); g.fill()
      if (clickTimes.length >= 5 && cool("rage", 25000)) play(RAGE, 6)
      else if (clickTimes.length === 2 && t - clickTimes[0] < 420 && cool("dbl", 14000)) play(DOUBLE, 5)
      else if (cool("click", 7000)) play(pick(CLICK), 3)
    }
    const onCtx = (e: MouseEvent) => { e.preventDefault(); touchInput(); if (cool("right", 14000)) play(RIGHT, 5); hype(6) }
    const onWheel = () => { touchInput(); if (cool("scroll", 20000)) play(SCROLL, 3) }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key.toLowerCase() === "q") return; touchInput(); if (cool("key", 20000)) play(pick(KEY), 4) }

    addEventListener("pointermove", onMove, { passive: true })
    addEventListener("pointerdown", onDown, { passive: true })
    addEventListener("contextmenu", onCtx)
    addEventListener("wheel", onWheel, { passive: true })
    addEventListener("keydown", onKey)

    // fade the trail
    const fade = setInterval(() => {
      g.save(); g.globalCompositeOperation = "destination-out"; g.shadowBlur = 0; g.fillStyle = "rgba(0,0,0,.14)"; g.fillRect(0, 0, cv.width, cv.height); g.restore()
    }, 60)

    // pregame chatter while nobody is touching anything
    const chatter = setInterval(() => {
      const now = performance.now()
      if (!busy && now - lastInput > 5000 && now - lastEx > 4500) { play(PREGAME[pre % PREGAME.length], 1); pre++ }
    }, 2000)
    // first line right away
    play(PREGAME[pre++], 1)

    const hud = setInterval(() => {
      energy = Math.max(6, energy - 1.2)
      setStats({ dist, top, clicks, idle: Math.floor((performance.now() - lastInput) / 1000), energy })
    }, 500)

    return () => {
      removeEventListener("resize", fit)
      removeEventListener("pointermove", onMove); removeEventListener("pointerdown", onDown); removeEventListener("contextmenu", onCtx)
      removeEventListener("wheel", onWheel); removeEventListener("keydown", onKey)
      clearInterval(fade); clearInterval(chatter); clearInterval(hud); clearTimeout(stillTimer); cancelAnimationFrame(replayRaf)
      token++; stopSpeaking()
    }
  }, [])

  const metres = (stats.dist * 0.000264583).toFixed(2)
  return (
    <FullscreenPrank exitMessage="THE MOUSE SPORTS NETWORK HAS GONE OFF THE AIR - IT WAS A PRANK!" className="cursor-default bg-[#04140d] font-sans text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#0d3b25,#04140d_75%)]" />
      {/* field markings */}
      <div className="absolute inset-[7%] rounded-md border-2 border-white/10" />
      <div className="absolute left-1/2 top-[7%] bottom-[7%] w-0.5 -translate-x-1/2 bg-white/10" />
      <div className="absolute left-1/2 top-1/2 h-[28vmin] w-[28vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/10" />
      <div className="pointer-events-none absolute inset-0 [background:repeating-linear-gradient(90deg,rgba(255,255,255,.02)_0_80px,transparent_80px_160px)]" />

      <canvas ref={trail} className="pointer-events-none absolute inset-0 z-10" />
      <div ref={label} className="pointer-events-none absolute left-0 top-0 z-20 hidden rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-bold tracking-wider text-[#facc15]">HUMAN #1</div>

      {/* scoreboard */}
      <div className="absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 px-5 py-3">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-bold tracking-[0.25em]"><span className="rounded bg-[#dc2626] px-2 py-0.5 text-[11px]">LIVE</span> MOUSE SPORTS NETWORK</div>
          <p className="mt-1 text-[13px] font-semibold text-white/80">HUMAN <span className="text-white/40">vs</span> DESKTOP</p>
        </div>
        <div className="flex gap-2 text-center">
          {[["DISTANCE", `${metres} m`], ["TOP SPEED", `${Math.round(stats.top)} px/s`], ["CLICKS", `${stats.clicks} (0 effective)`], ["IDLE", `${stats.idle}s`]].map(([k, v], i) => (
            <div key={k} className={`${i > 1 ? "max-sm:hidden" : ""} min-w-[78px] rounded border border-white/15 bg-black/60 px-3 py-1.5`}>
              <p className="text-[9px] tracking-widest text-white/55">{k}</p>
              <p className="whitespace-nowrap font-mono text-[15px] font-bold leading-tight">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {flash && <p className="pointer-events-none absolute inset-x-0 top-[28%] z-30 text-center text-[clamp(50px,11vw,150px)] font-black italic text-[#facc15] [text-shadow:0_0_40px_#f59e0b,0_6px_0_#92400e] [animation:ms-pop_.35s_cubic-bezier(.2,1.6,.4,1)]">{flash}!</p>}
      {replay && <div className="absolute right-6 top-[96px] z-30 rounded bg-[#facc15] px-3 py-1 text-[14px] font-black tracking-widest text-black">▶ INSTANT REPLAY · 0.35x</div>}

      {/* crowd energy + captions */}
      <div className="absolute inset-x-0 bottom-0 z-30">
        <div className="mx-5 mb-2 flex items-center justify-end gap-3 text-[11px] tracking-widest text-white/60">
          CROWD ENERGY
          <div className="h-2 w-44 overflow-hidden rounded bg-white/10"><div className="h-full bg-[#4ade80] transition-all duration-500" style={{ width: `${stats.energy}%` }} /></div>
        </div>
        <div className="flex items-stretch border-t-2 border-[#dc2626] bg-[#07110d]/95">
          <div className="grid w-[170px] shrink-0 place-items-center px-3 text-center text-[12px] font-extrabold tracking-widest" style={{ background: cap ? COLORS[cap.who] : "#dc2626", color: "#04140d" }}>{cap ? NAMES[cap.who] : "STAND BY"}</div>
          <p key={cap?.k ?? 0} className="min-h-[3.4rem] flex-1 px-5 py-3.5 text-[clamp(15px,1.9vw,24px)] leading-snug [animation:ms-in_.35s_ease]">{cap?.text ?? "We are LIVE from the desktop."}</p>
        </div>
      </div>
      <style>{`
        @keyframes ms-pop { from { transform: scale(.3); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes ms-in { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
      `}</style>
    </FullscreenPrank>
  )
}
