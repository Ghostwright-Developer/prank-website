"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"
import { AppleLogo, useBelievableProgress } from "@/components/prank-kit"

export default function IosUpdateScreen() {
  const pct = useBelievableProgress({ from: 18, max: 97, perSecond: 0.3, stalls: [41, 77] })
  return (
    <FullscreenPrank exitMessage="UPDATE CANCELLED - IT WAS A PRANK!" className="cursor-none bg-black font-sf text-white">
      <div className="flex h-full flex-col items-center justify-center">
        <AppleLogo size={72} color="#fff" />
        <div className="mt-20 h-[4px] w-[190px] overflow-hidden rounded-full bg-white/25">
          <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </FullscreenPrank>
  )
}
