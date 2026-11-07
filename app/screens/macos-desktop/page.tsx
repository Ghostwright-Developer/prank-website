"use client"

import { useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { Clock } from "@/components/clock"
import { MacWallpaper } from "@/components/lock-kit"
import { AppleLogo } from "@/components/prank-kit"

const DOCK: [string, string, string][] = [["Finder", "#2f8cf0", "#8fd0ff"], ["Launchpad", "#d0d4dc", "#f4f6fa"], ["Safari", "#2f9cf0", "#8fe0ff"], ["Messages", "#34c759", "#8ee8a0"], ["Mail", "#2f8cf0", "#9ad0ff"], ["Maps", "#58c27a", "#a8e8b8"], ["Photos", "#f5f5f7", "#ffffff"], ["Calendar", "#ffffff", "#f4f4f4"], ["Notes", "#ffd60a", "#fff0a0"], ["Music", "#fa2d48", "#ff8a98"], ["App Store", "#2f8cf0", "#6ac0ff"], ["Settings", "#8e8e93", "#c8c8cc"]]

export default function MacDesktopScreen() {
  const [bounce, setBounce] = useState<string | null>(null)
  const [alert, setAlert] = useState<string | null>(null)
  const open = (n: string) => { setBounce(n); setTimeout(() => { setBounce(null); setAlert(n) }, 900) }
  return (
    <FullscreenPrank exitMessage="YOU ARE STILL ON YOUR OWN COMPUTER - IT WAS A PRANK!" secondary="#1a1030" className="cursor-default font-sf text-white">
      <MacWallpaper />
      <div className="absolute inset-x-0 top-0 z-30 flex h-7 items-center gap-5 bg-black/25 px-4 text-[13px] backdrop-blur-xl">
        <AppleLogo size={14} color="#fff" />
        <b>Finder</b>
        <span className="hidden gap-5 md:flex"><span>File</span><span>Edit</span><span>View</span><span>Go</span><span>Window</span><span>Help</span></span>
        <span className="ml-auto flex items-center gap-4"><span>􀛨</span><span>⌁</span><span>🔍</span><Clock kind="date" options={{ weekday: "short", month: "short", day: "numeric" }} /><Clock /></span>
      </div>
      {alert && (
        <div className="absolute left-1/2 top-[34%] z-40 w-[300px] -translate-x-1/2 rounded-[14px] bg-[#2b2b2d]/95 p-5 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-[12px] bg-[#3a3a3c] text-[26px]">⚠️</div>
          <p className="text-[13px] font-semibold">“{alert}” quit unexpectedly.</p>
          <p className="mt-1 text-[11px] text-white/65">Click Reopen to open the application again. Click Report to see more detailed information and send a report to Apple.</p>
          <div className="mt-4 flex justify-center gap-2 text-[12px]"><button onClick={() => setAlert(null)} className="rounded-md bg-white/15 px-4 py-1">Ignore</button><button onClick={() => open(alert)} className="rounded-md bg-[#0a84ff] px-4 py-1">Reopen</button></div>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-2 z-30 flex justify-center">
        <div className="flex items-end gap-[6px] rounded-[18px] border border-white/20 bg-white/20 px-2 pb-1.5 pt-1.5 backdrop-blur-2xl">
          {DOCK.map(([n, a, b]) => (
            <button key={n} onClick={() => open(n)} title={n} className={`h-[48px] w-[48px] rounded-[11px] shadow-md transition-transform hover:-translate-y-2 hover:scale-110 ${bounce === n ? "animate-bounce" : ""}`} style={{ background: `linear-gradient(160deg, ${b}, ${a})` }} />
          ))}
        </div>
      </div>
    </FullscreenPrank>
  )
}
