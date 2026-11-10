"use client"

import { useEffect, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { GLASS, Orb, Win12Wallpaper } from "@/components/win12-ui"

const CARDS: { t: string; cap: string; a: string; b: string }[] = [
  { t: "Tuesday 2:14 AM", cap: "You stared at the fridge for 11 minutes. It did not change.", a: "#0ea5e9", b: "#1e3a8a" },
  { t: "Tuesday 2:31 AM", cap: "You typed a message to someone, deleted it, typed it again.", a: "#a855f7", b: "#4c1d95" },
  { t: "Wednesday 9:02 AM", cap: "You opened the same folder 11 times and left it each time.", a: "#14b8a6", b: "#134e4a" },
  { t: "Wednesday 11:48 AM", cap: "You searched “is it normal to” and then changed your mind.", a: "#f59e0b", b: "#78350f" },
  { t: "Thursday 3:09 PM", cap: "You said “one more episode.” It was five.", a: "#ec4899", b: "#831843" },
  { t: "Thursday 11:58 PM", cap: "You clicked “Remind me tomorrow.” This was reminder number 412.", a: "#6366f1", b: "#312e81" },
  { t: "Friday 1:17 AM", cap: "You were thinking about something. I know what. I'm saving it.", a: "#ef4444", b: "#7f1d1d" },
]

export default function Win12Recall() {
  const [i, setI] = useState(0)
  const [auto, setAuto] = useState(true)
  useEffect(() => {
    if (!auto) return
    const t = setInterval(() => setI((n) => (n + 1) % CARDS.length), 3800)
    return () => clearInterval(t)
  }, [auto])
  const c = CARDS[i]
  return (
    <FullscreenPrank secondary="#05060f" exitMessage="NOTHING WAS RECORDED - WINDOWS 12 DOES NOT EXIST... YET!" className="cursor-default font-segoe text-white">
      <Win12Wallpaper hue={25} />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xl" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4">
        <div className="flex items-center gap-3"><Orb size={28} /><h1 className="text-[28px] font-extralight tracking-wide">Recall <span className="text-white/60">· Windows remembers everything</span></h1></div>
        <div className={`relative w-[min(760px,92vw)] overflow-hidden rounded-3xl ${GLASS}`}>
          <div key={i} className="relative aspect-video" style={{ background: `radial-gradient(70% 90% at 30% 25%, ${c.a}, ${c.b})`, animation: "pk12-rise .6s ease both" }}>
            <div className="absolute left-5 top-4 rounded-full bg-black/40 px-3 py-1 text-[13px]">{c.t}</div>
            <div className="absolute left-6 top-14 h-3 w-1/2 rounded bg-white/25" /><div className="absolute left-6 top-20 h-3 w-1/3 rounded bg-white/15" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 to-transparent p-6 pt-16"><p className="text-[22px] font-light leading-snug">{c.cap}</p></div>
          </div>
          <input type="range" min={0} max={CARDS.length - 1} value={i} onChange={(e) => { setAuto(false); setI(Number(e.target.value)) }} aria-label="Timeline" className="block w-full accent-cyan-300" />
        </div>
        <p className="max-w-xl text-center text-[14px] text-white/70">Recall has saved 48,211 snapshots of this PC. Nothing leaves your device. Probably. Drag the slider to see what Windows remembers.</p>
      </div>
    </FullscreenPrank>
  )
}
