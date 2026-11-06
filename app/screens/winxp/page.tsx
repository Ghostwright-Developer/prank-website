"use client"

import { useState, useEffect } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

export default function WinXPScreen() {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowWarning(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <FullscreenPrank className="cursor-default" exitMessage="WINDOWS ACTIVATED!">
      <div 
        className="relative h-full w-full"
        style={{
          background: "linear-gradient(180deg, #245EDC 0%, #3A6EE8 50%, #245EDC 100%)",
        }}
      >
        {/* Bliss-like background with degraded effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-green-400 opacity-30" />
        
        {/* Black overlay to show "not genuine" degradation */}
        <div className="absolute inset-0 bg-black/80" />

        {/* Desktop Icons */}
        <div className="absolute left-4 top-4 flex flex-col gap-6">
          <DesktopIcon icon="🗑️" label="Recycle Bin" />
          <DesktopIcon icon="💻" label="My Computer" />
          <DesktopIcon icon="🌐" label="Internet Explorer" />
        </div>

        {/* Not Genuine Warning - Bottom Right */}
        <div className="absolute bottom-20 right-4 text-right">
          <p className="text-lg font-bold text-white drop-shadow-lg">
            Windows XP
          </p>
          <p className="text-sm text-white/80">
            Build 2600.xpsp_sp3_gdr.080814-1236
          </p>
          <p className="mt-2 text-lg font-bold text-red-400">
            This copy of Windows is not genuine.
          </p>
        </div>

        {/* Taskbar */}
        <div className="absolute bottom-0 left-0 right-0 flex h-8 items-center bg-gradient-to-r from-[#245EDC] via-[#3168d9] to-[#245EDC] shadow-[inset_0_1px_0_#5a8aea]">
          <button className="flex h-full items-center gap-1 rounded-r-lg bg-gradient-to-b from-[#3c9a3c] to-[#2d7b2d] px-3 font-bold text-white shadow-[inset_0_1px_0_#5ec75e,0_1px_3px_rgba(0,0,0,0.3)]">
            <span className="text-xl">🪟</span>
            start
          </button>
          <div className="flex-1" />
          <div className="flex h-full items-center gap-2 bg-[#0f8ae0] px-2 text-xs text-white">
            <span>12:34 PM</span>
          </div>
        </div>

        {/* Warning Dialog */}
        {showWarning && (
          <div className="absolute left-1/2 top-1/2 w-[500px] -translate-x-1/2 -translate-y-1/2 border border-[#0054e3] bg-[#ece9d8] shadow-lg">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#0054e3] to-[#2b8ae8] px-2 py-1 text-sm font-bold text-white">
              <span>Windows Activation</span>
              <button className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-b from-[#e05941] to-[#c33d26] text-xs">✕</button>
            </div>
            <div className="p-4">
              <div className="flex gap-4">
                <div className="text-5xl">⚠️</div>
                <div>
                  <p className="mb-2 font-bold text-[#003399]">
                    This copy of Windows is not genuine
                  </p>
                  <p className="mb-4 text-sm">
                    You may be a victim of software counterfeiting. This copy of Windows
                    did not pass Windows Genuine Advantage validation.
                  </p>
                  <p className="mb-4 text-sm">
                    To resolve this issue, you need to obtain a genuine copy of Windows XP.
                  </p>
                  <p className="text-xs text-gray-600">
                    Error Code: 0x80070005
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button className="rounded border border-[#003c74] bg-gradient-to-b from-white to-[#d4d0c8] px-6 py-1 text-sm shadow hover:from-[#d4d0c8] hover:to-white">
                  Resolve Now
                </button>
                <button className="rounded border border-[#003c74] bg-gradient-to-b from-white to-[#d4d0c8] px-6 py-1 text-sm shadow hover:from-[#d4d0c8] hover:to-white">
                  Resolve Later
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </FullscreenPrank>
  )
}

function DesktopIcon({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex w-20 cursor-pointer flex-col items-center gap-1 p-1 hover:bg-blue-500/30">
      <span className="text-4xl drop-shadow-lg">{icon}</span>
      <span className="text-center text-xs text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {label}
      </span>
    </div>
  )
}
