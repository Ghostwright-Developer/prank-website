"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"
import { useBlink } from "@/components/prank-kit"

// Windows 95/98 "fatal exception 0E" blue screen. Text follows the real 80x25 layout.
export default function Win98BSODScreen() {
  const on = useBlink(500)
  return (
    <FullscreenPrank exitMessage="BLUE SCREEN AVOIDED - IT WAS A PRANK!" className="cursor-none bg-[#0000aa] font-dos text-[#aaaaaa]">
      <div className="flex h-full flex-col items-center justify-center px-6">
        <div className="w-full max-w-[860px] text-[clamp(16px,2.6vw,26px)] leading-[1.25]">
          <div className="mb-[1.6em] text-center">
            <span className="bg-[#aaaaaa] px-[0.6em] text-[#0000aa]">Windows</span>
          </div>
          <p>A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) +</p>
          <p className="mb-[1.2em]">00010E36. The current application will be terminated.</p>
          <p>*  Press any key to terminate the current application.</p>
          <p>*  Press CTRL+ALT+DEL again to restart your computer. You will</p>
          <p className="mb-[1.6em]">   lose any unsaved information in all applications.</p>
          <p className="text-center">Press any key to continue {on ? "_" : "\u00a0"}</p>
        </div>
      </div>
    </FullscreenPrank>
  )
}
