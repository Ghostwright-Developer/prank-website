"use client"

import { useEffect, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { useBlink, useBelievableProgress } from "@/components/prank-kit"

// MS-DOS 6.x / Windows 9x "format c:" session. Stalls at 99% like a dying drive.
const INTRO = [
  "C:\\>format c:",
  "",
  "WARNING, ALL DATA ON NON-REMOVABLE DISK",
  "DRIVE C: WILL BE LOST!",
  "Proceed with Format (Y/N)?",
]

export default function FormatScreen() {
  const [typedY, setTypedY] = useState(false)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const a = setTimeout(() => setTypedY(true), 2200)
    const b = setTimeout(() => setStarted(true), 3200)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [])
  const pct = useBelievableProgress({ from: 0, max: 99, perSecond: 1.6, stalls: [36, 71, 94, 99], tickMs: 200 })
  const on = useBlink()
  const shown = started ? Math.min(99, Math.floor(pct)) : 0
  return (
    <FullscreenPrank exitMessage="DRIVE C: IS SAFE - IT WAS A PRANK!" className="cursor-none bg-black font-dos text-[#c8c8c8]">
      <div className="h-full p-6 text-[clamp(16px,2.2vw,24px)] leading-[1.2]">
        {INTRO.map((l, i) => <div key={i} className="whitespace-pre">{l || "\u00a0"}</div>)}
        {typedY ? <div>Y</div> : <div className={on ? "bg-[#c8c8c8]" : ""}>&nbsp;</div>}
        {started && (
          <>
            <div className="mt-4">Checking existing disk format.</div>
            <div>Verifying 2,047.99M</div>
            <div className="mt-3">Formatting {shown} percent complete.</div>
            <div className={on ? "bg-[#c8c8c8] w-3" : "w-3"}>&nbsp;</div>
          </>
        )}
      </div>
    </FullscreenPrank>
  )
}
