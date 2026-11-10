"use client"

import { useEffect, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { Win10Taskbar, Win10Wallpaper } from "@/components/windows-ui"
import { sfx } from "@/lib/sfx"

const POINTS = [
  "You currently have 94 Chrome tabs open. Tab 61 has not been looked at since 2022.",
  "You have clicked “Remind me tomorrow” on the same update 412 times.",
  "You have a file called final_FINAL_v3_reallyfinal_USE_THIS_ONE.docx. It is not final.",
  "You have used “Restart” to fix 38 problems and “Turn it off and on” to fix 41.",
  "You pressed Ctrl+S 600 times today. Nothing was open.",
  "You have 12,408 unread emails. I have read them. They are not good.",
]
const ANSWERS: Record<string, string> = {
  sorry: "Thank you. I have noted your apology. I have also noted the other 94 things.",
  defend: "Okay. You have 30 seconds. Please keep it under one tab.",
  nothing: "Silence. Classic. I'm going to need you to restart.",
}

export default function WindowsWantsToTalk() {
  const [shown, setShown] = useState(1)
  const [reply, setReply] = useState<string | null>(null)
  useEffect(() => {
    sfx.chime()
    const t = setInterval(() => setShown((n) => (n < POINTS.length ? (sfx.ding(), n + 1) : n)), 2800)
    return () => clearInterval(t)
  }, [])
  return (
    <FullscreenPrank secondary="#0a3a6b" exitMessage="WINDOWS IS NOT MAD AT YOU - IT WAS A PRANK!" className="cursor-default font-segoe">
      <Win10Wallpaper />
      <div className="absolute inset-x-0 top-0 bottom-12 flex items-center justify-center p-4">
        <div className="w-[min(620px,94vw)] overflow-hidden rounded-md border border-[#1c6ea4] bg-white shadow-[0_20px_60px_rgba(0,0,0,.55)]">
          <div className="flex items-center justify-between bg-[#0063b1] px-3 py-1.5 text-[13px] text-white"><span>Windows Feedback</span><span>✕</span></div>
          <div className="p-6 text-slate-900">
            <h1 className="text-[24px] font-light">We need to talk</h1>
            <p className="mt-1 text-[14px] text-slate-600">Windows has noticed some patterns in how you use this PC.</p>
            <ul className="mt-4 space-y-2.5 text-[14.5px]">
              {POINTS.slice(0, shown).map((p) => <li key={p} className="flex gap-2"><span className="mt-0.5 text-[#c42b1c]">●</span><span>{p}</span></li>)}
            </ul>
            {reply && <p className="mt-4 rounded bg-[#f3f3f3] px-3 py-2 text-[14px] text-[#0063b1]">{reply}</p>}
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button onClick={() => { sfx.ding(); setReply(ANSWERS.nothing) }} className="min-w-[110px] border border-slate-400 bg-slate-100 px-4 py-1.5 text-[14px] hover:bg-slate-200">Say nothing</button>
              <button onClick={() => { sfx.ding(); setReply(ANSWERS.defend) }} className="min-w-[110px] border border-slate-400 bg-slate-100 px-4 py-1.5 text-[14px] hover:bg-slate-200">I can explain</button>
              <button onClick={() => { sfx.ding(); setReply(ANSWERS.sorry) }} className="min-w-[110px] border border-[#0063b1] bg-[#0063b1] px-4 py-1.5 text-[14px] text-white hover:bg-[#0a74c6]">I&apos;m sorry</button>
            </div>
          </div>
        </div>
      </div>
      <Win10Taskbar />
    </FullscreenPrank>
  )
}
