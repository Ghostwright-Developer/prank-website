"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"
import { useBelievableProgress } from "@/components/prank-kit"

export default function ChromeosUpdateScreen() {
  const pct = useBelievableProgress({ from: 11, max: 97, perSecond: 0.3, stalls: [37, 70] })
  return (
    <FullscreenPrank exitMessage="UPDATE CANCELLED - IT WAS A PRANK!" className="cursor-none bg-white font-sans text-[#202124]">
      <div className="flex h-full flex-col items-center justify-center">
        <svg width="76" height="76" viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="22" fill="#db4437" />
          <path d="M24 2a22 22 0 0119 11H24a11 11 0 00-9.5 5.5L5 13A22 22 0 0124 2z" fill="#db4437" />
          <path d="M43 13a22 22 0 01-10 31L24 28a11 11 0 000-11z" fill="#ffcd40" />
          <path d="M33 44A22 22 0 015 13l9.5 5.5A11 11 0 0024 35z" fill="#0f9d58" />
          <circle cx="24" cy="24" r="9" fill="#fff" /><circle cx="24" cy="24" r="7" fill="#4285f4" />
        </svg>
        <div className="mt-8 text-[22px]">Installing system update</div>
        <div className="mt-5 h-[4px] w-[min(320px,70vw)] overflow-hidden rounded bg-[#dadce0]">
          <div className="h-full bg-[#1a73e8]" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-4 text-[14px] text-[#5f6368]">Your Chromebook will restart when the update is complete. Do not turn off your device.</div>
      </div>
    </FullscreenPrank>
  )
}
