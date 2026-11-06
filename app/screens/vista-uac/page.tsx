"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

interface UAC { id: number; program: string; publisher: string; verified: boolean; file: string }

const PROGRAMS = [
  { program: "Windows Command Processor", publisher: "Microsoft Windows", verified: true, file: "C:\\Windows\\System32\\cmd.exe" },
  { program: "Registry Editor", publisher: "Microsoft Windows", verified: true, file: "C:\\Windows\\regedit.exe" },
  { program: "Host Process for Windows Services", publisher: "Microsoft Windows", verified: true, file: "C:\\Windows\\System32\\svchost.exe" },
  { program: "Windows Installer", publisher: "Microsoft Windows", verified: true, file: "C:\\Windows\\System32\\msiexec.exe" },
  { program: "setup.exe", publisher: "Unknown", verified: false, file: "C:\\Users\\Owner\\AppData\\Local\\Temp\\setup.exe" },
  { program: "update_helper.exe", publisher: "Unknown", verified: false, file: "C:\\Users\\Owner\\AppData\\Local\\Temp\\update_helper.exe" },
  { program: "Windows Defender", publisher: "Microsoft Windows", verified: true, file: "C:\\Program Files\\Windows Defender\\MSASCui.exe" },
]
const MAX = 10

export default function VistaUACScreen() {
  const [dialogs, setDialogs] = useState<UAC[]>([])
  const nextId = useRef(1)

  const spawn = useCallback((count = 1) => {
    const made: UAC[] = []
    for (let i = 0; i < count; i++) {
      made.push({ id: nextId.current++, ...PROGRAMS[Math.floor(Math.random() * PROGRAMS.length)] })
    }
    setDialogs((prev) => [...prev, ...made].slice(-MAX))
  }, [])

  useEffect(() => {
    spawn(1)
    const id = setInterval(() => spawn(1), 1800)
    return () => clearInterval(id)
  }, [spawn])

  const answer = (id: number) => {
    setDialogs((prev) => prev.filter((d) => d.id !== id))
    setTimeout(() => spawn(2), 350)
  }

  return (
    <FullscreenPrank exitMessage="PERMISSION GRANTED - IT WAS A PRANK!" className="cursor-default font-segoe">
      {/* Secure desktop: the dimmed desktop behind the dialog, as on Vista/7 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#2d7aa0,#0f3d5c_60%,#06202f)]" />
      <div className="absolute inset-0 bg-black/60" />
      {dialogs.map((d, i) => (
        <div
          key={d.id}
          className="absolute left-1/2 top-1/2 w-[min(460px,94vw)] border border-[#1a3b5a] bg-[#f0f0f0] shadow-[0_8px_40px_rgba(0,0,0,.7)]"
          style={{ transform: `translate(calc(-50% + ${(i % 5) * 22 - 44}px), calc(-50% + ${(i % 5) * 22 - 44}px))`, zIndex: d.id }}
        >
          <div className={`flex items-center gap-3 px-4 py-3 text-white ${d.verified ? "bg-gradient-to-r from-[#1c5d99] to-[#3a8bc8]" : "bg-gradient-to-r from-[#b8860b] to-[#e0a800]"}`}>
            <span className="grid h-9 w-9 place-items-center rounded-sm bg-white/90 text-[20px]">🛡️</span>
            <div className="text-[15px] font-semibold leading-tight">
              {d.verified ? "Windows needs your permission to continue" : "An unidentified program wants access to your computer"}
            </div>
          </div>
          <div className="p-4 text-[13px] text-black">
            <p className="mb-3">
              {d.verified
                ? "A program needs your permission before it can start."
                : "Don't run the program unless you know where it's from or you've used it before."}
            </p>
            <div className="mb-3 border border-[#b5b5b5] bg-white p-3">
              <div className="font-semibold">{d.program}</div>
              <div className="text-[12px] text-[#444]">{d.verified ? "Verified publisher" : "Publisher"}: {d.publisher}</div>
              <div className="break-all text-[12px] text-[#444]">File origin: Hard drive on this computer</div>
              <div className="break-all text-[12px] text-[#444]">{d.file}</div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => answer(d.id)} className="min-w-[90px] rounded-sm border border-[#707070] bg-gradient-to-b from-[#f2f2f2] to-[#d8d8d8] px-4 py-1">Allow</button>
              <button onClick={() => answer(d.id)} className="min-w-[90px] rounded-sm border border-[#707070] bg-gradient-to-b from-[#f2f2f2] to-[#d8d8d8] px-4 py-1">Cancel</button>
            </div>
          </div>
        </div>
      ))}
    </FullscreenPrank>
  )
}
