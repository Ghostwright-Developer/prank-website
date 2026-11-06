"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"
import { WinSpinner, useBelievableProgress } from "@/components/prank-kit"

export default function Win10UpdateScreen() {
  const pct = useBelievableProgress({ from: 21, max: 97, perSecond: 0.35, stalls: [38, 64, 89] })
  return (
    <FullscreenPrank exitMessage="UPDATE CANCELLED - IT WAS A PRANK!" className="cursor-none bg-[#0063b1] font-segoe text-white">
      <div className="flex h-full flex-col items-center justify-center gap-7 text-center">
        <WinSpinner size={44} dot={5} />
        <div className="text-[28px] font-light">Working on updates</div>
        <div className="text-[28px] font-light">{Math.floor(pct)}% complete</div>
        <div className="text-[20px] font-light leading-snug">
          Don&apos;t turn off your PC. This will take a while.
          <br />
          Your PC will restart several times.
        </div>
      </div>
    </FullscreenPrank>
  )
}
