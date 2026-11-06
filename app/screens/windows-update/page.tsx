"use client"

import { useState, useEffect } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

export default function WindowsUpdateScreen() {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState(1)
  const [stuck, setStuck] = useState(false)
  const [stuckTime, setStuckTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Get stuck at 33% briefly, then at 99%
        if (prev === 33 && !stuck && stage === 1) {
          setStuck(true)
          setTimeout(() => {
            setStuck(false)
            setStage(2)
            setProgress(0)
          }, 3000)
          return 33
        }

        if (prev >= 99 && stage >= 2) {
          setStuck(true)
          return 99
        }

        if (stuck) return prev

        // Slow down near key percentages
        const slowPoints = [25, 33, 50, 67, 75, 90, 95, 98, 99]
        const nearSlow = slowPoints.some((p) => Math.abs(prev - p) < 3)
        const increment = nearSlow ? 0.1 : Math.random() * 0.5 + 0.1

        return Math.min(prev + increment, 99)
      })
    }, 100)

    return () => clearInterval(interval)
  }, [stuck, stage])

  // Stuck timer
  useEffect(() => {
    if (stuck && progress >= 99) {
      const timer = setInterval(() => {
        setStuckTime((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [stuck, progress])

  const getStatusText = () => {
    if (stuck && progress >= 99) {
      return "Installing features and updates... This might take a while"
    }
    if (stage === 1) {
      return "Working on updates"
    }
    return "Installing updates"
  }

  return (
    <FullscreenPrank exitMessage="UPDATE CANCELLED!" className="cursor-none">
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#0078d4]">
        {/* Windows Logo / Loading Spinner */}
        <div className="mb-12">
          <div className="relative h-32 w-32">
            {/* Spinning dots */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="absolute h-3 w-3 rounded-full bg-white"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${i * 72}deg) translateY(-40px)`,
                    opacity: 1 - i * 0.15,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Status text */}
        <h1 className="mb-6 text-3xl font-light text-white">
          {getStatusText()}
        </h1>

        {/* Progress */}
        <p className="mb-4 text-5xl font-light text-white">
          {Math.floor(progress)}% complete
        </p>

        {/* Stuck message */}
        {stuck && progress >= 99 && (
          <div className="mt-4 text-center">
            <p className="text-lg text-white/80">
              Don&apos;t turn off your computer.
            </p>
            {stuckTime > 5 && (
              <p className="mt-2 animate-pulse text-white/60">
                Still working on it... ({stuckTime}s)
              </p>
            )}
            {stuckTime > 15 && (
              <p className="mt-2 text-white/50">
                This is taking longer than expected...
              </p>
            )}
            {stuckTime > 30 && (
              <p className="mt-4 text-sm text-white/40">
                (It&apos;s a prank! Press ESC or Q to escape)
              </p>
            )}
          </div>
        )}

        {/* Bottom text */}
        <div className="absolute bottom-12 text-center">
          <p className="text-white/60">
            Your PC will restart several times. Sit tight.
          </p>
        </div>
      </div>
    </FullscreenPrank>
  )
}
