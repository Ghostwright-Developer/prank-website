"use client"

import { useState, useEffect } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

export default function FormatScreen() {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<"warning" | "formatting" | "stuck" | "joke">("warning")
  const [stuckTimer, setStuckTimer] = useState(0)

  useEffect(() => {
    if (phase === "warning") {
      const timer = setTimeout(() => setPhase("formatting"), 3000)
      return () => clearTimeout(timer)
    }

    if (phase === "formatting") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 99) {
            setPhase("stuck")
            return 99
          }
          // Slow down as it approaches 99%
          const increment = prev > 90 ? 0.1 : prev > 70 ? 0.5 : 1
          return Math.min(prev + increment, 99)
        })
      }, 100)
      return () => clearInterval(interval)
    }

    if (phase === "stuck") {
      const interval = setInterval(() => {
        setStuckTimer((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [phase])

  return (
    <FullscreenPrank exitMessage="DRIVE SAVED!" className="bg-[#0c0c0c]">
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#0c0c0c] font-mono">
        {phase === "warning" && (
          <div className="w-full max-w-lg rounded border border-gray-700 bg-[#1a1a1a] shadow-2xl">
            <div className="border-b border-gray-700 bg-[#2d2d2d] px-4 py-2">
              <span className="text-sm text-gray-300">Format Local Disk (C:)</span>
            </div>
            <div className="p-6">
              <div className="mb-6 flex items-start gap-4">
                <div className="text-4xl text-yellow-500">!</div>
                <div>
                  <p className="mb-2 text-lg text-white">
                    Formatting this volume will erase all data on it.
                  </p>
                  <p className="text-sm text-gray-400">
                    Back up any files you want to keep before formatting.
                  </p>
                </div>
              </div>
              <div className="mb-4 rounded bg-[#0c0c0c] p-3 text-sm">
                <p className="text-gray-400">Drive: C:</p>
                <p className="text-gray-400">File System: NTFS</p>
                <p className="text-gray-400">Capacity: 512 GB</p>
                <p className="text-red-400">Quick Format: OFF</p>
              </div>
              <p className="animate-pulse text-center text-yellow-500">
                Starting format...
              </p>
            </div>
          </div>
        )}

        {(phase === "formatting" || phase === "stuck") && (
          <div className="w-full max-w-lg">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl text-white">Formatting Drive C:</h1>
              <p className="text-gray-400">Please do not turn off your computer</p>
            </div>

            {/* Progress circle */}
            <div className="mb-8 flex justify-center">
              <div className="relative h-48 w-48">
                <svg className="h-full w-full -rotate-90 transform">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="#333"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke={phase === "stuck" ? "#ef4444" : "#3b82f6"}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 88}
                    strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
                    className="transition-all duration-100"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-white">{Math.floor(progress)}%</span>
                  {phase === "stuck" && (
                    <span className="mt-1 animate-pulse text-sm text-red-400">
                      Stuck for {stuckTimer}s...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                <div
                  className={`h-full transition-all duration-100 ${
                    phase === "stuck" ? "bg-red-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Status */}
            <div className="text-center text-sm text-gray-500">
              <p>Erasing all data on Local Disk (C:)</p>
              <p className="mt-1">
                {phase === "stuck" 
                  ? "Format appears to be stuck..." 
                  : `${Math.floor(progress * 5.12)} GB / 512 GB`
                }
              </p>
            </div>

            {phase === "stuck" && (
              <p className="mt-6 animate-pulse text-center text-red-400">
                ERROR: An unknown error has occurred. Do not restart.
              </p>
            )}
          </div>
        )}
      </div>
    </FullscreenPrank>
  )
}
