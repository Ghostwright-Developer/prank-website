"use client"

import { useState, useEffect } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

export default function Win98BSODScreen() {
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  return (
    <FullscreenPrank className="cursor-none" exitMessage="BLUE SCREEN AVOIDED!">
      <div className="flex h-full w-full flex-col bg-[#0000aa] p-4 font-mono text-white">
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 bg-[#aaaaaa] px-2 text-center text-[#0000aa]">
            Windows
          </p>
          
          <p className="mb-4">
            A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) +
            00010E36. The current application will be terminated.
          </p>
          
          <p className="mb-4">
            *  Press any key to terminate the current application.
          </p>
          <p className="mb-4">
            *  Press CTRL+ALT+DEL again to restart your computer. You will
            lose any unsaved information in all applications.
          </p>
          
          <p className="mb-8">
            Press any key to continue {showCursor ? "_" : " "}
          </p>

          <div className="mt-12 border-t border-[#aaaaaa] pt-4">
            <p className="text-xs">
              KERNEL32.DLL at 0001:00003A5E
            </p>
            <p className="text-xs">
              MSGSRV32.EXE at 0001:00001D5E
            </p>
            <p className="text-xs">
              0028:C0011E36 in VXD VMM(01) + 00010E36
            </p>
          </div>

          <div className="mt-8">
            <p className="text-xs text-[#aaaaaa]">
              Error code: 0x0000007E (0xC0000005, 0x8054D4B8, 0xF79A0A78, 0xF799F7F8)
            </p>
            <p className="text-xs text-[#aaaaaa]">
              IRQL_NOT_LESS_OR_EQUAL
            </p>
          </div>

          <div className="mt-12">
            <p className="animate-pulse text-center text-sm">
              *** STOP: 0x0000000A (0x00000000, 0x00000002, 0x00000000, 0x8054D4B8)
            </p>
          </div>
        </div>
      </div>
    </FullscreenPrank>
  )
}
