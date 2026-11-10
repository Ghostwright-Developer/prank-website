"use client"

import { useEffect, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { fx, speak, stopSpeaking, preloadSpeech } from "@/lib/fx"
import { sfx } from "@/lib/sfx"

/** A = Bob (play-by-play), B = Tracy (colour). The generator pre-renders every A()/B() line. */
const A = (t: string) => t
const B = (t: string) => t

const LOGO_W = 280
const LOGO_H = 96
const COLORS = ["#ff3d71", "#00e5ff", "#ffd400", "#7cff4d", "#c77dff", "#ff8a00", "#ffffff"]

const WALL_LINES = [
  A("Left wall. That's the third wall in a row. Strong wall performance."),
  A("Right wall. Perfectly fine. Nobody asked for a corner."),
  A("It hits the top. The top has never been in better shape."),
  A("Floor contact. Textbook. We love to see it."),
  A("Another bounce. The logo is simply doing its job."),
  A("And that's a wall. Walls everywhere tonight, folks."),
  A("Changing color. Bold choice. Risky. Pays off."),
  A("It's just bouncing out there. Beautiful. Not going anywhere."),
  A("No corner yet. Patience is the whole sport."),
  A("Fans in the arena have not looked away for 40 minutes."),
]
const MISS_LINES = [
  A("SO CLOSE. A hair off the corner. Somebody's crying in section 12."),
  A("OH! Did you see that?! Eleven pixels!! ELEVEN!!"),
  A("NO NO NO NO. It was RIGHT THERE."),
  A("That one hurt. That one will be in the dreams tonight."),
  A("Absolutely robbed. Somebody call the referee."),
]
const TENSION = [
  A("Hold on... hold on... the angle is... it's lining up..."),
  A("Everyone in the building is standing. Nobody is breathing."),
  A("This could be it. This could be THE ONE."),
]
const HIT_LINES = [A("CORNER!!! CORNER!!! CORNER!!!"), A("IT HAPPENED. I HAVE WAITED MY WHOLE LIFE FOR THIS."), A("Put it in the museum. Put it in the museum RIGHT NOW.")]

const REACT_MISS = [B("Bob, I need a minute. I need a minute, Bob."), B("I am physically shaking right now."), B("That is the closest I have ever seen, and I have seen a lot of logos.")]
const REACT_HIT = [B("Is this real? Bob, is this real life?!"), B("I'm crying. Don't look at me. I'm CRYING."), B("My grandmother waited forty years for this and she missed it by one week.")]
const REACT_TENSE = [B("Bob, I can't look. Tell me when it's over."), B("My hands are cold. Why are my hands so cold?")]
const OPENING = A("Welcome to the arena. We are live. The logo is warming up.")

interface Plan { sx: number; sy: number }

/** Choose speeds so the logo reaches a corner exactly T seconds from now (it bounces around in between). */
function planHit(x: number, y: number, dx: number, dy: number, W: number, H: number, T: number): Plan {
  const reach = (p: number, d: number, size: number, target: 0 | 1, j: number) => {
    const toWall = d > 0 ? size - p : p
    const farSide = d > 0 ? 1 : 0 // wall we meet first: 1 = max side, 0 = min side
    return toWall + (target === farSide ? 0 : size) + 2 * j * size
  }
  let best: Plan | null = null
  let bestScore = Infinity
  for (const tx of [0, 1] as const) for (const ty of [0, 1] as const) {
    for (let jx = 0; jx < 120; jx++) {
      const sx = reach(x, dx, W, tx, jx) / T
      if (sx < 120) continue
      if (sx > 420) break
      for (let jy = 0; jy < 120; jy++) {
        const sy = reach(y, dy, H, ty, jy) / T
        if (sy < 120) continue
        if (sy > 420) break
        const score = Math.abs(sx - 230) + Math.abs(sy - 190) + Math.random() * 40
        if (score < bestScore) { bestScore = score; best = { sx, sy } }
      }
    }
  }
  return best ?? { sx: 230, sy: 190 }
}

interface Spark { x: number; y: number; vx: number; vy: number; r: number; c: string; rot: number; vr: number; life: number }

export default function CornerWatch() {
  const logo = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const cornerGlow = useRef<(HTMLDivElement | null)[]>([])
  const [hud, setHud] = useState({ hits: 0, miss: 0, walls: 0, secs: 0, prox: 999, viewers: 412938 })
  const [color, setColor] = useState(COLORS[0])
  const [line, setLine] = useState(OPENING)
  const [flash, setFlash] = useState<null | { text: string; kind: "miss" | "hit" | "tense" }>(null)
  const [alert, setAlert] = useState(false)

  useEffect(() => {
    let W = innerWidth - LOGO_W
    let H = innerHeight - LOGO_H
    let x = Math.random() * W * 0.6 + 40
    let y = Math.random() * H * 0.6 + 40
    let dx = Math.random() < 0.5 ? 1 : -1
    let dy = Math.random() < 0.5 ? 1 : -1
    let plan = planHit(x, y, dx, dy, W, H, 70 + Math.random() * 50)
    let last = performance.now()
    let walls = 0, miss = 0, hits = 0
    let paused = 0 // seconds left of celebration freeze
    let lastLine = 0
    let colorIdx = 0
    let interacted = false
    let startedAt = performance.now()
    let tenseUntil = 0
    const sparks: Spark[] = []
    let raf = 0

    let talking = false
    const voiceLine = (t: string, who: "bob" | "tracy", force: boolean) => {
      if (talking && !force) return
      if (force) stopSpeaking()
      talking = true
      void speak(t, { voice: who }).then(() => { talking = false })
    }
    const say = (t: string, force = false) => { lastLine = performance.now(); setLine(t); voiceLine(t, "bob", force) }
    const react = (t: string, delay: number) => setTimeout(() => { setLine(t); voiceLine(t, "tracy", true) }, delay)
    preloadSpeech("bob", [OPENING, ...WALL_LINES.slice(0, 3)])
    const openTimer = setTimeout(() => voiceLine(OPENING, "bob", false), 1200)
    const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]
    const bounceColor = () => { colorIdx = (colorIdx + 1 + Math.floor(Math.random() * 5)) % COLORS.length; setColor(COLORS[colorIdx]) }

    const burst = () => {
      const c = canvas.current
      if (!c) return
      const cx = x + LOGO_W / 2, cy = y + LOGO_H / 2
      for (let i = 0; i < 260; i++) {
        const a = Math.random() * Math.PI * 2
        const v = 120 + Math.random() * 720
        sparks.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 200, r: 3 + Math.random() * 5, c: pick(COLORS), rot: Math.random() * 6, vr: (Math.random() - 0.5) * 14, life: 3 + Math.random() * 3 })
      }
    }

    const corner = () => {
      x = x < W / 2 ? 0 : W; y = y < H / 2 ? 0 : H // snap exactly into the corner
      dx = x === 0 ? 1 : -1; dy = y === 0 ? 1 : -1
      hits++
      paused = 5.5
      bounceColor()
      burst()
      fx.airhorn(); fx.cheer(5); fx.confetti()
      setFlash({ text: "CORNER!!!", kind: "hit" })
      say(pick(HIT_LINES), true); react(pick(REACT_HIT), 5200)
      setAlert(false)
      setTimeout(() => setFlash(null), 5200)
      plan = planHit(x, y, dx, dy, W, H, 85 + Math.random() * 50)
    }

    const wallHit = (axis: "x" | "y") => {
      walls++
      bounceColor()
      sfx.click()
      const other = axis === "x" ? Math.min(y, H - y) : Math.min(x, W - x)
      if (other < 14) { corner(); return }
      if (other < 80) {
        miss++
        fx.groan()
        setFlash({ text: `SO CLOSE  (${Math.round(other)}px)`, kind: "miss" })
        say(pick(MISS_LINES), true); react(pick(REACT_MISS), 4800)
        setTimeout(() => setFlash((f) => (f?.kind === "miss" ? null : f)), 1700)
      } else if (performance.now() - lastLine > 5500) say(pick(WALL_LINES))
    }

    let lastInput = performance.now()
    const onFirstInput = () => {
      const nowT = performance.now()
      const idle = nowT - lastInput
      lastInput = nowT
      if (interacted && idle < 45000) return
      interacted = true
      if (nowT - startedAt < 6000) return
      // Someone just came back to the screen: the corner is coming. Right now.
      plan = planHit(x, y, dx, dy, W, H, 9)
      tenseUntil = performance.now() + 9000
      setAlert(true)
      say(pick(TENSION), true); react(pick(REACT_TENSE), 4500)
      fx.murmur(8)
    }
    const evs = ["mousemove", "pointerdown", "keydown", "touchstart"] as const
    evs.forEach((e) => window.addEventListener(e, onFirstInput, { once: false, passive: true }))

    const onResize = () => {
      W = innerWidth - LOGO_W; H = innerHeight - LOGO_H
      x = Math.min(x, W); y = Math.min(y, H)
      if (canvas.current) { canvas.current.width = innerWidth; canvas.current.height = innerHeight }
      plan = planHit(x, y, dx, dy, W, H, 80)
    }
    window.addEventListener("resize", onResize)
    if (canvas.current) { canvas.current.width = innerWidth; canvas.current.height = innerHeight }

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (paused > 0) paused -= dt
      else {
        x += dx * plan.sx * dt
        y += dy * plan.sy * dt
        if (x <= 0) { x = 0; dx = 1; wallHit("x") } else if (x >= W) { x = W; dx = -1; wallHit("x") }
        if (paused <= 0) {
          if (y <= 0) { y = 0; dy = 1; wallHit("y") } else if (y >= H) { y = H; dy = -1; wallHit("y") }
        }
      }
      if (logo.current) logo.current.style.transform = `translate(${x}px, ${y}px) scale(${paused > 0 ? 1.12 + Math.sin(now / 90) * 0.04 : 1})`

      // corner glows
      const cs = [[0, 0], [W, 0], [0, H], [W, H]]
      cs.forEach(([cx, cy], i) => {
        const d = Math.hypot(x - cx, y - cy)
        const v = Math.max(0, 1 - d / 320)
        const el = cornerGlow.current[i]
        if (el) { el.style.opacity = String(Math.min(1, v * 1.4)); el.style.transform = `scale(${0.7 + v * 0.8})` }
      })

      // confetti
      const c = canvas.current
      if (c) {
        const g = c.getContext("2d")!
        g.clearRect(0, 0, c.width, c.height)
        for (let i = sparks.length - 1; i >= 0; i--) {
          const p = sparks[i]
          p.vy += 520 * dt; p.vx *= 0.992; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.life -= dt
          if (p.life <= 0 || p.y > c.height + 20) { sparks.splice(i, 1); continue }
          g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.globalAlpha = Math.min(1, p.life); g.fillStyle = p.c; g.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); g.restore()
        }
      }

      if (tenseUntil && now > tenseUntil + 12000) { tenseUntil = 0; setAlert(false) }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    const hudTimer = setInterval(() => {
      const prox = Math.hypot(Math.min(x, W - x), Math.min(y, H - y))
      setHud((h) => ({ hits, miss, walls, secs: Math.floor((performance.now() - startedAt) / 1000), prox: Math.round(prox), viewers: Math.max(1000, h.viewers + Math.round((Math.random() - 0.45) * 90)) }))
    }, 250)
    const idleTalk = setInterval(() => { if (performance.now() - lastLine > 12000 && paused <= 0) say(pick(WALL_LINES)) }, 4000)

    return () => {
      cancelAnimationFrame(raf); clearTimeout(openTimer); stopSpeaking()
      clearInterval(hudTimer); clearInterval(idleTalk)
      evs.forEach((e) => window.removeEventListener(e, onFirstInput))
      window.removeEventListener("resize", onResize)
    }
  }, [])

  const mm = String(Math.floor(hud.secs / 60)).padStart(2, "0")
  const ss = String(hud.secs % 60).padStart(2, "0")
  const hot = hud.prox < 200

  return (
    <FullscreenPrank exitMessage="THE CORNER WAS NEVER IN DANGER - IT WAS A PRANK!" className="cursor-none bg-[#04050b] font-sans text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#0e1230,#04050b_70%)]" />
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {[["left-0 top-0", "0% 0%"], ["right-0 top-0", "100% 0%"], ["bottom-0 left-0", "0% 100%"], ["bottom-0 right-0", "100% 100%"]].map(([pos, origin], i) => (
        <div key={i} ref={(el) => { cornerGlow.current[i] = el }} className={`pointer-events-none absolute ${pos} h-[34vmin] w-[34vmin] opacity-0`} style={{ transformOrigin: origin, background: `radial-gradient(circle at ${origin}, rgba(255,40,70,.85), rgba(255,40,70,0) 65%)` }} />
      ))}

      {/* HUD */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between px-5 py-3">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-bold tracking-[0.25em]"><span className="rounded bg-[#e11d48] px-2 py-0.5 text-[11px]">LIVE</span> SCREENSAVER SPORTS NETWORK</div>
          <p className="mt-1 text-[12px] text-white/55">{hud.viewers.toLocaleString()} watching</p>
        </div>
        <div className="flex gap-2 text-center">
          {[["CORNERS", hud.hits], ["NEAR MISSES", hud.miss], ["WALLS", hud.walls], ["TIME", `${mm}:${ss}`]].map(([k, v], i) => (
            <div key={k as string} className={`min-w-[72px] ${i === 1 || i === 2 ? "max-sm:hidden" : ""} rounded border border-white/15 bg-black/60 px-3 py-1.5`}>
              <p className="text-[9px] tracking-widest text-white/55">{k}</p>
              <p className="font-mono text-[22px] font-bold leading-none">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* The star of the show */}
      <div ref={logo} className="absolute left-0 top-0 z-[25] will-change-transform" style={{ width: LOGO_W, height: LOGO_H }}>
        <div className="grid h-full w-full place-items-center rounded-[48px] border-[5px] whitespace-nowrap text-[36px] font-black italic tracking-tight transition-colors duration-150" style={{ color, borderColor: color, boxShadow: `0 0 26px ${color}88, inset 0 0 18px ${color}44`, textShadow: `0 0 14px ${color}` }}>
          SCREENSAVER
        </div>
      </div>

      <canvas ref={canvas} className="pointer-events-none absolute inset-0 z-30" />

      {flash && (
        <div className="pointer-events-none absolute inset-x-0 top-[34%] z-40 text-center">
          <p key={flash.text} className={`inline-block font-black italic [animation:cw-pop_.35s_cubic-bezier(.2,1.6,.4,1)] ${flash.kind === "hit" ? "text-[clamp(60px,14vw,190px)] text-[#ffd400] [text-shadow:0_0_40px_#ff8a00,0_6px_0_#b45309]" : "text-[clamp(34px,6vw,80px)] text-[#ff3d71] [text-shadow:0_0_24px_#ff3d71]"}`}>{flash.text}</p>
        </div>
      )}

      {/* Proximity meter + lower third */}
      <div className="absolute bottom-0 inset-x-0 z-20">
        <div className="mx-5 mb-2 flex items-center justify-end gap-3 text-[11px] tracking-widest">
          {alert && <span className="animate-pulse font-bold text-[#ffd400]">CORNER ALERT</span>}
          <span className="text-white/55">CORNER PROXIMITY</span>
          <div className="h-2 w-44 overflow-hidden rounded bg-white/10"><div className="h-full transition-all duration-200" style={{ width: `${Math.max(3, 100 - Math.min(100, hud.prox / 6))}%`, background: hot ? "#ff3d71" : "#00e5ff" }} /></div>
          <span className={`w-14 text-right font-mono ${hot ? "font-bold text-[#ff3d71]" : "text-white/70"}`}>{hud.prox}px</span>
        </div>
        <div className="flex items-stretch border-t-2 border-[#e11d48] bg-[#0a0c18]">
          <div className="grid shrink-0 place-items-center bg-[#e11d48] px-5 text-[13px] font-extrabold tracking-widest">PLAY BY PLAY</div>
          <p key={line} className="flex-1 px-5 py-3 text-[clamp(14px,1.7vw,20px)] [animation:cw-in_.4s_ease]">{line}</p>
        </div>
      </div>

      <style>{`
        @keyframes cw-pop { from { transform: scale(.3); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes cw-in { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
      `}</style>
    </FullscreenPrank>
  )
}
