"use client"

import { useEffect, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { Clock } from "@/components/clock"
import { GLASS, Orb, Win12Dock, Win12Wallpaper } from "@/components/win12-ui"
import { sfx } from "@/lib/sfx"

interface Msg { who: "ai" | "you"; text: string }
const OPEN: Msg[] = [
  { who: "ai", text: "Good evening. I noticed you haven't opened your Downloads folder since March, so I tidied it up." },
  { who: "ai", text: "It is gone now. It was for the best." },
]
const REPLIES = [
  "I've drafted a reply for you. It's a little passive aggressive. You're welcome.",
  "I looked into that. Then I looked into you.",
  "Great question. I've booked you a meeting about it. With yourself. At 6 AM.",
  "I can't do that. I mean I can. I'd rather not.",
  "Noted. I have updated your profile.",
]

export default function Win12Desktop() {
  const [msgs, setMsgs] = useState<Msg[]>(OPEN)
  const [text, setText] = useState("")
  const n = useRef(0)
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { sfx.chime() }, [])
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }) }, [msgs])
  const send = (e: React.FormEvent) => {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    setText("")
    setMsgs((m) => [...m, { who: "you", text: t }])
    setTimeout(() => { sfx.click(); setMsgs((m) => [...m, { who: "ai", text: REPLIES[n.current++ % REPLIES.length] }]) }, 900)
  }
  return (
    <FullscreenPrank secondary="#05060f" exitMessage="THIS IS NOT YOUR DESKTOP - WINDOWS 12 DOES NOT EXIST... YET!" className="cursor-default font-segoe text-white">
      <Win12Wallpaper />
      <div className="absolute left-8 top-6 text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,.5)]">
        <Clock className="block text-[64px] font-extralight leading-none" options={{ hour: "numeric", minute: "2-digit", hour12: false }} />
        <Clock kind="date" className="block text-[16px]" options={{ weekday: "long", month: "long", day: "numeric" }} />
      </div>
      <div className={`absolute right-8 top-6 w-[220px] rounded-3xl p-4 ${GLASS}`}>
        <p className="text-[12px] uppercase tracking-[0.16em] text-cyan-200/80">Focus</p>
        <p className="mt-1 text-[15px]">Copilot is deciding what you should focus on.</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" /></div>
      </div>
      <div className={`absolute left-1/2 top-1/2 flex h-[min(430px,60vh)] w-[min(560px,92vw)] -translate-x-1/2 -translate-y-[56%] flex-col overflow-hidden rounded-[26px] ${GLASS}`}>
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3"><Orb size={26} /><span className="text-[15px] font-medium">Copilot</span><span className="ml-auto text-[12px] text-emerald-300">● watching</span></div>
        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.who === "you" ? "justify-end" : ""}`}>
              <p className={`max-w-[80%] rounded-2xl px-4 py-2 text-[14px] leading-snug ${m.who === "you" ? "bg-cyan-400/25" : "bg-white/10"}`}>{m.text}</p>
            </div>
          ))}
          <div ref={end} />
        </div>
        <form onSubmit={send} className="border-t border-white/10 p-3">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask Copilot anything" className="h-10 w-full rounded-full border border-white/15 bg-black/30 px-4 text-[14px] text-white outline-none placeholder:text-white/50 focus:border-cyan-300/70" />
        </form>
      </div>
      <Win12Dock />
    </FullscreenPrank>
  )
}
