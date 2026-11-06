"use client"

import { useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { useBelievableProgress } from "@/components/prank-kit"

function Installer() {
  const pct = useBelievableProgress({ from: 0, max: 99, perSecond: 2.2, stalls: [47, 93] })
  return (
    <div className="p-6">
      <div className="mb-3 text-[15px] text-[#333]">Adobe Flash Player Installer</div>
      <div className="mb-2 text-[13px] text-[#666]">{pct < 93 ? "Downloading..." : "Verifying..."} {Math.floor(pct)}%</div>
      <div className="h-3 overflow-hidden rounded-sm bg-[#ddd]"><div className="h-full bg-[#ea1c24]" style={{ width: `${pct}%` }} /></div>
      <div className="mt-4 text-[12px] text-[#888]">Do not close this window.</div>
    </div>
  )
}

// The classic fake Flash Player update popup.
export default function FakeFlashUpdateScreen() {
  const [clicked, setClicked] = useState(false)
  return (
    <FullscreenPrank exitMessage="NOTHING WAS INSTALLED - IT WAS A PRANK!" className="cursor-default bg-[#e6e6e6] font-sans">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#ececec_0_14px,#e2e2e2_14px_28px)]" />
      <div className="absolute left-1/2 top-1/2 w-[min(520px,94vw)] -translate-x-1/2 -translate-y-1/2 border border-[#999] bg-white shadow-[0_10px_40px_rgba(0,0,0,.35)]">
        <div className="flex items-center gap-3 bg-[#ea1c24] px-5 py-3 text-white">
          <span className="grid h-10 w-10 place-items-center rounded bg-white text-[28px] font-black italic text-[#ea1c24]">f</span>
          <div>
            <div className="text-[18px] font-bold leading-tight">Adobe® Flash® Player</div>
            <div className="text-[12px] opacity-90">Update available</div>
          </div>
        </div>
        {clicked ? <Installer /> : (
          <div className="p-6">
            <h1 className="mb-2 text-[18px] font-bold text-[#222]">Your version of Flash Player is out of date.</h1>
            <p className="mb-4 text-[14px] leading-snug text-[#444]">
              A critical security update is available for Adobe Flash Player. Update now to continue viewing video and
              interactive content on this page. Version 32.0.0.465 is required.
            </p>
            <button onClick={() => setClicked(true)} className="w-full rounded-sm bg-[#ea1c24] py-3 text-[15px] font-bold text-white">Update Now</button>
            <div className="mt-3 text-center text-[11px] text-[#888]">By clicking, you agree to the Adobe Software License Agreement.</div>
          </div>
        )}
      </div>
    </FullscreenPrank>
  )
}
