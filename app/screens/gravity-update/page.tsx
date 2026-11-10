"use client"

import { useEffect, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { DesktopIcon, Win10Taskbar, Win10Wallpaper } from "@/components/windows-ui"
import { fx } from "@/lib/fx"

type Kind = "computer" | "recycle" | "folder" | "browser" | "doc" | "network"
interface Def { label: string; kind?: Kind; win?: string }

const DEFS: Def[] = [
  { label: "This PC", kind: "computer" }, { label: "Recycle Bin", kind: "recycle" }, { label: "Documents", kind: "folder" },
  { label: "Browser", kind: "browser" }, { label: "resume_FINAL_v7", kind: "doc" }, { label: "Network", kind: "network" },
  { label: "Photos", kind: "folder" }, { label: "taxes_2019", kind: "doc" }, { label: "Homework", kind: "folder" },
  { label: "Games", kind: "folder" }, { label: "Downloads", kind: "folder" }, { label: "notes.txt", kind: "doc" },
  { label: "Notepad", win: "Notepad" }, { label: "Calculator", win: "Calculator" }, { label: "Settings", win: "Settings" },
]

interface Body { x: number; y: number; vx: number; vy: number; r: number; rot: number; vr: number; active: boolean; releaseAt: number; shake: number; el: HTMLDivElement | null; w: number; h: number; held: boolean }

const PHASES: { at: number; g: [number, number]; label: string; arrow: string; mul: string; note: string }[] = [
  { at: 0, g: [0, 1], label: "Down", arrow: "↓", mul: "1.0x", note: "Gravity has been enabled. Please keep arms and icons inside the desktop." },
  { at: 34, g: [0, -1], label: "Up", arrow: "↑", mul: "1.0x", note: "Gravity direction changed to UP. We apologize for any inconvenience." },
  { at: 41, g: [0, 1], label: "Down", arrow: "↓", mul: "1.0x", note: "Gravity restored. Your files are now falling again." },
  { at: 49, g: [-1, 0], label: "Left", arrow: "←", mul: "1.0x", note: "Gravity is now to the left. This is a feature." },
  { at: 57, g: [0, 1], label: "Down", arrow: "↓", mul: "1.0x", note: "Back to normal. Windows did not say what normal was." },
  { at: 64, g: [0, 1], label: "Moon", arrow: "↓", mul: "0.17x", note: "Moon mode enabled for no reason. Enjoy the bounce." },
  { at: 75, g: [1, 0], label: "Right", arrow: "→", mul: "1.0x", note: "Gravity is now to the right. Sorry about the Recycle Bin." },
  { at: 83, g: [0, 1], label: "Down", arrow: "↓", mul: "1.0x", note: "Gravity re-enabled. This update will repeat until morning." },
]
const CYCLE = 92

export default function GravityUpdate() {
  const bodies = useRef<Body[]>([])
  const [toast, setToast] = useState<{ k: number; title: string; text: string } | null>(null)
  const [phase, setPhase] = useState(0)
  const [intro, setIntro] = useState(true)

  useEffect(() => {
    let W = innerWidth, H = innerHeight
    const floor = () => H - 40
    const t0 = performance.now()
    const bs: Body[] = DEFS.map((d, i) => {
      const win = !!d.win
      const col = Math.floor(i / 6), row = i % 6
      return {
        x: win ? W * 0.38 + (i - 12) * 190 : 52 + col * 92, y: win ? H * 0.42 + ((i - 12) % 2) * 60 : 66 + row * 92,
        vx: 0, vy: 0, r: win ? 50 : 36, rot: 0, vr: 0, active: false, releaseAt: 5 + i * 1.15 + Math.random() * 0.6, shake: 0, el: null, w: win ? 130 : 76, h: win ? 90 : 84, held: false,
      }
    })
    bodies.current = bs
    // elements are attached by ref callbacks during render; copy them over on first frame
    const attach = () => { document.querySelectorAll<HTMLDivElement>("[data-gb]").forEach((el) => { bs[+el.dataset.gb!].el = el }) }

    let raf = 0, last = performance.now(), lastThud = 0, cyc = -1, tk = 0
    const resize = () => { W = innerWidth; H = innerHeight }
    addEventListener("resize", resize)

    // dragging
    let grab: { b: Body; ox: number; oy: number; hist: { t: number; x: number; y: number }[] } | null = null
    const onDown = (e: PointerEvent) => {
      let best: Body | null = null, bd = 1e9
      for (const b of bs) { const d = Math.hypot(b.x - e.clientX, b.y - e.clientY); if (d < b.r + 14 && d < bd) { best = b; bd = d } }
      if (best) { grab = { b: best, ox: best.x - e.clientX, oy: best.y - e.clientY, hist: [] }; best.active = true; best.held = true; best.vx = best.vy = 0; fx.pop() }
    }
    const onMove = (e: PointerEvent) => {
      if (!grab) return
      grab.hist.push({ t: performance.now(), x: e.clientX, y: e.clientY })
      if (grab.hist.length > 6) grab.hist.shift()
      grab.b.x = e.clientX + grab.ox; grab.b.y = e.clientY + grab.oy
    }
    const onUp = () => {
      if (!grab) return
      const h = grab.hist
      if (h.length >= 2) {
        const a = h[0], c = h[h.length - 1], dt = Math.max(0.016, (c.t - a.t) / 1000)
        grab.b.vx = Math.max(-2600, Math.min(2600, (c.x - a.x) / dt))
        grab.b.vy = Math.max(-2600, Math.min(2600, (c.y - a.y) / dt))
      }
      grab.b.held = false; grab = null
    }
    addEventListener("pointerdown", onDown); addEventListener("pointermove", onMove); addEventListener("pointerup", onUp); addEventListener("pointercancel", onUp)

    const step = (dt: number, g: [number, number], gmag: number) => {
      for (const b of bs) {
        if (!b.active || b.held) continue
        b.vx += g[0] * gmag * dt; b.vy += g[1] * gmag * dt
        b.vx *= 0.9995; b.vy *= 0.9995
        b.x += b.vx * dt; b.y += b.vy * dt
        b.rot += (b.vx * g[1] - b.vy * g[0]) / b.r * dt * 57.3 * 0.7 + b.vr * dt
        b.vr *= 0.99
        // walls
        const lo = b.r, hi = W - b.r, top = b.r, bot = floor() - b.r
        if (b.x < lo) { b.x = lo; if (b.vx < -150) thud(-b.vx); b.vx = -b.vx * 0.45; b.vy *= 0.97 }
        if (b.x > hi) { b.x = hi; if (b.vx > 150) thud(b.vx); b.vx = -b.vx * 0.45; b.vy *= 0.97 }
        if (b.y < top) { b.y = top; if (b.vy < -150) thud(-b.vy); b.vy = -b.vy * 0.45; b.vx *= 0.97 }
        if (b.y > bot) { b.y = bot; if (b.vy > 150) thud(b.vy); b.vy = -b.vy * 0.45; b.vx *= 0.97 }
      }
      for (let it = 0; it < 2; it++) for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
        const a = bs[i], c = bs[j]
        if (!a.active && !c.active) continue
        const dx = c.x - a.x, dy = c.y - a.y
        const d = Math.hypot(dx, dy) || 0.001, min = a.r + c.r
        if (d >= min) continue
        const nx = dx / d, ny = dy / d, over = min - d
        const ma = a.active && !a.held ? a.r * a.r : 1e9, mc = c.active && !c.held ? c.r * c.r : 1e9
        const wa = mc / (ma + mc), wc = ma / (ma + mc)
        if (ma < 1e9) { a.x -= nx * over * wa; a.y -= ny * over * wa }
        if (mc < 1e9) { c.x += nx * over * wc; c.y += ny * over * wc }
        const rvn = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny
        if (rvn < 0) {
          const jn = -(1 + 0.35) * rvn / (1 / ma + 1 / mc)
          if (ma < 1e9) { a.vx -= (jn * nx) / ma; a.vy -= (jn * ny) / ma }
          if (mc < 1e9) { c.vx += (jn * nx) / mc; c.vy += (jn * ny) / mc }
          if (-rvn > 220) thud(-rvn * 0.9)
          const tv = (c.vx - a.vx) * -ny + (c.vy - a.vy) * nx
          a.vr += tv * 0.05; c.vr += tv * 0.05
        }
      }
    }
    const thud = (v: number) => { const n = performance.now(); if (n - lastThud > 70) { lastThud = n; fx.thud(v / 1400) } }

    const frame = (now: number) => {
      if (!bs[0].el) attach()
      const t = (now - t0) / 1000
      const dtReal = Math.min(0.05, (now - last) / 1000); last = now
      // schedule
      const ct = t % CYCLE, cycleNo = Math.floor(t / CYCLE)
      let pi = 0
      for (let i = 0; i < PHASES.length; i++) if (ct >= PHASES[i].at) pi = i
      const key = cycleNo * 100 + pi
      if (key !== cyc) {
        cyc = key
        setPhase(pi)
        if (t > 6 || pi > 0) { fx.whoosh(); setToast({ k: ++tk, title: "Windows Update · Gravity", text: PHASES[pi].note }); setTimeout(() => setToast((x) => (x && x.k === tk ? null : x)), 6500) }
      }
      const P = PHASES[pi]
      const gmag = P.label === "Moon" ? 260 : 1700
      // release
      for (const b of bs) {
        if (!b.active && t >= b.releaseAt - 0.7) {
          b.shake = 1
          if (t >= b.releaseAt) { b.active = true; b.vx = (Math.random() - 0.5) * 120; b.vr = (Math.random() - 0.5) * 80 }
        }
      }
      const sub = 4
      for (let s = 0; s < sub; s++) step(dtReal / sub, P.g, gmag)
      for (const b of bs) {
        if (!b.el) continue
        const sx = !b.active && b.shake ? Math.sin(now / 28) * 3 : 0
        b.el.style.transform = `translate(${b.x - b.w / 2 + sx}px, ${b.y - b.h / 2}px) rotate(${b.rot}deg)`
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    const introT = setTimeout(() => setIntro(false), 5200)
    return () => {
      cancelAnimationFrame(raf); clearTimeout(introT); removeEventListener("resize", resize)
      removeEventListener("pointerdown", onDown); removeEventListener("pointermove", onMove); removeEventListener("pointerup", onUp); removeEventListener("pointercancel", onUp)
    }
  }, [])

  const P = PHASES[phase]
  return (
    <FullscreenPrank exitMessage="GRAVITY HAS BEEN DISABLED - IT WAS A PRANK!" className="cursor-default overflow-hidden bg-[#0a3f8c] font-segoe">
      <Win10Wallpaper />
      <Win10Taskbar tasks={["Windows Update"]} />

      {DEFS.map((d, i) => (
        <div key={i} data-gb={i} className="absolute left-0 top-0 z-[5] touch-none select-none will-change-transform" style={{ width: d.win ? 130 : 76, height: d.win ? 90 : 84 }}>
          {d.kind ? <DesktopIcon kind={d.kind} label={d.label} /> : (
            <div className="h-full w-full overflow-hidden rounded-md border border-[#1f6fb5] bg-white shadow-xl">
              <div className="flex h-[18px] items-center justify-between bg-[#1f6fb5] px-1.5 text-[10px] text-white"><span>{d.win}</span><span>✕</span></div>
              {d.win === "Calculator" ? <div className="grid grid-cols-4 gap-0.5 p-1">{Array.from({ length: 12 }, (_, k) => <span key={k} className="h-3.5 rounded-sm bg-[#e6e6e6]" />)}</div>
                : d.win === "Settings" ? <div className="space-y-1 p-1.5">{[70, 90, 55, 80].map((w, k) => <span key={k} className="block h-1.5 rounded bg-[#cfd8e3]" style={{ width: `${w}%` }} />)}</div>
                : <div className="space-y-1 p-1.5 text-[7px] leading-tight text-[#333]">dear diary,<br />the desktop is falling.<span className="block h-1.5 w-4/5 rounded bg-[#e1e6ee]" /></div>}
            </div>
          )}
        </div>
      ))}

      {/* gravity indicator */}
      <div className="absolute right-4 top-3 z-[8] rounded bg-black/55 px-3 py-1.5 text-[12px] text-white/90">
        Gravity: <b className="text-[#7fd0ff]">{P.arrow} {P.label}</b> <span className="text-white/60">· {P.mul}</span>
      </div>

      {intro && (
        <div className="absolute inset-0 z-[20] grid place-items-center bg-black/25" onPointerDown={(e) => { e.stopPropagation(); setIntro(false) }}>
          <div className="w-[min(470px,92vw)] border border-[#1f6fb5] bg-white text-[#1a1a1a] shadow-2xl">
            <div className="flex items-center justify-between bg-[#1f6fb5] px-3 py-1.5 text-[13px] text-white"><span>Windows Update</span><span>✕</span></div>
            <div className="p-5">
              <p className="text-[17px] font-semibold">Gravity Update (KB5006-G)</p>
              <p className="mt-2 text-[14px] leading-snug text-[#444]">Gravity has been enabled on this desktop. Your files, folders and windows will now obey the laws of physics. This update cannot be undone.</p>
              <div className="mt-4 h-2 overflow-hidden rounded bg-[#e1e1e1]"><div className="h-full w-full bg-[#0078d7] [animation:gu-load_5s_ease-out]" /></div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div key={toast.k} className="absolute bottom-[52px] right-3 z-[15] w-[min(340px,90vw)] border border-white/20 bg-[#1f1f1f]/95 p-3 text-white shadow-2xl [animation:gu-toast_.35s_ease-out]">
          <p className="text-[11px] text-white/60">{toast.title}</p>
          <p className="mt-0.5 text-[14px] leading-snug">{toast.text}</p>
        </div>
      )}
      <style>{`
        @keyframes gu-load { from { transform: translateX(-100%) } to { transform: translateX(0) } }
        @keyframes gu-toast { from { transform: translateX(120%) } to { transform: none } }
      `}</style>
    </FullscreenPrank>
  )
}
