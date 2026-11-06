"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"
import { AppleLogo, useBelievableProgress } from "@/components/prank-kit"

export default function MacosUpdateScreen() {
  const pct = useBelievableProgress({ from: 14, max: 97, perSecond: 0.25, stalls: [33, 68, 91] })
  const mins = Math.max(2, Math.round(((100 - pct) / 100) * 38))
  return (
    <FullscreenPrank exitMessage="UPDATE CANCELLED - IT WAS A PRANK!" className="cursor-none bg-black font-sf text-white">
      <div className="flex h-full flex-col items-center justify-center">
        <AppleLogo size={84} color="#fff" />
        <div className="mt-16 h-[5px] w-[220px] overflow-hidden rounded-full bg-white/25">
          <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-5 text-[13px] text-white/60">About {mins} minute{mins === 1 ? "" : "s"} remaining...</div>
      </div>
    </FullscreenPrank>
  )
}
