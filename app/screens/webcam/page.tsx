"use client"

import { useEffect, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { sfx } from "@/lib/sfx"
import { fx } from "@/lib/fx"

const CITIES = ["Reykjavik, Iceland", "Tallinn, Estonia", "Ulaanbaatar, Mongolia", "Lagos, Nigeria", "Valparaiso, Chile", "Tbilisi, Georgia", "Perth, Australia", "Medellin, Colombia"]
const LOGS = [
  "viewer_01 connected",
  "stream negotiated: 1280x720 @ 30fps",
  "microphone: not requested",
  "face model loaded",
  "motion detected",
  "snapshot saved (not really)",
  "viewer_02 connected",
  "bitrate stable 2.4 Mbps",
  "keyframe sent",
  "recording continues",
]
const pad = (n: number) => String(n).padStart(2, "0")
const oct = () => Math.floor(Math.random() * 223) + 1

/** A fake "remote camera viewer". The picture is generated: it never opens your real camera. */
export default function WebcamScreen() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const pointer = useRef({ x: 0.5, y: 0.5, moved: 0 })
  const [now, setNow] = useState<Date | null>(null)
  const [rec, setRec] = useState(0)
  const [meta, setMeta] = useState({ ip: "0.0.0.0", ip2: "0.0.0.0", city1: CITIES[0], city2: CITIES[1] })
  const [logs, setLogs] = useState<string[]>([])
  const [bitrate, setBitrate] = useState(2.4)
  const [toast, setToast] = useState(false)
  const [reveal, setReveal] = useState(false)
  const [face, setFace] = useState(96)

  useEffect(() => {
    setMeta({ ip: `${oct()}.${oct()}.${oct()}.${oct()}`, ip2: `${oct()}.${oct()}.${oct()}.${oct()}`, city1: CITIES[Math.floor(Math.random() * CITIES.length)], city2: CITIES[Math.floor(Math.random() * CITIES.length)] })
    setNow(new Date())
    const clock = setInterval(() => { setNow(new Date()); setRec((r) => r + 1); setBitrate(2.1 + Math.random() * 0.7); setFace(88 + Math.floor(Math.random() * 11)) }, 1000)
    let i = 0
    const log = setInterval(() => setLogs((l) => [...l.slice(-7), `${new Date().toLocaleTimeString("en-GB")}  ${LOGS[i++ % LOGS.length]}`]), 1700)
    const t1 = setTimeout(() => { setToast(true); sfx.click(); fx.squeak() }, 1800)
    const t2 = setTimeout(() => setReveal(true), 9000)
    const onMove = (e: PointerEvent) => { pointer.current = { x: e.clientX / innerWidth, y: e.clientY / innerHeight, moved: performance.now() } }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => { clearInterval(clock); clearInterval(log); clearTimeout(t1); clearTimeout(t2); window.removeEventListener("pointermove", onMove) }
  }, [])

  // The "camera": a dim room in night-vision green with sensor grain, breathing exposure and a tracker that follows you.
  useEffect(() => {
    const cv = canvas.current!
    const g = cv.getContext("2d")!
    const W = 320, H = 180
    cv.width = W; cv.height = H
    const room = document.createElement("canvas"); room.width = W; room.height = H
    const r = room.getContext("2d")!
    const bgGrad = r.createLinearGradient(0, 0, 0, H)
    bgGrad.addColorStop(0, "#1f2a24"); bgGrad.addColorStop(1, "#0f1612")
    r.fillStyle = bgGrad; r.fillRect(0, 0, W, H)
    r.fillStyle = "#26342c"; r.fillRect(0, H * 0.72, W, H * 0.28) // floor
    r.fillStyle = "#33463b"; r.fillRect(W * 0.08, H * 0.12, 62, 78); // window light
    r.fillStyle = "#4b6657"; r.fillRect(W * 0.08 + 4, H * 0.12 + 4, 54, 70)
    r.fillStyle = "#18221c"; r.fillRect(W * 0.08 + 30, H * 0.12 + 4, 3, 70); r.fillRect(W * 0.08 + 4, H * 0.12 + 38, 54, 3)
    r.fillStyle = "#141c17"; r.fillRect(W * 0.62, H * 0.2, 56, 100) // doorway
    r.fillStyle = "#1c2721"; r.fillRect(W * 0.62 + 4, H * 0.2 + 4, 48, 96)
    r.fillStyle = "#2c3d33"; r.fillRect(W * 0.34, H * 0.55, 90, 12); r.fillRect(W * 0.36, H * 0.67, 6, 20); r.fillRect(W * 0.34 + 78, H * 0.67, 6, 20) // desk
    r.fillStyle = "#3a5144"; r.fillRect(W * 0.4, H * 0.42, 34, 24); r.fillStyle = "#6d9a82"; r.fillRect(W * 0.4 + 3, H * 0.42 + 3, 28, 16) // a monitor glowing
    let raf = 0, tr = { x: 0.5, y: 0.45 }
    const frame = (ts: number) => {
      g.drawImage(room, 0, 0)
      const breathe = 0.9 + Math.sin(ts / 1700) * 0.08
      g.fillStyle = `rgba(120,255,170,${0.06 * breathe})`; g.fillRect(0, 0, W, H)
      const img = g.getImageData(0, 0, W, H)
      const d = img.data
      for (let i = 0; i < d.length; i += 4) {
        const n = (Math.random() - 0.5) * 46
        d[i] = Math.max(0, Math.min(255, d[i] * 0.55 + n * 0.6))
        d[i + 1] = Math.max(0, Math.min(255, d[i + 1] * 1.25 * breathe + n))
        d[i + 2] = Math.max(0, Math.min(255, d[i + 2] * 0.7 + n * 0.6))
      }
      g.putImageData(img, 0, 0)
      // scanline + vignette
      g.fillStyle = "rgba(0,0,0,.18)"; for (let y = 0; y < H; y += 2) g.fillRect(0, y, W, 1)
      const v = g.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.85)
      v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,.65)")
      g.fillStyle = v; g.fillRect(0, 0, W, H)
      // tracker follows the pointer (with lag); drifts when you stop moving
      const p = pointer.current
      const still = performance.now() - p.moved > 3000
      const tx = still ? 0.5 + Math.sin(ts / 1400) * 0.12 : p.x, ty = still ? 0.45 + Math.cos(ts / 1900) * 0.08 : p.y
      tr.x += (tx - tr.x) * 0.07; tr.y += (ty - tr.y) * 0.07
      const bw = 62, bh = 72, bx = Math.max(4, Math.min(W - bw - 4, tr.x * W - bw / 2)), by = Math.max(14, Math.min(H - bh - 14, tr.y * H - bh / 2))
      g.strokeStyle = still ? "#ffd400" : "#7cff9a"; g.lineWidth = 1.2
      const c = 9
      for (const [x0, y0, sx, sy] of [[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx, by + bh, 1, -1], [bx + bw, by + bh, -1, -1]] as const) {
        g.beginPath(); g.moveTo(x0 + c * sx, y0); g.lineTo(x0, y0); g.lineTo(x0, y0 + c * sy); g.stroke()
      }
      g.fillStyle = still ? "#ffd400" : "#7cff9a"; g.font = "8px monospace"; g.fillText(still ? "SEARCHING..." : "FACE", bx, by - 3)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  const stamp = now ? `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}  ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` : "----"
  const rt = `${pad(Math.floor(rec / 60))}:${pad(rec % 60)}`

  return (
    <FullscreenPrank exitMessage="WEBCAM DISABLED! IT WAS A PRANK (YOUR CAMERA WAS NEVER USED)" className="bg-[#050807] font-mono text-[#7cff9a]">
      <div className="mx-auto flex h-full max-w-[1280px] flex-col gap-3 p-3 sm:p-5">
        <div className="flex items-center justify-between text-[11px] tracking-widest sm:text-[12px]">
          <span className="flex items-center gap-2 text-white/85"><span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-[#ff2d2d]" /> REMOTE CAMERA VIEWER <span className="text-white/40">v2.4.1</span></span>
          <span className="text-white/50">SESSION ENCRYPTED · AES-256</span>
        </div>

        <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[1fr_300px]">
          <div className="relative min-h-0 overflow-hidden rounded-md border border-[#1d3a2a] bg-black">
            <canvas ref={canvas} className="h-full w-full object-cover [image-rendering:auto]" />
            <div className="pointer-events-none absolute inset-0 p-3 text-[11px] sm:p-4 sm:text-[13px]">
              <div className="flex items-start justify-between">
                <span className="flex items-center gap-2 rounded bg-black/55 px-2 py-1 text-white"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#ff2d2d]" /> REC {rt}</span>
                <span className="rounded bg-black/55 px-2 py-1 text-[#7cff9a]">CAM 01 · LIVE</span>
              </div>
              <div className="absolute inset-x-3 bottom-3 flex items-end justify-between sm:inset-x-4 sm:bottom-4">
                <span className="rounded bg-black/55 px-2 py-1 text-white/85">{stamp}</span>
                <span className="rounded bg-black/55 px-2 py-1">MATCH {face}% · TRACKING</span>
              </div>
            </div>
          </div>

          <aside className="hidden min-h-0 flex-col gap-3 text-[12px] lg:flex">
            <div className="rounded-md border border-[#1d3a2a] bg-[#07110c] p-3">
              <p className="mb-2 text-[10px] tracking-[0.25em] text-white/45">VIEWERS (2)</p>
              <p className="text-white/90">viewer_01 <span className="text-[#7cff9a]">●</span></p>
              <p className="text-white/45">{meta.ip} · {meta.city1}</p>
              <p className="mt-2 text-white/90">viewer_02 <span className="text-[#7cff9a]">●</span></p>
              <p className="text-white/45">{meta.ip2} · {meta.city2}</p>
            </div>
            <div className="rounded-md border border-[#1d3a2a] bg-[#07110c] p-3">
              <p className="mb-1 text-[10px] tracking-[0.25em] text-white/45">UPLINK</p>
              <p className="text-white">{bitrate.toFixed(1)} Mbps</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded bg-white/10"><div className="h-full bg-[#7cff9a] transition-all duration-700" style={{ width: `${(bitrate / 3) * 100}%` }} /></div>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden rounded-md border border-[#1d3a2a] bg-[#07110c] p-3">
              <p className="mb-2 text-[10px] tracking-[0.25em] text-white/45">LOG</p>
              {logs.map((l, i) => <p key={i} className="truncate text-[11px] text-[#5fd884]/85">{l}</p>)}
            </div>
          </aside>
        </div>

        <p className="text-center text-[11px] text-white/40 sm:text-[12px]">Someone is watching you right now.</p>
      </div>

      {/* "Camera in use" notification, like the operating system shows */}
      {toast && (
        <div className="absolute right-4 top-4 z-20 flex w-[min(340px,calc(100%-2rem))] items-start gap-3 rounded-lg border border-white/15 bg-[#2b2b2b] p-3.5 font-sans text-white shadow-2xl [animation:wc-in_.35s_ease]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/camera.webp" alt="" width={36} height={36} className="h-9 w-9 shrink-0 object-contain" />
          <div className="min-w-0 text-[13px]"><p className="font-semibold">Camera</p><p className="text-white/75">An unknown app is using your camera.</p><p className="mt-0.5 text-[11px] text-white/45">just now</p></div>
        </div>
      )}

      {reveal && (
        <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-green-900/95 px-5 py-3 text-center font-sans shadow-xl [animation:wc-in_.4s_ease]">
          <p className="text-green-200">Relax! This is fake. We cannot see you, and your camera was never used.</p>
          <p className="mt-0.5 text-xs text-green-300/80">The picture is generated. Press ESC to exit.</p>
        </div>
      )}
      <style>{`@keyframes wc-in { from { opacity: 0; transform: translateY(-8px) } to { opacity: 1; transform: none } }`}</style>
    </FullscreenPrank>
  )
}
