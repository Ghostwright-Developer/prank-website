"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"
import { useBelievableProgress } from "@/components/prank-kit"

// Windows 2000 text-mode style Service Pack installer.
export default function Win2000UpdateScreen() {
  const pct = useBelievableProgress({ from: 9, max: 97, perSecond: 0.22, stalls: [27, 55, 83] })
  const mins = Math.max(3, Math.round(((100 - pct) / 100) * 52))
  return (
    <FullscreenPrank secondary="#0000aa" exitMessage="SERVICE PACK CANCELLED - IT WAS A PRANK!" className="cursor-none bg-[#0000aa] font-dos text-[#c0c0c0]">
      <div className="h-full p-6 text-[22px] leading-tight">
        <div className="bg-[#c0c0c0] px-2 text-[#0000aa]">Windows 2000 Professional Service Pack 4 Setup</div>
        <div className="mt-1 border-b-2 border-[#c0c0c0]" />
        <div className="mt-6 pl-2">
          <p>Please wait while Setup installs Service Pack 4.</p>
          <p className="mt-3">This may take several minutes. Do NOT turn off or restart your computer.</p>
          <p className="mt-6 text-white">Setup is updating system files...</p>
          <p className="mt-6">Setup is copying files...</p>
          <div className="mt-2 flex h-6 w-[min(640px,90%)] border border-white p-[2px]">
            <div className="h-full bg-white" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2">{Math.floor(pct)}% &nbsp; Estimated time remaining: {mins} minutes</p>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-[#c0c0c0] px-2 text-[#0000aa]">Setup is installing files</div>
      </div>
    </FullscreenPrank>
  )
}
