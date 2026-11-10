"use client"

import { useEffect, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { DesktopIcon, Win10Taskbar, Win10Wallpaper } from "@/components/windows-ui"
import { sfx } from "@/lib/sfx"

type ActName = "normal" | "lazy" | "stare" | "nap" | "sign" | "shy" | "cheese" | "dance"
interface Act { name: ActName; dur: number; lines: [number, string][] }

const ACTS: Act[] = [
  { name: "normal", dur: 7, lines: [] },
  { name: "lazy", dur: 9, lines: [[0.05, "Hold on. I'm thinking about it."], [0.55, "You want me to go THERE? Right now?"]] },
  { name: "stare", dur: 6, lines: [[0.05, "Why are you looking at me like that?"], [0.6, "I can see you moving the mouse. I know what you're doing."]] },
  { name: "nap", dur: 13, lines: [[0.05, "Break time. 15 minutes. It's in the contract."], [0.6, "Zzz… no, I can hear you moving that. Stop it."]] },
  { name: "sign", dur: 12, lines: [[0.05, "I have been clicking since 1984. I want dental."], [0.6, "What do we want? FEWER DOUBLE-CLICKS."]] },
  { name: "shy", dur: 15, lines: [[0.03, "Don't look at me!"], [0.5, "Stay back! I mean it!"]] },
  { name: "cheese", dur: 13, lines: [[0.04, "Is that… cheese?"]] },
  { name: "dance", dur: 7, lines: [[0.05, "Nobody is clicking anything, so I'm dancing."]] },
]
const OUCH = ["OW. Do you MIND?", "That's my face.", "I'm unionized, you know.", "Do you click your mother like that?", "Again?! I just got here.", "I'm calling HR. HR is also me."]

export default function RogueCursor() {
  const [actIdx, setActIdx] = useState(0)
  const [say, setSay] = useState<string | null>(null)
  const [cheese, setCheese] = useState<{ x: number; y: number } | null>(null)
  const [eaten, setEaten] = useState(false)
  const act = ACTS[actIdx % ACTS.length]

  const el = useRef<HTMLDivElement>(null)
  const rotEl = useRef<HTMLDivElement>(null)
  const pupilL = useRef<SVGCircleElement>(null)
  const pupilR = useRef<SVGCircleElement>(null)
  const ptr = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const cornered = useRef(0)
  const eating = useRef(0)
  const actRef = useRef<ActName>("normal")
  const cheeseRef = useRef<{ x: number; y: number } | null>(null)
  const ouch = useRef(0)
  actRef.current = act.name
  cheeseRef.current = cheese

  // pointer + animation loop (all position work happens off React state)
  useEffect(() => {
    const w = window.innerWidth, h = window.innerHeight
    ptr.current = { x: w / 2, y: h / 2 }
    pos.current = { x: w / 2, y: h / 2 }
    const move = (e: PointerEvent) => { ptr.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener("pointermove", move)
    let raf = 0, last = performance.now(), t = 0
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt
      const W = window.innerWidth, H = window.innerHeight
      const p = pos.current, q = ptr.current
      const a = actRef.current
      let rot = 0
      const toward = (tx: number, ty: number, k: number) => { p.x += (tx - p.x) * Math.min(1, dt * k); p.y += (ty - p.y) * Math.min(1, dt * k) }
      if (a === "normal") { p.x = q.x; p.y = q.y }
      else if (a === "lazy") toward(q.x + Math.sin(t * 1.3) * 40, q.y + Math.cos(t * 1.7) * 30, 0.9)
      else if (a === "stare") { /* stays put */ }
      else if (a === "nap") rot = 82
      else if (a === "sign") toward(q.x - 60, q.y + 10, 2.6)
      else if (a === "dance") { toward(q.x, q.y, 2); rot = Math.sin(t * 9) * 25; p.y += Math.sin(t * 14) * 3 }
      else if (a === "shy") {
        const dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy) || 1
        if (cornered.current > 0) cornered.current -= dt
        else if (d < 260) {
          const sp = 640 * dt
          p.x += (dx / d) * sp; p.y += (dy / d) * sp
          const nx = Math.min(W - 40, Math.max(40, p.x)), ny = Math.min(H - 90, Math.max(40, p.y))
          const hit = nx !== p.x || ny !== p.y
          p.x = nx; p.y = ny
          if (hit && d < 140) { cornered.current = 3.5; setSay("Fine. Click me. I can't take it anymore.") }
        }
      } else if (a === "cheese") {
        const c = cheeseRef.current
        if (c) {
          if (eating.current > 0) { eating.current -= dt; if (eating.current <= 0) { setEaten(true); setCheese(null); setSay("Excuse me."); setTimeout(() => setSay("I'm lactose intolerant. Why did I do that."), 2600) } }
          else {
            const dx = c.x - p.x, dy = c.y - p.y, d = Math.hypot(dx, dy)
            if (d < 14) eating.current = 1.4
            else { p.x += (dx / d) * Math.min(d, 240 * dt); p.y += (dy / d) * Math.min(d, 240 * dt) }
          }
        }
      }
      if (el.current) el.current.style.transform = `translate(${p.x}px, ${p.y}px)`
      if (rotEl.current) rotEl.current.style.transform = `rotate(${rot}deg)`
      const ex = q.x - p.x, ey = q.y - p.y, ed = Math.hypot(ex, ey) || 1, ox = (ex / ed) * 1.6, oy = (ey / ed) * 1.6
      ;[pupilL.current, pupilR.current].forEach((e) => { if (e) { e.style.transform = `translate(${ox}px, ${oy}px)` } })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move) }
  }, [])

  // act scheduler + spoken lines
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    setSay(null)
    if (act.name === "cheese") {
      const W = window.innerWidth, H = window.innerHeight
      setEaten(false)
      setCheese({ x: 120 + Math.random() * (W - 240), y: 120 + Math.random() * (H - 280) })
    } else setCheese(null)
    if (act.name === "nap") sfx.beep(90)
    act.lines.forEach(([f, text]) => timers.push(setTimeout(() => setSay(text), f * act.dur * 1000)))
    timers.push(setTimeout(() => setActIdx((n) => { const nx = n + 1; return nx % ACTS.length === 0 ? 1 : nx }), act.dur * 1000))
    return () => timers.forEach(clearTimeout)
  }, [actIdx])

  const onDown = () => {
    sfx.click()
    if (actRef.current === "normal") return
    if (actRef.current === "nap") { setSay("OW. I was SLEEPING."); return }
    setSay(OUCH[ouch.current++ % OUCH.length])
  }

  return (
    <FullscreenPrank exitMessage="YOUR MOUSE IS FINE - IT WAS A PRANK!" className="cursor-none font-segoe" >
      <div className="absolute inset-0 cursor-none" onPointerDown={onDown}>
        <Win10Wallpaper />
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          <DesktopIcon kind="recycle" label="Recycle Bin" />
          <DesktopIcon kind="computer" label="This PC" />
          <DesktopIcon kind="folder" label="Documents" />
          <DesktopIcon kind="doc" label="Notes.txt" />
        </div>
        <Win10Taskbar />
        {cheese && !eaten && <svg className="absolute" style={{ left: cheese.x - 18, top: cheese.y - 14 }} width="36" height="28" viewBox="0 0 36 28" aria-hidden="true"><path d="M2 24 L34 24 L34 8 Q18 -2 2 12Z" fill="#facc15" stroke="#a16207" strokeWidth="1.5" /><circle cx="12" cy="17" r="2.5" fill="#ca8a04" /><circle cx="24" cy="13" r="2" fill="#ca8a04" /><circle cx="26" cy="20" r="1.6" fill="#ca8a04" /></svg>}
        <div ref={el} className="pointer-events-none absolute left-0 top-0" style={{ willChange: "transform" }}>
          <div ref={rotEl} style={{ transformOrigin: "2px 2px", transition: "transform .35s" }}>
          <svg width="40" height="56" viewBox="0 0 34 48" aria-hidden="true" style={{ overflow: "visible", filter: "drop-shadow(1px 2px 1px rgba(0,0,0,.4))" }}>
            <path d="M2 2 L2 38 L11 29 L17 43 L23 40 L17 27 L30 27 Z" fill="#fff" stroke="#111" strokeWidth="2.2" strokeLinejoin="round" />
            {act.name !== "normal" && (
              <>
                <circle cx="8" cy="13" r="3.8" fill="#fff" stroke="#111" strokeWidth="1" /><circle cx="15" cy="19" r="3.8" fill="#fff" stroke="#111" strokeWidth="1" />
                <circle ref={pupilL} cx="8" cy="13" r="1.7" fill="#111" /><circle ref={pupilR} cx="15" cy="19" r="1.7" fill="#111" />
              </>
            )}
          </svg>
          </div>
          {act.name === "sign" && (
            <div className="absolute -left-2 -top-[84px] -rotate-6">
              <div className="whitespace-nowrap border-2 border-slate-900 bg-white px-2 py-1 text-[13px] font-extrabold text-red-700 shadow-lg">FAIR CLICKS FOR ALL</div>
              <div className="mx-auto h-[52px] w-[4px] bg-amber-800" />
            </div>
          )}
          {act.name === "nap" && <div className="absolute -top-8 left-10 font-bold text-white [text-shadow:0_1px_3px_#000]" style={{ animation: "pk-z 2s ease-in-out infinite" }}>Z z z</div>}
          {say && <div key={say} className="absolute left-12 -top-14 w-max max-w-[260px] rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-[14px] font-medium text-slate-900 shadow-xl" style={{ animation: "pk-bub .25s ease both" }}>{say}</div>}
        </div>
      </div>
      <style>{`@keyframes pk-z{0%,100%{opacity:.3;transform:translateY(4px)}50%{opacity:1;transform:translateY(-6px)}}@keyframes pk-bub{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:none}}`}</style>
    </FullscreenPrank>
  )
}
