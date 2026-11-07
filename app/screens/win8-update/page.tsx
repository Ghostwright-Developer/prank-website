"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"
import { WinSpinner, useBelievableProgress } from "@/components/prank-kit"

export default function Win8UpdateScreen() {
  const pct = useBelievableProgress({ from: 12, max: 98, perSecond: 0.3, stalls: [40, 72] })
  return (
    <FullscreenPrank secondary="#00539f" exitMessage="UPDATE CANCELLED - IT WAS A PRANK!" className="cursor-none bg-[#00539f] font-segoe text-white">
      <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
        <WinSpinner size={44} dot={5} />
        <div className="text-[30px] font-light">Working on updates</div>
        <div className="text-[30px] font-light">{Math.floor(pct)}% complete</div>
        <div className="text-[20px] font-light">Don&apos;t turn off your computer</div>
      </div>
    </FullscreenPrank>
  )
}
