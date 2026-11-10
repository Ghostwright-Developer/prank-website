"use client"

import { useEffect, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { DesktopIcon, Win11Taskbar, Win11Wallpaper } from "@/components/windows-ui"
import { fx } from "@/lib/fx"

type Kind = "computer" | "recycle" | "folder" | "browser" | "doc" | "network"
const ICONS: { kind: Kind; label: string; icon?: string }[] = [
  { kind: "computer", label: "This PC" },
  { kind: "recycle", label: "Recycle Bin" },
  { kind: "folder", label: "Documents", icon: "folder-docs" },
  { kind: "browser", label: "Browser" },
  { kind: "doc", label: "resume_FINAL_v7" },
  { kind: "network", label: "Network" },
  { kind: "doc", label: "taxes_2019", icon: "file-pdf" },
  { kind: "folder", label: "Photos", icon: "folder-pictures" },
  { kind: "folder", label: "Do Not Open" },
]
const FISH = [
  { c: "#ff9f1c", s: 1.0 }, { c: "#ffd166", s: 0.8 }, { c: "#4cc9f0", s: 1.25 },
  { c: "#ef476f", s: 0.9 }, { c: "#a0e426", s: 0.7 }, { c: "#f78c6b", s: 1.1 },
]

interface Dlg { title: string; body: string; ok: string; alt?: string }
const DIALOGS: Dlg[] = [
  { title: "Display Protection", body: "Moisture has been detected inside your display. For your safety, please unplug your monitor and step away from the desk.", ok: "Unplug monitor", alt: "Ignore" },
  { title: "Display Protection", body: "Your monitor appears to be filling with water. This is not covered by your warranty, which has also been flooded.", ok: "Okay", alt: "Get a towel" },
  { title: "Windows Security", body: "Windows has detected a shark. We do not know how it got in. Please remain calm and do not make sudden mouse movements.", ok: "I am calm" },
]
const REPLY: Record<string, string> = {
  "Unplug monitor": "Great idea. Unfortunately the monitor is wireless.",
  Ignore: "Ignoring it has not worked for anyone so far.",
  Okay: "The water level is 31%. Windows is staying positive.",
  "Get a towel": "The towel is also under water.",
  "I am calm": "Noted. The shark has also noted this.",
}

export default function FloodedDesktop() {
  const root = useRef<HTMLDivElement>(null)
  const water = useRef<HTMLDivElement>(null)
  const iconEls = useRef<(HTMLDivElement | null)[]>([])
  const fishEls = useRef<(HTMLDivElement | null)[]>([])
  const duck = useRef<HTMLDivElement>(null)
  const fin = useRef<HTMLDivElement>(null)
  const [dlg, setDlg] = useState<number | null>(null)
  const [reply, setReply] = useState("")
  const [quack, setQuack] = useState("")
  const [pct, setPct] = useState(0)
  const shown = useRef(new Set<number>())
  const ripples = useRef<{ x: number; y: number; k: number }[]>([])
  const [, force] = useState(0)

  useEffect(() => {
    const t0 = performance.now()
    let raf = 0
    let W = innerWidth, H = innerHeight
    const onR = () => { W = innerWidth; H = innerHeight }
    addEventListener("resize", onR)
    const ph = ICONS.map((_, i) => i * 1.7 + 0.4)
    const cur = ICONS.map(() => ({ ty: 0, tx: 0 }))
    const fs = FISH.map((f, i) => ({ x: Math.random() * W, dir: Math.random() < 0.5 ? 1 : -1, v: 30 + Math.random() * 60, y: 0.2 + Math.random() * 0.7, ph: i * 2.1 }))
    let duckX = W * 0.62, duckDir = -1
    let finX = -300, finDone = false
    let lastBubble = 0
    let lastPct = -1

    const level = (t: number) => {
      const p = Math.min(1, t / 105)
      return 0.74 * (1 - Math.pow(1 - p, 2))
    }
    const frame = (now: number) => {
      const t = (now - t0) / 1000
      const lv = level(t)
      const surface = H - lv * H
      if (water.current) water.current.style.height = `${lv * H + 40}px`
      const pc = Math.round(lv * 100)
      if (pc !== lastPct) { lastPct = pc; setPct(pc) }

      // dialogs on a schedule
      if (t > 4 && !shown.current.has(0)) { shown.current.add(0); setDlg(0); fx.pop() }
      if (t > 40 && !shown.current.has(1)) { shown.current.add(1); setDlg(1); setReply(""); fx.pop() }

      // icons: sink until the water is deep enough, then float
      ICONS.forEach((_, i) => {
        const el = iconEls.current[i]
        if (!el) return
        const col = Math.floor(i / 6), row = i % 6
        const baseY = 18 + row * 92 + 40
        const baseX = 12 + col * 92
        const deep = surface < baseY - 8
        const target = deep ? surface - baseY - 6 + Math.sin(t * 1.4 + ph[i]) * 7 : 0
        const spreadX = (140 + ((i * 0.381) % 1) * (W - 330)) - baseX
        const tx = deep ? spreadX * 0.9 + Math.sin(t * 0.35 + ph[i]) * 50 + Math.sin(t * 0.13 + ph[i] * 2) * 40 : 0
        cur[i].ty += (target - cur[i].ty) * 0.045
        cur[i].tx += (tx - cur[i].tx) * 0.03
        const rot = deep ? Math.sin(t * 0.9 + ph[i]) * 9 : 0
        el.style.transform = `translate(${cur[i].tx}px, ${cur[i].ty}px) rotate(${rot}deg)`
        el.style.opacity = deep ? "1" : "1"
      })

      // fish
      FISH.forEach((f, i) => {
        const el = fishEls.current[i]
        if (!el) return
        const s = fs[i]
        const depth = lv * H
        if (lv < 0.2 || depth < 110) { el.style.opacity = "0"; return }
        el.style.opacity = "1"
        s.x += s.dir * s.v * 0.016
        if (s.x > W + 60) s.dir = -1
        if (s.x < -60) s.dir = 1
        const y = 60 + s.y * Math.max(10, depth - 130) + Math.sin(t * 1.2 + s.ph) * 14
        el.style.transform = `translate(${s.x}px, ${y}px) scaleX(${s.dir})`
      })

      // duck
      if (duck.current) {
        if (lv > 0.1) {
          duckX += duckDir * 22 * 0.016
          if (duckX < 80) duckDir = 1
          if (duckX > W - 120) duckDir = -1
          duck.current.style.opacity = "1"
          duck.current.style.transform = `translate(${duckX}px, ${surface - 40 + Math.sin(t * 1.9) * 5}px) rotate(${Math.sin(t * 1.3) * 7}deg) scaleX(${-duckDir})`
        } else duck.current.style.opacity = "0"
      }

      // shark fin
      if (fin.current) {
        if (t > 85 && !finDone) {
          if (finX < -200 && t < 87) { fx.shark() }
          finX = Math.min(W + 300, -200 + (t - 85) * 110)
          if (finX >= W + 200) finDone = true
          fin.current.style.opacity = "1"
          fin.current.style.transform = `translate(${finX}px, ${surface - 46 + Math.sin(t * 3) * 3}px)`
        } else if (finDone) fin.current.style.opacity = "0"
        if (t > 92 && !shown.current.has(2)) { shown.current.add(2); setDlg(2); setReply("") }
      }

      // bubbles + drips sound
      if (now - lastBubble > 650 && lv > 0.05) { lastBubble = now; fx.bubble() }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", onR) }
  }, [])

  const onPointer = (e: React.PointerEvent) => {
    const k = Date.now() + Math.random()
    ripples.current.push({ x: e.clientX, y: e.clientY, k })
    force((n) => n + 1)
    fx.splash()
    setTimeout(() => { ripples.current = ripples.current.filter((r) => r.k !== k); force((n) => n + 1) }, 1100)
  }

  const answer = (label: string) => {
    setReply(REPLY[label] ?? "")
    setTimeout(() => setDlg(null), 2600)
  }
  const d = dlg !== null ? DIALOGS[dlg] : null

  return (
    <FullscreenPrank exitMessage="THE DESKTOP HAS DRIED OFF - IT WAS A PRANK!" className="cursor-default overflow-hidden bg-[#0a3f8c] font-segoe">
      <div ref={root} className="absolute inset-0" onPointerDown={onPointer}>
        <Win11Wallpaper variant="light2" />
        {ICONS.map((ic, i) => (
          <div key={i} ref={(el) => { iconEls.current[i] = el }} className="absolute z-[5]" style={{ left: 12 + Math.floor(i / 6) * 92, top: 18 + (i % 6) * 92 }}>
            <DesktopIcon kind={ic.kind} label={ic.label} icon={ic.icon} />
          </div>
        ))}

        {/* the leak */}
        <div className="absolute left-[58%] top-0 z-[4] h-2 w-10 -translate-x-1/2 rounded-b bg-[#1b1b1b]" />
        {[0, 1, 2].map((i) => (
          <span key={i} className="absolute left-[58%] top-2 z-[4] h-3 w-2 rounded-full bg-[#7fd3ff]/90" style={{ animation: `fd-drip 1.4s ${i * 0.47}s ease-in infinite` }} />
        ))}

        <Win11Taskbar dark={false} tasks={["Display Protection"]} />

        {/* water */}
        <div ref={water} className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] overflow-hidden" style={{ height: 0 }}>
          <svg className="absolute left-0 top-0 h-10 w-[200%] [animation:fd-wave_9s_linear_infinite]" viewBox="0 0 1600 40" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 20 Q100 0 200 20 T400 20 T600 20 T800 20 T1000 20 T1200 20 T1400 20 T1600 20 V40 H0Z" fill="rgba(80,180,240,.55)" />
          </svg>
          <svg className="absolute left-0 top-1 h-10 w-[200%] [animation:fd-wave_6s_linear_infinite_reverse]" viewBox="0 0 1600 40" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 22 Q100 6 200 22 T400 22 T600 22 T800 22 T1000 22 T1200 22 T1400 22 T1600 22 V40 H0Z" fill="rgba(30,120,210,.6)" />
          </svg>
          <div className="absolute inset-x-0 top-8 bottom-0 bg-gradient-to-b from-[rgba(30,120,210,.6)] via-[rgba(14,70,160,.72)] to-[rgba(5,28,80,.9)]" />
          <div className="absolute inset-0 top-8 opacity-30 [animation:fd-caustic_7s_linear_infinite]" style={{ backgroundImage: "radial-gradient(ellipse at 30% 40%, rgba(255,255,255,.35) 0 6%, transparent 18%), radial-gradient(ellipse at 70% 60%, rgba(255,255,255,.28) 0 5%, transparent 16%)", backgroundSize: "260px 160px" }} />

          {FISH.map((f, i) => (
            <div key={i} ref={(el) => { fishEls.current[i] = el }} className="absolute left-0 top-0 opacity-0" style={{ width: 70 * f.s, height: 36 * f.s }}>
              <svg viewBox="0 0 70 36" className="h-full w-full" aria-hidden="true">
                <path d="M2 18 L20 6 L20 30Z" fill={f.c} opacity=".9" />
                <ellipse cx="40" cy="18" rx="28" ry="13" fill={f.c} />
                <path d="M30 6 Q40 -2 50 8Z" fill={f.c} />
                <circle cx="55" cy="14" r="6.5" fill="#fff" /><circle cx="56.5" cy="14.5" r="3" fill="#111" />
                <path d="M62 22 q3 2 6 0" stroke="#7a2e00" strokeWidth="1.6" fill="none" />
              </svg>
            </div>
          ))}

          {Array.from({ length: 16 }, (_, i) => (
            <span key={i} className="absolute bottom-0 rounded-full border border-white/60 bg-white/10" style={{ left: `${(i * 37) % 100}%`, width: 6 + (i % 4) * 4, height: 6 + (i % 4) * 4, animation: `fd-rise ${6 + (i % 5) * 1.7}s ${i * 0.6}s linear infinite` }} />
          ))}
        </div>

        {/* duck + fin ride the surface */}
        <div ref={duck} className="absolute left-0 top-0 z-[7] h-[46px] w-[56px] cursor-pointer opacity-0" onPointerDown={(e) => { e.stopPropagation(); fx.squeak(); setQuack("SQUEAK"); setTimeout(() => setQuack(""), 900) }}>
          <svg viewBox="0 0 56 46" className="h-full w-full drop-shadow-md" aria-hidden="true">
            <ellipse cx="26" cy="32" rx="22" ry="12" fill="#ffd21f" />
            <path d="M44 28 q10 -2 10 -10 q0 -12 -10 -12 q-10 0 -10 12 q0 6 6 8z" fill="#ffd21f" />
            <circle cx="43" cy="14" r="2.2" fill="#111" />
            <path d="M50 17 l9 3 l-9 3z" fill="#ff8a00" />
            <path d="M12 30 q10 -10 22 0" fill="none" stroke="#e8a900" strokeWidth="2" />
          </svg>
        </div>
        {quack && <div className="pointer-events-none absolute left-1/2 top-[14%] z-[9] -translate-x-1/2 rounded bg-black/70 px-3 py-1 text-[22px] font-black tracking-widest text-[#ffd21f]">{quack}!</div>}
        <div ref={fin} className="absolute left-0 top-0 z-[7] h-[54px] w-[90px] opacity-0">
          <svg viewBox="0 0 90 54" className="h-full w-full" aria-hidden="true">
            <path d="M6 52 Q30 50 40 2 Q58 30 84 52Z" fill="#53606e" />
            <path d="M0 52 h90" stroke="rgba(255,255,255,.55)" strokeWidth="3" />
          </svg>
        </div>

        {ripples.current.map((r) => (
          <span key={r.k} className="pointer-events-none absolute z-[8] rounded-full border-2 border-white/70" style={{ left: r.x - 6, top: r.y - 6, width: 12, height: 12, animation: "fd-ripple 1.1s ease-out forwards" }} />
        ))}

        {/* water level readout */}
        <div className="absolute right-4 top-3 z-[9] rounded bg-black/55 px-3 py-1 text-[12px] tracking-wide text-white/90">Water level: {pct}%</div>
      </div>

      {/* Windows dialog */}
      {d && (
        <div className="absolute inset-0 z-[20] grid place-items-center" onPointerDown={(e) => e.stopPropagation()}>
          <div className="w-[min(440px,92vw)] border border-[#1f6fb5] bg-white text-[#1a1a1a] shadow-2xl">
            <div className="flex items-center justify-between bg-[#1f6fb5] px-3 py-1.5 text-[13px] text-white"><span>{d.title}</span><span>✕</span></div>
            <div className="flex gap-4 p-5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e5f3ff] text-[26px]">💧</div>
              <p className="text-[15px] leading-snug">{reply || d.body}</p>
            </div>
            <div className="flex justify-end gap-2 bg-[#f0f0f0] px-4 py-3">
              {!reply && <button className="border border-[#adadad] bg-[#e1e1e1] px-5 py-1 text-[13px] hover:border-[#0078d7] hover:bg-[#e5f1fb]" onClick={() => answer(d.ok)}>{d.ok}</button>}
              {!reply && d.alt && <button className="border border-[#adadad] bg-[#e1e1e1] px-5 py-1 text-[13px] hover:border-[#0078d7] hover:bg-[#e5f1fb]" onClick={() => answer(d.alt!)}>{d.alt}</button>}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fd-wave { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes fd-caustic { from { background-position: 0 0 } to { background-position: 260px 160px } }
        @keyframes fd-rise { from { transform: translateY(0); opacity: .9 } to { transform: translateY(-110vh); opacity: .2 } }
        @keyframes fd-drip { 0% { transform: translateY(0); opacity: 0 } 10% { opacity: 1 } 100% { transform: translateY(70vh); opacity: .9 } }
        @keyframes fd-ripple { from { transform: scale(1); opacity: .9 } to { transform: scale(9); opacity: 0 } }
      `}</style>
    </FullscreenPrank>
  )
}
