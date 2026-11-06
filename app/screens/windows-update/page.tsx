"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"
import { WinSpinner, useBelievableProgress } from "@/components/prank-kit"

// Climbs quickly, then sits at 99% forever, like a real update that never finishes.
export default function WindowsUpdateScreen() {
  const pct = useBelievableProgress({ from: 71, max: 99, perSecond: 0.6, stalls: [88, 96] })
  const shown = Math.min(99, Math.floor(pct))
  return (
    <FullscreenPrank exitMessage="UPDATE CANCELLED - IT WAS A PRANK!" className="cursor-none bg-[#1a1a1a] font-segoe text-white">
      <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
        <WinSpinner size={46} dot={5} />
        <div className="text-[26px] font-light">Working on updates</div>
        <div className="text-[26px] font-light">{shown}% complete</div>
        <div className="text-[18px] font-light">Don&apos;t turn off your computer</div>
      </div>
    </FullscreenPrank>
  )
}
