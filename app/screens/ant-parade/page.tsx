"use client"

import { useEffect, useRef } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { DesktopIcon, Win11Taskbar, Win11Wallpaper } from "@/components/windows-ui"
import { fx } from "@/lib/fx"

type Kind = "computer" | "recycle" | "folder" | "browser" | "doc" | "network"
const ICONS: { kind: Kind; label: string; need: number; icon?: string }[] = [
  { kind: "computer", label: "This PC", need: 4 }, { kind: "recycle", label: "Recycle Bin", need: 6 },
  { kind: "folder", label: "Documents", need: 3, icon: "folder-docs" }, { kind: "browser", label: "Browser", need: 3 },
  { kind: "doc", label: "resume_FINAL_v7", need: 3 }, { kind: "network", label: "Network", need: 3 },
  { kind: "folder", label: "Photos", need: 3, icon: "folder-pictures" }, { kind: "folder", label: "Do Not Open", need: 4 },
]
const SAY = [
  "Left a bit.", "Gary, you're not even holding it.", "Lift with your legs.", "Is it heavier than it looks?",
  "Don't look down.", "Steve is filming this.", "HEAVE.", "Why is it wobbling?", "I think it's the Recycle Bin.",
  "Nobody tell the queen.", "Watch the corner!", "My back, Linda.", "On three. One. Two. Three. HEAVE.", "This is a four ant job. There are three of us.",
]
const SCOUTS = 5
const POOL = 34

interface Ant {
  x: number; y: number; h: number; active: boolean; mode: "idle" | "toSlot" | "carry" | "leave" | "scout" | "pause"
  task: number; slot: number; tx: number; ty: number; wait: number; say: number
  wrap: HTMLDivElement | null; svg: HTMLDivElement | null; bub: HTMLDivElement | null; spd: number
}
interface Task { home: { x: number; y: number }; pos: { x: number; y: number }; dest: { x: number; y: number }; state: "home" | "gather" | "carry" | "sink" | "gone" | "grow" | "gone2"; scale: number; ants: number[]; el: HTMLDivElement | null; need: number; phase: number }

/** A real ant photo at roughly real size (~7 mm, about 30 CSS pixels long). Faces "up"; we rotate it to its heading. */
function AntSvg() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/art/ant.webp" width={21} height={30} alt="" draggable={false} className="block h-[30px] w-[21px] select-none" />
}

export default function AntParade() {
  const antEls = useRef<(HTMLDivElement | null)[]>([])
  const svgEls = useRef<(HTMLDivElement | null)[]>([])
  const bubEls = useRef<(HTMLDivElement | null)[]>([])
  const iconEls = useRef<(HTMLDivElement | null)[]>([])
  const hole = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let W = innerWidth, H = innerHeight
    const holePos = () => ({ x: W - 150, y: H * 0.5 })
    const homes = ICONS.map((_, i) => ({ x: 52 + Math.floor(i / 5) * 92, y: 66 + (i % 5) * 92 }))
    const tasks: Task[] = ICONS.map((ic, i) => ({ home: { ...homes[i] }, pos: { ...homes[i] }, dest: { ...homes[i] }, state: "home", scale: 1, ants: [], el: null, need: ic.need, phase: 0 }))
    const ants: Ant[] = Array.from({ length: POOL }, () => ({ x: -99, y: -99, h: 0, active: false, mode: "idle", task: -1, slot: 0, tx: 0, ty: 0, wait: 0, say: 0, wrap: null, svg: null, bub: null, spd: 70 }))
    antEls.current.forEach((e, i) => { ants[i].wrap = e; ants[i].svg = svgEls.current[i]; ants[i].bub = bubEls.current[i] })
    tasks.forEach((t, i) => { t.el = iconEls.current[i] })

    let mode: "take" | "give" = "take"
    let startNext = 3
    let raf = 0, last = performance.now(), t0 = last, nextSay = 6, modeWait = 0
    let mx = -999, my = -999
    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY }
    addEventListener("pointermove", onMove, { passive: true })
    const resize = () => { W = innerWidth; H = innerHeight }
    addEventListener("resize", resize)

    const free = () => ants.find((a) => !a.active)
    const spawn = (a: Ant, mode: Ant["mode"]) => { const h = holePos(); a.active = true; a.mode = mode; a.x = h.x + (Math.random() - 0.5) * 30; a.y = h.y + (Math.random() - 0.5) * 10; a.h = Math.random() * 6.28; a.wait = 0 }
    const turn = (a: Ant, ang: number, dt: number, rate = 7) => {
      let d = ang - a.h
      while (d > Math.PI) d -= 6.2832
      while (d < -Math.PI) d += 6.2832
      a.h += d * Math.min(1, rate * dt)
    }
    const goTo = (a: Ant, x: number, y: number, dt: number, speed: number) => {
      const dx = x - a.x, dy = y - a.y, d = Math.hypot(dx, dy)
      turn(a, Math.atan2(dy, dx), dt)
      const step = Math.min(d, speed * dt)
      a.x += Math.cos(a.h) * step; a.y += Math.sin(a.h) * step
      return d
    }
    for (let i = 0; i < SCOUTS; i++) { const a = ants[POOL - 1 - i]; spawn(a, "scout"); a.tx = Math.random() * W; a.ty = Math.random() * (H - 80) }

    const active = () => tasks.filter((t) => t.state === "gather" || t.state === "carry" || t.state === "sink" || t.state === "grow")
    const launch = (t: Task, i: number, give: boolean) => {
      const h = holePos()
      t.ants = []
      for (let k = 0; k < t.need; k++) {
        const a = free(); if (!a) break
        spawn(a, give ? "carry" : "toSlot")
        a.x = h.x + (Math.random() - 0.5) * 24; a.y = h.y + (Math.random() - 0.5) * 8
        a.task = i; a.slot = (k / t.need) * 6.2832; a.wait = k * 0.45
        t.ants.push(ants.indexOf(a))
      }
      if (give) {
        // shuffle: the ants put the icon somewhere new
        t.dest = { x: 60 + Math.random() * (W - 340), y: 60 + Math.random() * (H - 220) }
        t.pos = { x: h.x, y: h.y }; t.state = "grow"; t.scale = 0
      } else { t.state = "gather"; t.dest = h }
    }

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now
      const T = (now - t0) / 1000
      const h = holePos()
      if (hole.current) hole.current.style.transform = `translate(${h.x - 70}px, ${h.y - 26}px)`

      // scheduler
      if (T > startNext) {
        const wantStates = mode === "take" ? "home" : "gone"
        const t = tasks.findIndex((x) => x.state === wantStates)
        if (t >= 0 && active().length < 3 && ants.filter((a) => !a.active).length >= tasks[t].need) { launch(tasks[t], t, mode === "give"); startNext = T + 7 + Math.random() * 3 }
        else if (t < 0 && !active().length) {
          modeWait += dt
          if (modeWait > (mode === "take" ? 4 : 16)) { modeWait = 0; mode = mode === "take" ? "give" : "take"; startNext = T + 1; if (mode === "take") tasks.forEach((x) => { x.home = { ...x.pos }; x.state = "home" }) }
        }
      }

      // tasks
      tasks.forEach((t) => {
        if (t.state === "gather") {
          const ready = t.ants.every((ai) => { const a = ants[ai]; return a.mode === "carry" || a.mode === "pause" })
          if (ready && t.ants.length) { t.state = "carry"; t.ants.forEach((ai) => (ants[ai].mode = "carry")); fx.scurry() }
        } else if (t.state === "carry") {
          const dx = t.dest.x - t.pos.x, dy = t.dest.y - t.pos.y, d = Math.hypot(dx, dy)
          const v = 34 + t.ants.length * 3
          if (d < 12) { t.state = "sink"; t.phase = 0 } else { t.pos.x += (dx / d) * v * dt; t.pos.y += (dy / d) * v * dt }
        } else if (t.state === "sink") {
          t.phase += dt * 2.2; t.scale = Math.max(0, 1 - t.phase)
          if (t.phase >= 1) { t.state = "gone"; t.ants.forEach((ai) => { ants[ai].mode = "leave"; ants[ai].task = -1 }); fx.pop() }
        } else if (t.state === "grow") {
          // icon appears from the hole, ants carry it to its new spot
          t.scale = Math.min(1, t.scale + dt * 1.6)
          const dx = t.dest.x - t.pos.x, dy = t.dest.y - t.pos.y, d = Math.hypot(dx, dy)
          const v = 34 + t.ants.length * 3
          if (d < 8) { t.state = "home"; t.ants.forEach((ai) => { ants[ai].mode = "leave"; ants[ai].task = -1 }); t.home = { ...t.pos } }
          else if (t.ants.every((ai) => ants[ai].wait <= 0)) { t.pos.x += (dx / d) * v * dt; t.pos.y += (dy / d) * v * dt }
        }
        if (t.el) {
          const wob = t.state === "carry" || t.state === "grow" ? Math.sin(now / 160 + t.phase) * 3 : 0
          t.el.style.opacity = t.state === "gone" ? "0" : "1"
          t.el.style.transform = `translate(${t.pos.x - 38}px, ${t.pos.y - 40}px) rotate(${wob}deg) scale(${t.scale})`
        }
      })

      // ants
      let sayCooldown = nextSay
      ants.forEach((a, ai) => {
        if (!a.wrap) return
        if (!a.active) { a.wrap.style.opacity = "0"; return }
        a.wait -= dt
        const near = Math.hypot(a.x - mx, a.y - my) < 70
        if (a.mode === "toSlot") {
          if (a.wait > 0) { /* still emerging */ }
          else {
            const t = tasks[a.task]
            const sx = t.pos.x + Math.cos(a.slot) * 40, sy = t.pos.y + Math.sin(a.slot) * 36
            const d = goTo(a, sx, sy, dt, 78)
            if (d < 5) { a.mode = "pause" }
          }
        } else if (a.mode === "pause") {
          const t = tasks[a.task]; if (!t) a.mode = "leave"
          else { a.x = t.pos.x + Math.cos(a.slot) * 40; a.y = t.pos.y + Math.sin(a.slot) * 36; turn(a, Math.atan2(t.pos.y - a.y, t.pos.x - a.x), dt) }
        } else if (a.mode === "carry") {
          const t = tasks[a.task]
          if (t) {
            if (a.wait > 0) { /* wait to be released */ }
            const ang = Math.atan2(t.dest.y - t.pos.y, t.dest.x - t.pos.x)
            const sl = a.slot
            const tx = t.pos.x + Math.cos(sl) * 40, ty = t.pos.y + Math.sin(sl) * 36
            if (t.state === "grow" && a.wait > 0) { a.x = holePos().x; a.y = holePos().y }
            else { a.x += (tx - a.x) * Math.min(1, dt * 10); a.y += (ty - a.y) * Math.min(1, dt * 10) }
            a.h = ang + Math.PI * (Math.cos(sl - ang) > 0 ? 1 : 0) + (Math.cos(sl - ang) > 0 ? 0 : 0)
            a.h = Math.atan2(Math.sin(sl) , Math.cos(sl)) + Math.PI // face the icon centre
          }
        } else if (a.mode === "leave") {
          const d = goTo(a, h.x, h.y, dt, 85)
          if (d < 12) { a.active = false; a.mode = "idle" }
        } else if (a.mode === "scout") {
          if (near) { turn(a, Math.atan2(a.y - my, a.x - mx), dt, 14); a.x += Math.cos(a.h) * 150 * dt; a.y += Math.sin(a.h) * 150 * dt }
          else if (a.wait > 0) { /* resting */ }
          else {
            const d = goTo(a, a.tx, a.ty, dt, 62)
            if (d < 8) { if (Math.random() < 0.5) a.wait = 1 + Math.random() * 2.5; a.tx = Math.random() < 0.3 ? h.x : Math.random() * W; a.ty = Math.random() * (H - 90) }
          }
        }
        a.x = Math.max(-40, Math.min(W + 40, a.x)); a.y = Math.max(-40, Math.min(H - 20, a.y))
        a.wrap.style.opacity = "1"
        a.wrap.style.transform = `translate(${a.x - 15}px, ${a.y - 15}px)`
        if (a.svg) {
          a.svg.style.transform = `rotate(${a.h + Math.PI / 2}rad)`
          const moving = a.mode !== "pause" && !(a.mode === "scout" && a.wait > 0) && !(a.mode === "toSlot" && a.wait > 0)
          a.svg.style.setProperty("--ap", moving ? "running" : "paused")
        }
        if (a.bub) { a.bub.style.opacity = a.say > 0 ? "1" : "0"; if (a.say > 0) a.say -= dt }
        void ai; void sayCooldown
      })
      // a random carrier says something
      if (T > nextSay) {
        const carriers = ants.map((a, i) => ({ a, i })).filter(({ a }) => a.active && (a.mode === "carry" || a.mode === "pause") && a.say <= 0)
        if (carriers.length) {
          const { a } = carriers[Math.floor(Math.random() * carriers.length)]
          if (a.bub) { a.bub.textContent = SAY[Math.floor(Math.random() * SAY.length)]; a.say = 3.2 }
        }
        nextSay = T + 4 + Math.random() * 3
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); removeEventListener("pointermove", onMove); removeEventListener("resize", resize) }
  }, [])

  return (
    <FullscreenPrank exitMessage="THE ANTS HAVE RETURNED YOUR ICONS - IT WAS A PRANK!" className="cursor-default overflow-hidden bg-[#a9c6e6] font-segoe">
      <Win11Wallpaper variant="light" />
      <Win11Taskbar dark={false} />
      <div ref={hole} className="pointer-events-none absolute left-0 top-0 z-[2] h-[52px] w-[140px]">
        <div className="absolute inset-0 rounded-[50%] bg-[radial-gradient(ellipse,#050302_45%,#3d2a1a_60%,#6b4a2c_75%,transparent_78%)]" />
        {[[10, 38, 8], [118, 36, 6], [28, 6, 5], [100, 8, 7], [60, 46, 5]].map(([x, y, s], i) => <span key={i} className="absolute rounded-full bg-[#8a6a44]" style={{ left: x, top: y, width: s, height: s }} />)}
      </div>

      {ICONS.map((ic, i) => (
        <div key={i} ref={(el) => { iconEls.current[i] = el }} className="absolute left-0 top-0 z-[4] will-change-transform" style={{ width: 76 }}>
          <DesktopIcon kind={ic.kind} label={ic.label} icon={ic.icon} />
        </div>
      ))}

      {Array.from({ length: POOL }, (_, i) => (
        <div key={i} ref={(el) => { antEls.current[i] = el }} className="pointer-events-none absolute left-0 top-0 z-[6] h-[30px] w-[30px] opacity-0 will-change-transform">
          <div ref={(el) => { svgEls.current[i] = el }} className="ap-ant grid h-full w-full place-items-center drop-shadow-[0_1px_1px_rgba(0,0,0,.5)]"><AntSvg /></div>
          <div ref={(el) => { bubEls.current[i] = el }} className="absolute -top-9 left-1/2 w-max max-w-[210px] -translate-x-1/2 rounded-lg bg-white px-2 py-1 text-[12px] leading-tight text-[#222] opacity-0 shadow-lg transition-opacity" />
        </div>
      ))}
      <style>{`
        .ap-ant img { animation: ap-walk .16s ease-in-out infinite alternate; }
        @keyframes ap-walk { from { transform: rotate(-3deg) scaleY(.96) } to { transform: rotate(3deg) scaleY(1.04) } }
        .ap-ant * { animation-play-state: var(--ap, running) !important; }
      `}</style>
    </FullscreenPrank>
  )
}
