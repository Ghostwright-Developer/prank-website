"use client"

import { useEffect, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { DesktopBase, mulberry32 } from "@/components/damage-kit"

interface Px { x: number; y: number; w: number; h: number; c: string; glow: boolean }

const STUCK = ["#ff0000", "#00ff00", "#0000ff", "#ffffff", "#000000", "#ff00ff", "#00ffff", "#ffff00"]

/**
 * Stuck and dead pixels, drawn at real pixel size (about 1-2 device pixels) so
 * you have to look for them, like on a real monitor. Black ones only show on
 * the white page, bright ones show on dark areas.
 */
export default function DeadPixelsScreen() {
  const [px, setPx] = useState<Px[]>([])

  useEffect(() => {
    const build = () => {
      const r = mulberry32(5)
      const w = window.innerWidth
      const h = window.innerHeight
      const dpr = window.devicePixelRatio || 1
      const unit = Math.max(1, Math.round(2 / dpr)) // ~2 device pixels
      const out: Px[] = []
      // isolated stuck sub-pixels / pixels spread over the screen (most on the white page area)
      for (let i = 0; i < 26; i++) {
        const c = STUCK[Math.floor(r() * STUCK.length)]
        const sub = r() < 0.4 // a single stuck sub-pixel is a thin vertical bar
        out.push({ x: Math.floor(w * (0.08 + r() * 0.84)), y: Math.floor(h * (0.2 + r() * 0.66)), w: sub ? Math.max(1, Math.round(unit / 2)) : unit, h: unit, c, glow: c !== "#000000" && r() < 0.5 })
      }
      // one small cluster, like a bad patch of the panel
      const cx = Math.floor(w * 0.62)
      const cy = Math.floor(h * 0.47)
      for (let i = 0; i < 7; i++) {
        out.push({ x: cx + Math.floor((r() - 0.5) * 26), y: cy + Math.floor((r() - 0.5) * 22), w: unit, h: unit, c: STUCK[Math.floor(r() * 5)], glow: false })
      }
      // a few on the taskbar and wallpaper too
      for (let i = 0; i < 6; i++) out.push({ x: Math.floor(r() * w), y: Math.floor(h - 40 + r() * 36), w: unit, h: unit, c: STUCK[Math.floor(r() * 4)], glow: false })
      setPx(out)
    }
    build()
    window.addEventListener("resize", build)
    return () => window.removeEventListener("resize", build)
  }, [])

  return (
    <FullscreenPrank exitMessage="PIXELS REVIVED - IT WAS A PRANK!" className="cursor-none bg-black">
      <DesktopBase />
      {px.map((p, i) => (
        <div key={i} className="pointer-events-none absolute" style={{ left: p.x, top: p.y, width: p.w, height: p.h, background: p.c, boxShadow: p.glow ? `0 0 1px ${p.c}` : undefined }} />
      ))}
    </FullscreenPrank>
  )
}
