"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"
import { useBelievableProgress } from "@/components/prank-kit"

export default function AndroidUpdateScreen() {
  const pct = useBelievableProgress({ from: 9, max: 96, perSecond: 0.3, stalls: [34, 72] })
  return (
    <FullscreenPrank exitMessage="UPDATE CANCELLED - IT WAS A PRANK!" className="cursor-none bg-black font-sans text-white">
      <div className="flex h-full flex-col items-center justify-center">
        <svg width="96" height="96" viewBox="0 0 24 24" fill="#3ddc84" aria-hidden="true">
          <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 00-.83.22l-1.88 3.24a11.463 11.463 0 00-8.94 0L5.65 5.67a.643.643 0 00-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.78 10.78 0 001 18h22a10.78 10.78 0 00-5.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
        </svg>
        <div className="mt-8 text-[20px]">Installing system update</div>
        <div className="mt-6 h-[6px] w-[min(300px,70vw)] overflow-hidden rounded-full bg-white/20">
          <div className="h-full bg-[#3ddc84]" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-3 text-[14px] text-white/60">{Math.floor(pct)}%</div>
      </div>
    </FullscreenPrank>
  )
}
