'use client'

import { useEffect, useState } from 'react'
import { FullscreenPrank } from '@/components/fullscreen-prank'
import { useRouter } from 'next/navigation'

const updateSteps = [
  { msg: "Downloading update: Mojang_Creeper_Therapy_v4.2.jar", duration: 2000 },
  { msg: "Installing: Mandatory Pig Physics Engine...", duration: 1800 },
  { msg: "Configuring: Enderman Eye Contact Protocols...", duration: 2200 },
  { msg: "Updating: Steve's Emotional Support Diamond...", duration: 1500 },
  { msg: "Patching: Creeper PTSD Module (ssssss)...", duration: 2000 },
  { msg: "Installing: Herobrine (definitely not here)...", duration: 2500 },
  { msg: "Removing Herobrine...", duration: 500 },
  { msg: "Re-adding Herobrine by accident...", duration: 800 },
  { msg: "Removing Herobrine again...", duration: 500 },
  { msg: "Compiling: 47,000 Dirt Block Variants...", duration: 2000 },
  { msg: "Loading: 11,000 Slightly Different Oak Log Textures...", duration: 1800 },
  { msg: "Optimizing: Notch's Cheese Wheel Collection...", duration: 1200 },
  { msg: "ERROR: Could not find Java. Blaming Java.", duration: 2000 },
  { msg: "Installing Java 8, Java 11, Java 17, and Java 47...", duration: 2500 },
  { msg: "Uninstalling Java (all of them)...", duration: 1000 },
  { msg: "Reinstalling Java (just one this time)...", duration: 1500 },
  { msg: "Finished! Restarting launcher 6 more times for fun...", duration: 3000 },
]

export default function MinecraftUpdate() {
  const router = useRouter()
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    const blinkInterval = setInterval(() => setBlink(b => !b), 500)
    return () => clearInterval(blinkInterval)
  }, [])

  useEffect(() => {
    if (stepIndex >= updateSteps.length) {
      setDone(true)
      return
    }
    const step = updateSteps[stepIndex]
    setLogs(prev => [...prev, step.msg])
    const timeout = setTimeout(() => {
      setStepIndex(i => i + 1)
      setProgress(Math.round(((stepIndex + 1) / updateSteps.length) * 100))
    }, step.duration)
    return () => clearTimeout(timeout)
  }, [stepIndex])

  if (done) {
    return (
      <FullscreenPrank>
        <div className="w-full h-full bg-[#1e1e1e] flex flex-col items-center justify-center text-center p-8 font-mono text-white">
          <div className="text-6xl mb-4">TNT</div>
          <h1 className="text-3xl font-bold text-green-400 mb-2">Update Complete!</h1>
          <p className="text-zinc-400 mb-2">Minecraft has been updated to version 1.21.4-hotfix-patch-2b-FINAL-v3-REALLYFINAL</p>
          <p className="text-zinc-500 mb-2">Herobrine has been removed. (14th attempt)</p>
          <p className="text-yellow-400 text-lg mt-4 mb-8">This was a prank. Your Minecraft is totally fine. Probably.</p>
          <button onClick={() => router.push('/')} className="bg-green-600 text-white px-8 py-3 rounded text-lg hover:bg-green-500 cursor-pointer">
            Go dig some dirt
          </button>
        </div>
      </FullscreenPrank>
    )
  }

  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-[#1e1e1e] flex flex-col items-center justify-center p-8 font-mono text-white">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-green-700 text-white text-xs font-bold px-4 py-1 mb-4 rounded">
              MINECRAFT LAUNCHER 3.0
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Updating Minecraft</h1>
            <p className="text-zinc-400 text-sm">Please do not turn off your computer or your creepers will be sad</p>
          </div>

          {/* Progress bar - pixelated style */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-zinc-400 mb-2">
              <span>{updateSteps[Math.min(stepIndex, updateSteps.length - 1)]?.msg.slice(0, 40)}...</span>
              <span className="text-green-400 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-6 border-2 border-zinc-600">
              <div
                className="bg-green-600 h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Log window */}
          <div className="bg-black border border-zinc-700 rounded p-4 h-48 overflow-hidden text-left">
            <div className="text-green-400 text-xs font-bold mb-2">[LAUNCHER LOG]</div>
            <div className="space-y-1">
              {logs.slice(-8).map((log, i) => (
                <div key={i} className="text-xs text-zinc-300 flex gap-2">
                  <span className="text-zinc-600 shrink-0">[{String(i + Math.max(0, logs.length - 8)).padStart(2, '0')}]</span>
                  <span className={i === Math.min(logs.slice(-8).length - 1, 7) ? 'text-yellow-300' : ''}>{log}</span>
                </div>
              ))}
              {blink && <div className="text-green-400 text-xs">_</div>}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 text-center text-xs text-zinc-400">
            <div className="bg-zinc-900 border border-zinc-700 p-3 rounded">
              <div className="text-white font-bold text-lg">{stepIndex}/17</div>
              <div>Steps</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-700 p-3 rounded">
              <div className="text-red-400 font-bold text-lg">14</div>
              <div>Herobrines Removed</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-700 p-3 rounded">
              <div className="text-green-400 font-bold text-lg">{stepIndex + 1}</div>
              <div>Javas Installed</div>
            </div>
          </div>
        </div>
      </div>
    </FullscreenPrank>
  )
}
