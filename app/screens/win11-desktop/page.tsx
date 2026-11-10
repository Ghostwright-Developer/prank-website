"use client"

import { useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { DesktopIcon, Win11Taskbar, Win11Wallpaper } from "@/components/windows-ui"
import { Avatar } from "@/components/lock-kit"

const PINNED: [string, string][] = [["Edge", "#0078d4"], ["Word", "#2b579a"], ["Excel", "#217346"], ["PowerPoint", "#d24726"], ["Mail", "#0f6cbd"], ["Calendar", "#0f6cbd"], ["Photos", "#8764b8"], ["Settings", "#6b7280"], ["Store", "#0078d4"], ["Calculator", "#4b5563"], ["Clock", "#3b82f6"], ["Notepad", "#0ea5e9"]]

export default function Win11DesktopScreen() {
  const [menu, setMenu] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const say = (m: string) => { setToast(m); setMenu(false); setTimeout(() => setToast(null), 2600) }
  return (
    <FullscreenPrank exitMessage="YOU ARE STILL ON YOUR OWN COMPUTER - IT WAS A PRANK!" secondary="#0b1224" className="cursor-default font-segoe">
      <Win11Wallpaper />
      <div className="absolute left-2 top-2 flex flex-col gap-1">
        <DesktopIcon kind="recycle" label="Recycle Bin" />
        <DesktopIcon kind="browser" label="Microsoft Edge" />
        <DesktopIcon kind="folder" label="Documents" />
      </div>
      {menu && (
        <div className="absolute bottom-[56px] left-1/2 z-40 w-[min(600px,94vw)] -translate-x-1/2 rounded-[10px] border border-white/10 bg-[#202020]/92 p-6 text-white shadow-2xl backdrop-blur-xl">
          <div className="mb-4 rounded-full bg-black/30 px-4 py-2 text-[13px] text-white/70">⌕ &nbsp;Search for apps, settings, and documents</div>
          <div className="mb-2 text-[13px] font-semibold">Pinned</div>
          <div className="grid grid-cols-6 gap-3">
            {PINNED.map(([n, c]) => (
              <button key={n} onClick={() => say(`${n} is not available right now. Try again later.`)} className="flex flex-col items-center gap-1 rounded p-2 text-[11px] hover:bg-white/10">
                <span className="h-9 w-9 rounded-[8px]" style={{ background: c }} />{n}
              </button>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[13px]">
            <span className="flex items-center gap-3"><Avatar size={30} bg="#5b6b85" />User</span>
            <button onClick={() => say("Windows can't shut down right now.")} className="text-[18px]">⏻</button>
          </div>
        </div>
      )}
      {toast && <div className="absolute bottom-[64px] right-4 z-50 w-[300px] rounded-lg border border-white/10 bg-[#2b2b2b] p-4 text-[13px] text-white shadow-xl">{toast}</div>}
      <div onClick={() => setMenu((m) => !m)}><Win11Taskbar dark={false} /></div>
    </FullscreenPrank>
  )
}
