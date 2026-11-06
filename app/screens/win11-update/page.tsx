"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"
import { WinSpinner, useBelievableProgress } from "@/components/prank-kit"

export default function Win11UpdateScreen() {
  const pct = useBelievableProgress({ from: 62, max: 99, perSecond: 0.2, stalls: [78, 94, 99] })
  return (
    <FullscreenPrank exitMessage="UPDATE CANCELLED - IT WAS A PRANK!" className="cursor-none bg-black font-segoe text-white">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="mt-[12vh]"><WinSpinner size={40} dot={4.5} /></div>
        <div className="mt-24 text-[22px]">Working on updates</div>
        <div className="mt-1 text-[22px]">{Math.floor(pct)}% complete</div>
        <div className="mt-6 text-[18px] text-white/90">Don&apos;t turn off your computer</div>
      </div>
    </FullscreenPrank>
  )
}
