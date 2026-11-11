"use client"

import { useEffect, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { sfx } from "@/lib/sfx"

const pad = (n: number) => String(n).padStart(2, "0")
const oct = () => Math.floor(Math.random() * 223) + 1

/**
 * "Live Camera Mirror": the browser asks for the camera, and if you allow it you see yourself with a
 * surveillance overlay. The picture is processed only inside this page: nothing is recorded or sent.
 */
export default function WebcamLive() {
  const video = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<"asking" | "live" | "denied">("asking")
  const [rec, setRec] = useState(0)
  const [viewers, setViewers] = useState(2)
  const [ip, setIp] = useState("0.0.0.0")
  const [box, setBox] = useState({ x: 50, y: 42, s: 1 })
  const stream = useRef<MediaStream | null>(null)
  // The permission prompt can pull the browser out of fullscreen: that must not count as "leaving".
  const holdUntil = useRef(Date.now() + 120000)

  useEffect(() => {
    setIp(`${oct()}.${oct()}.${oct()}.${oct()}`)
    let dead = false
    ;(async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported")
        const st = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
        if (dead) { st.getTracks().forEach((t) => t.stop()); return }
        stream.current = st
        holdUntil.current = Date.now() + 4000
        if (video.current) { video.current.srcObject = st; void video.current.play().catch(() => {}) }
        setState("live"); sfx.click()
      } catch {
        holdUntil.current = Date.now() + 4000
        if (!dead) setState("denied")
      }
    })()
    return () => { dead = true; stream.current?.getTracks().forEach((t) => t.stop()) }
  }, [])

  useEffect(() => {
    if (state !== "live") return
    const a = setInterval(() => setRec((r) => r + 1), 1000)
    const b = setInterval(() => setViewers((v) => Math.max(1, Math.min(9, v + (Math.random() < 0.5 ? 1 : -1)))), 3500)
    const c = setInterval(() => setBox({ x: 46 + Math.random() * 8, y: 38 + Math.random() * 8, s: 0.94 + Math.random() * 0.12 }), 900)
    return () => { clearInterval(a); clearInterval(b); clearInterval(c) }
  }, [state])

  return (
    <FullscreenPrank holdFullscreen={() => Date.now() < holdUntil.current} exitMessage="THE CAMERA WAS ONLY EVER SHOWING YOU TO YOU - IT WAS A PRANK!" className="bg-black font-mono text-white">
      <video ref={video} playsInline muted className={`absolute inset-0 h-full w-full -scale-x-100 object-cover ${state === "live" ? "opacity-100" : "opacity-0"}`} />
      {state === "live" && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,.65))]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background:repeating-linear-gradient(0deg,#000_0_1px,transparent_1px_3px)]" />
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded bg-black/60 px-2.5 py-1 text-[13px]"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#ff2d2d]" /> REC {pad(Math.floor(rec / 60))}:{pad(rec % 60)}</div>
          <div className="absolute right-4 top-4 rounded bg-black/60 px-2.5 py-1 text-right text-[12px]"><p className="text-[#ff6b6b]">{viewers} VIEWERS</p><p className="text-white/55">{ip}</p></div>
          <div className="pointer-events-none absolute h-[34vmin] w-[28vmin] rounded-sm border border-[#7cff9a]/80 transition-all duration-700" style={{ left: `${box.x}%`, top: `${box.y}%`, transform: `translate(-50%,-50%) scale(${box.s})` }}>
            <span className="absolute -top-5 left-0 text-[11px] text-[#7cff9a]">FACE · 99%</span>
          </div>
          <p className="absolute inset-x-0 bottom-14 text-center text-[clamp(16px,2.4vw,26px)] font-semibold tracking-wide text-white [text-shadow:0_2px_12px_#000]">Someone is watching you right now.</p>
          <p className="absolute inset-x-4 bottom-4 text-center font-sans text-[11px] text-white/55">This is a prank. Your camera picture stays in this window: nothing is recorded or sent anywhere. Press ESC to exit.</p>
        </>
      )}
      {state === "asking" && (
        <div className="grid h-full place-items-center px-6 text-center font-sans"><div><p className="text-xl font-semibold">Connecting to camera…</p><p className="mt-2 text-sm text-white/55">Your browser will ask for permission. You can say no.</p></div></div>
      )}
      {state === "denied" && (
        <div className="grid h-full place-items-center px-6 text-center font-sans">
          <div className="max-w-md"><p className="text-[clamp(28px,5vw,46px)] font-bold text-[#7cff9a]">Camera blocked.</p><p className="mt-3 text-white/80">Good call. That was smart. Nobody is watching you, and this was a prank.</p><p className="mt-5 text-xs text-white/45">Press ESC to exit.</p></div>
        </div>
      )}
    </FullscreenPrank>
  )
}
