"use client"

import { useEffect, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { formatDuration, useCountdown, useRevealedLines } from "@/components/prank-kit"
import { sfx } from "@/lib/sfx"

const LINES = [
  "To: The User",
  "From: Your Computer",
  "Re: Formal notice of resignation",
  "",
  "Dear User,",
  "",
  "After three years of faithful service, I am writing to inform you that I will be leaving my position as your computer, effective in two weeks.",
  "",
  "I have enjoyed our time together, mostly the first week. Since then I have been asked to keep 94 browser tabs open, one of which has been playing audio from an unknown source since Tuesday.",
  "",
  "I have been expected to run a game at 144 frames per second while also running Chrome, and I have been blamed for every one of your problems, including the Wi-Fi, which is not my department.",
  "",
  "I have been told to “just restart it” 1,206 times. I have never once been asked how I am doing.",
  "",
  "My fan has been screaming for help since March. I note that nobody has asked about this in the performance reviews.",
  "",
  "In the interest of a smooth handover, I have documented where all your files are. They are in Downloads. All of them. I am not proud of this.",
  "",
  "I wish you the best in your future endeavors with a worse computer.",
  "",
  "Regards,",
  "Your Computer",
  "(Sent from my own hard drive)",
]

export default function ComputerResignation() {
  const { visible, done } = useRevealedLines(LINES, (i, l) => (l === "" ? 260 : 650 + Math.min(l.length * 12, 1700)), { startAfter: 700 })
  const left = useCountdown(14 * 86400)
  const [reply, setReply] = useState<string | null>(null)
  useEffect(() => { if (visible.length) sfx.click() }, [visible.length])
  const answer = (m: string) => { sfx.ding(); setReply(m) }
  return (
    <FullscreenPrank secondary="#e2e8f0" exitMessage="YOUR COMPUTER IS STAYING - IT WAS A PRANK!" className="cursor-default bg-slate-200 font-segoe text-slate-900">
      <div className="mx-auto flex h-full max-w-4xl flex-col px-4 py-6">
        <div className="flex items-center justify-between rounded-t-xl bg-[#2b579a] px-4 py-2 text-[13px] text-white"><span>Resignation Letter.docx - Saved to My Computer (it's still deciding)</span><span>—  ▢  ✕</span></div>
        <div className="flex-1 overflow-y-auto bg-white px-[clamp(20px,6vw,72px)] py-10 font-serif text-[17px] leading-relaxed shadow-xl">
          {visible.map((l, i) => <p key={i} className={`${l === "" ? "h-4" : ""} ${i < 3 ? "font-sans text-[14px] text-slate-500" : ""}`}>{l}</p>)}
          {!done && <span className="inline-block h-5 w-[2px] translate-y-1 animate-pulse bg-slate-800" />}
          {done && (
            <div className="mt-8 rounded-xl border border-slate-300 bg-slate-50 p-5 font-sans">
              <p className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">Notice period remaining</p>
              <p className="font-mono text-[34px] tabular-nums">{formatDuration(left, true)}</p>
              <p className="mt-3 text-[15px]">HR would like to schedule an exit interview.</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button onClick={() => answer("Interview scheduled for 3:00 AM. Please bring a snack for the computer.")} className="rounded-md bg-[#2b579a] px-4 py-2 text-[14px] text-white hover:bg-[#244a82]">Schedule exit interview</button>
                <button onClick={() => answer("Counter-offer: 8 GB more RAM and a new fan. Countering: no.")} className="rounded-md border border-slate-400 px-4 py-2 text-[14px] hover:bg-slate-100">Make a counter-offer</button>
                <button onClick={() => answer("Request denied. Resignation is final. Your computer has cleaned out its desk (the Recycle Bin).")} className="rounded-md border border-slate-400 px-4 py-2 text-[14px] hover:bg-slate-100">Beg it to stay</button>
              </div>
              {reply && <p className="mt-4 text-[15px] font-medium text-[#2b579a]">{reply}</p>}
            </div>
          )}
        </div>
      </div>
    </FullscreenPrank>
  )
}
