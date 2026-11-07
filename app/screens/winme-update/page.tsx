"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"
import { useBelievableProgress } from "@/components/prank-kit"

export default function WinMeUpdateScreen() {
  const pct = useBelievableProgress({ from: 6, max: 96, perSecond: 0.2, stalls: [22, 51, 79] })
  const mins = Math.max(4, Math.round(((100 - pct) / 100) * 39))
  return (
    <FullscreenPrank secondary="#10346b" exitMessage="UPDATE CANCELLED - IT WAS A PRANK!" className="cursor-default bg-[#3a6ea5] font-win9x">
      <div className="absolute inset-0 bg-gradient-to-br from-[#79a9d8] via-[#3a6ea5] to-[#10346b]" />
      <div className="absolute inset-x-0 top-0 bg-[#10346b] px-4 py-2 text-[16px] font-bold italic text-white">
        Windows <span className="text-[#ffd75a]">Millennium Edition</span> Setup
      </div>
      <div className="absolute left-1/2 top-1/2 w-[min(560px,92vw)] -translate-x-1/2 -translate-y-1/2 border border-black bg-[#c0c0c0] shadow-[2px_2px_0_#000]">
        <div className="bg-gradient-to-r from-[#0a246a] to-[#a6caf0] px-2 py-1 text-[13px] font-bold text-white">Windows Update</div>
        <div className="p-5 text-[13px] text-black">
          <p className="mb-3">Setup is updating your system. Please wait while Setup copies files and updates your Windows configuration.</p>
          <p className="mb-1">Copying files...</p>
          <div className="flex h-5 border border-[#808080] border-b-white border-r-white bg-white p-[2px]">
            <div className="h-full bg-[repeating-linear-gradient(90deg,#000080_0_8px,transparent_8px_10px)]" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-3">Estimated time remaining: {mins} minutes</p>
          <p className="mt-3 text-[12px]">Do not turn off your computer during this process.</p>
        </div>
      </div>
    </FullscreenPrank>
  )
}
