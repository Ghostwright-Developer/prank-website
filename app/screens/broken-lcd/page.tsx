"use client"

import { useEffect, useMemo, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { DesktopBase, mulberry32 } from "@/components/damage-kit"

const LINE_COLORS = ["#ff00d4", "#00e5ff", "#00ff5a", "#ffffff", "#ff2a2a", "#2a4dff", "#fff200"]

/** A failed panel: stuck colored columns, dead black columns, a corrupted band and a bleeding corner. */
export default function BrokenLcdScreen() {
  const [flicker, setFlicker] = useState(false)
  const lines = useMemo(() => {
    const r = mulberry32(11)
    const out: { x: number; w: number; c: string; o: number }[] = []
    // a main cluster of colored columns that spread from one failed driver chip
    const base = 63 + r() * 3
    for (let i = 0; i < 9; i++) out.push({ x: base + i * (0.22 + r() * 0.28), w: 1 + Math.floor(r() * 3), c: LINE_COLORS[Math.floor(r() * LINE_COLORS.length)], o: 0.75 + r() * 0.25 })
    // scattered single stuck columns
    for (let i = 0; i < 7; i++) out.push({ x: 4 + r() * 56, w: 1 + Math.floor(r() * 2), c: LINE_COLORS[Math.floor(r() * LINE_COLORS.length)], o: 0.7 + r() * 0.3 })
    return out
  }, [])
  const dead = useMemo(() => [[18.4, 3], [18.9, 1], [41.2, 2], [77.5, 6], [78.6, 3]] as const, [])

  useEffect(() => {
    // the panel flickers every now and then, like a failing connection
    const t = setInterval(() => {
      if (Math.random() < 0.35) {
        setFlicker(true)
        setTimeout(() => setFlicker(false), 90 + Math.random() * 140)
      }
    }, 2600)
    return () => clearInterval(t)
  }, [])

  return (
    <FullscreenPrank exitMessage="DISPLAY RESTORED - IT WAS A PRANK!" className="cursor-none bg-black">
      <DesktopBase />

      {/* corrupted band: the same image shifted and color-shifted */}
      <div className="absolute inset-0" style={{ clipPath: "inset(0 31% 0 56%)", transform: "translateX(-7px)", filter: "hue-rotate(75deg) saturate(2.2) contrast(1.15)" }}>
        <DesktopBase />
      </div>
      <div className="absolute inset-0" style={{ clipPath: "inset(36% 0 51% 0)", transform: "translateX(14px)", filter: "contrast(1.25) saturate(1.6)" }}>
        <DesktopBase />
      </div>

      {/* dead panel region on the right: stripes of stuck sub-pixels */}
      <div className="absolute inset-y-0 right-0 w-[17%]" style={{ background: "repeating-linear-gradient(90deg,#ff00e1 0 2px,#00ff66 2px 4px,#0a14ff 4px 6px,#000 6px 9px,#00f0ff 9px 10px,#fff 10px 11px,#000 11px 14px)", opacity: flicker ? 0.35 : 0.97 }} />
      <div className="absolute inset-y-0 right-[17%] w-[6px] bg-gradient-to-r from-transparent to-black/70" />

      {/* stuck columns */}
      {lines.map((l, i) => (
        <div key={i} className="absolute inset-y-0" style={{ left: `${l.x}%`, width: `${l.w}px`, background: l.c, opacity: flicker ? l.o * 0.4 : l.o, boxShadow: `0 0 3px ${l.c}` }} />
      ))}
      {dead.map(([x, w], i) => <div key={i} className="absolute inset-y-0 bg-black" style={{ left: `${x}%`, width: `${w}px` }} />)}

      {/* pressure damage: ink bleed in the top-left corner with a colored fringe */}
      <div className="pointer-events-none absolute left-0 top-0 h-[46%] w-[26%]" style={{
        background: "radial-gradient(ellipse 80% 90% at 0% 0%, #000 0, rgba(6,0,20,.96) 28%, rgba(50,0,110,.7) 52%, rgba(0,160,255,.28) 66%, rgba(255,0,150,.18) 74%, rgba(0,0,0,0) 86%)",
        filter: "blur(3px)", clipPath: "polygon(0 0,100% 0,92% 24%,100% 38%,84% 58%,90% 76%,60% 100%,0 100%)",
      }} />
      {/* a horizontal tear of dark pixels near the bottom */}
      <div className="pointer-events-none absolute inset-x-0 top-[78%] h-[3px] bg-black/80" />
      <div className="pointer-events-none absolute inset-x-0 top-[78.4%] h-px bg-[#00e5ff]/60" />

      {flicker && <div className="pointer-events-none absolute inset-0 bg-black/55" />}
    </FullscreenPrank>
  )
}
