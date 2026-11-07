"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"
import { useBelievableProgress } from "@/components/prank-kit"

export default function Win95UpdateScreen() {
  const pct = useBelievableProgress({ from: 3, max: 95, perSecond: 0.2, stalls: [18, 46, 77] })
  const mins = Math.max(5, Math.round(((100 - pct) / 100) * 43))
  return (
    <FullscreenPrank secondary="#008080" exitMessage="UPDATE CANCELLED - IT WAS A PRANK!" className="cursor-default bg-[#008080] font-win9x">
      <div className="absolute left-1/2 top-1/2 w-[min(480px,92vw)] -translate-x-1/2 -translate-y-1/2 border-2 border-white border-b-black border-r-black bg-[#c0c0c0] p-[3px] shadow-[1px_1px_0_#000]">
        <div className="flex items-center justify-between bg-[#000080] px-1 py-[3px] text-[12px] font-bold text-white">
          <span>Windows 95 Setup</span><span className="border border-white border-b-black border-r-black bg-[#c0c0c0] px-[5px] leading-none text-black">x</span>
        </div>
        <div className="p-4 text-[12px] text-black">
          <p className="mb-4">Setup is now updating your system files. This may take several minutes. Please do not turn off your computer.</p>
          <p className="mb-1">Copying files...</p>
          <div className="h-5 border border-[#808080] border-b-white border-r-white bg-white p-[2px]">
            <div className="h-full bg-[repeating-linear-gradient(90deg,#000080_0_9px,transparent_9px_11px)]" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-3">Time remaining: about {mins} minutes</p>
          <div className="mt-4 flex justify-end">
            <button className="border-2 border-white border-b-black border-r-black bg-[#c0c0c0] px-6 py-[3px] text-[12px] text-[#808080]">Cancel</button>
          </div>
        </div>
      </div>
    </FullscreenPrank>
  )
}
