"use client"

import { useEffect, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { DesktopBase, mulberry32 } from "@/components/damage-kit"
import { sfx } from "@/lib/sfx"

type Pt = [number, number]

interface Spoke { pts: Pt[]; dist: number[] }

/** Radial cracks, ring cracks and shaded facets around one impact point. */
function drawImpact(ctx: CanvasRenderingContext2D, w: number, h: number, cx: number, cy: number, seed: number, scale: number) {
  const rnd = mulberry32(seed)
  const R = Math.hypot(w, h)
  const spokesN = Math.round((18 + rnd() * 10) * Math.min(1, 0.55 + scale))
  const spokes: Spoke[] = []

  const polyline = (x: number, y: number, ang: number, maxLen: number, nearStep = true): Pt[] => {
    const pts: Pt[] = [[x, y]]
    let r = 0
    let a = ang
    while (r < maxLen) {
      r += (nearStep && r < 60 ? 9 : 14) + rnd() * (nearStep && r < 60 ? 14 : 38)
      a += (rnd() - 0.5) * 0.13
      pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r])
    }
    return pts
  }

  const stroke = (pts: Pt[], lw: number, alpha: number) => {
    const path = new Path2D()
    pts.forEach(([x, y], i) => (i ? path.lineTo(x, y) : path.moveTo(x, y)))
    ctx.save()
    ctx.lineJoin = "round"
    ctx.lineCap = "round"
    ctx.translate(0.9, 0.9)
    ctx.strokeStyle = `rgba(0,0,0,${0.55 * alpha})`
    ctx.lineWidth = lw + 0.6
    ctx.stroke(path)
    ctx.restore()
    ctx.save()
    ctx.lineJoin = "round"
    ctx.lineCap = "round"
    ctx.strokeStyle = `rgba(255,255,255,${0.17 * alpha})`
    ctx.lineWidth = lw + 2.4
    ctx.stroke(path)
    ctx.strokeStyle = `rgba(255,255,255,${0.9 * alpha})`
    ctx.lineWidth = lw
    ctx.stroke(path)
    ctx.restore()
  }

  const baseAngle = rnd() * Math.PI * 2
  for (let i = 0; i < spokesN; i++) {
    const ang = baseAngle + (i / spokesN) * Math.PI * 2 + (rnd() - 0.5) * 0.3
    const len = R * scale * (0.28 + rnd() * 0.55)
    const pts = polyline(cx, cy, ang, len)
    const dist = pts.map(([x, y]) => Math.hypot(x - cx, y - cy))
    spokes.push({ pts, dist })
    stroke(pts, 1.1, 1)
    // branches
    pts.forEach(([x, y], j) => {
      if (j < 3 || rnd() > 0.16) return
      const bAng = ang + (rnd() < 0.5 ? -1 : 1) * (0.35 + rnd() * 0.55)
      const b = polyline(x, y, bAng, 40 + rnd() * 170 * scale, false)
      stroke(b, 0.8, 0.85)
      if (rnd() < 0.3) {
        const m = b[Math.floor(b.length / 2)]
        stroke(polyline(m[0], m[1], bAng + (rnd() < 0.5 ? -0.5 : 0.5), 30 + rnd() * 80, false), 0.6, 0.7)
      }
    })
  }

  const pointAt = (s: Spoke, rad: number): Pt | null => {
    for (let j = 1; j < s.pts.length; j++) {
      if (s.dist[j] >= rad) {
        const f = (rad - s.dist[j - 1]) / Math.max(1, s.dist[j] - s.dist[j - 1])
        return [s.pts[j - 1][0] + (s.pts[j][0] - s.pts[j - 1][0]) * f, s.pts[j - 1][1] + (s.pts[j][1] - s.pts[j - 1][1]) * f]
      }
    }
    return null
  }

  // Rings (spiderweb) plus shaded glass facets between rings.
  const radii = [28, 58, 100, 160, 240, 350, 480].map((r) => r * scale)
  for (let k = 0; k < radii.length; k++) {
    for (let i = 0; i < spokesN; i++) {
      const a = spokes[i]
      const b = spokes[(i + 1) % spokesN]
      const p1 = pointAt(a, radii[k])
      const p2 = pointAt(b, radii[k])
      if (!p1 || !p2) continue
      if (rnd() < 0.78) {
        const mid: Pt = [(p1[0] + p2[0]) / 2 + (rnd() - 0.5) * 12, (p1[1] + p2[1]) / 2 + (rnd() - 0.5) * 12]
        stroke([p1, mid, p2], 0.9, 0.9)
      }
      const q1 = k + 1 < radii.length ? pointAt(a, radii[k + 1]) : null
      const q2 = k + 1 < radii.length ? pointAt(b, radii[k + 1]) : null
      if (q1 && q2) {
        ctx.beginPath()
        ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.lineTo(q2[0], q2[1]); ctx.lineTo(q1[0], q1[1]); ctx.closePath()
        ctx.fillStyle = rnd() < 0.5 ? `rgba(255,255,255,${0.015 + rnd() * 0.07})` : `rgba(0,0,0,${0.03 + rnd() * 0.12})`
        ctx.fill()
      }
    }
  }

  // Impact: bright crushed glass, dark chip, fine dust.
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 34 * scale)
  g.addColorStop(0, "rgba(255,255,255,0.95)")
  g.addColorStop(0.4, "rgba(220,225,235,0.55)")
  g.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(cx, cy, 34 * scale, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  const spikes = 13
  for (let i = 0; i < spikes * 2; i++) {
    const a = (i / (spikes * 2)) * Math.PI * 2
    const rad = (i % 2 ? 4 : 8 + rnd() * 9) * scale
    ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad)
  }
  ctx.closePath()
  ctx.fillStyle = "rgba(12,12,16,0.85)"
  ctx.fill()
  ctx.strokeStyle = "rgba(255,255,255,0.9)"
  ctx.lineWidth = 1
  ctx.stroke()
  for (let i = 0; i < 160 * scale; i++) {
    const a = rnd() * Math.PI * 2
    const rad = Math.pow(rnd(), 1.6) * 90 * scale
    ctx.fillStyle = `rgba(255,255,255,${0.2 + rnd() * 0.6})`
    ctx.fillRect(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, rnd() < 0.8 ? 1 : 2, 1)
  }
}

export default function CrackedScreen() {
  const first = useRef<HTMLCanvasElement>(null)
  const second = useRef<HTMLCanvasElement>(null)
  const [stage, setStage] = useState(0)
  const [size, setSize] = useState({ w: 1280, h: 720 })

  useEffect(() => {
    const measure = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    measure()
    window.addEventListener("resize", measure)
    const a = setTimeout(() => { setStage(1); sfx.glass() }, 700)
    const b = setTimeout(() => { setStage(2); sfx.glass() }, 9000)
    return () => { window.removeEventListener("resize", measure); clearTimeout(a); clearTimeout(b) }
  }, [])

  const paint = (canvas: HTMLCanvasElement | null, build: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) => {
    if (!canvas) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.floor(size.w * dpr)
    canvas.height = Math.floor(size.h * dpr)
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, size.w, size.h)
    build(ctx, size.w, size.h)
  }

  useEffect(() => {
    if (stage >= 1) paint(first.current, (ctx, w, h) => drawImpact(ctx, w, h, w * 0.46, h * 0.4, 7, 1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage >= 1, size])
  useEffect(() => {
    if (stage >= 2) paint(second.current, (ctx, w, h) => drawImpact(ctx, w, h, w * 0.84, h * 0.72, 21, 0.45))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage >= 2, size])

  const ix = (size.w * 0.46) / size.w * 100
  const iy = 40

  return (
    <FullscreenPrank exitMessage="SCREEN REPAIRED - IT WAS A PRANK!" className="cursor-none bg-black">
      <DesktopBase />
      {stage >= 1 && (
        <>
          {/* LCD damage under the glass: ink bleed and dead lines spreading from the impact */}
          <div className="pointer-events-none absolute inset-0" style={{
            background: `radial-gradient(ellipse 15% 22% at ${ix}% ${iy}%, rgba(8,0,22,.96) 0, rgba(40,0,70,.75) 45%, rgba(120,0,160,0) 100%),
                         radial-gradient(ellipse 9% 30% at ${ix + 6}% ${iy + 8}%, rgba(0,0,0,.85) 0, rgba(0,0,0,0) 100%),
                         radial-gradient(ellipse 22% 12% at ${ix - 8}% ${iy + 12}%, rgba(30,0,60,.55) 0, rgba(30,0,60,0) 100%)`,
            filter: "blur(5px)",
          }} />
          <div className="pointer-events-none absolute inset-y-0" style={{ left: `${ix + 2}%`, width: "1px", background: "linear-gradient(#ff00d4,#00e0ff 55%,#00ff6a)", opacity: 0.9, boxShadow: "6px 0 0 rgba(0,255,106,.8), 14px 0 0 rgba(255,0,60,.8)" }} />
          <canvas ref={first} className="pointer-events-none absolute inset-0 h-full w-full" />
        </>
      )}
      {stage >= 2 && <canvas ref={second} className="pointer-events-none absolute inset-0 h-full w-full" />}
      {/* Glass sheen */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,.07)_0%,rgba(255,255,255,0)_32%,rgba(255,255,255,0)_70%,rgba(255,255,255,.04)_100%)]" />
      {stage === 1 && <div className="pointer-events-none absolute inset-0 animate-[flash_.35s_ease-out_forwards] bg-white" />}
      <style>{`@keyframes flash { from { opacity: .85 } to { opacity: 0 } }`}</style>
    </FullscreenPrank>
  )
}
