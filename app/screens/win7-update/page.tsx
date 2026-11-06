"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"
import { useBelievableProgress } from "@/components/prank-kit"

// Windows 7 shutdown/startup "Configuring Windows Updates" screen.
export default function Win7UpdateScreen() {
  const pct = useBelievableProgress({ from: 8, max: 96, perSecond: 0.25, stalls: [30, 61, 90] })
  const step = pct < 35 ? 1 : pct < 70 ? 2 : 3
  return (
    <FullscreenPrank exitMessage="UPDATE CANCELLED - IT WAS A PRANK!" className="cursor-none bg-black font-segoe text-white">
      <div className="flex h-full flex-col items-center justify-center">
        <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true" className="mb-10">
          <path d="M6 14c10-5 20-5 32 0v28c-12-5-22-5-32 0z" fill="#f25022" />
          <path d="M44 16c11 4 22 4 32-1v28c-10 5-21 5-32 0z" fill="#7fba00" />
          <path d="M6 48c10-5 20-5 32 0v28c-12-5-22-5-32 0z" fill="#00a4ef" />
          <path d="M44 50c11 4 22 4 32-1v28c-10 5-21 5-32 0z" fill="#ffb900" />
        </svg>
        <div className="text-[26px] font-light">Configuring Windows Updates</div>
        <div className="mt-3 text-[20px] font-light">Step {step} of 3 &nbsp;·&nbsp; {Math.floor(pct)}% complete</div>
        <div className="mt-5 text-[18px] font-light">Do not turn off your computer</div>
      </div>
    </FullscreenPrank>
  )
}
