"use client"

import { useState, useEffect } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

export default function WebcamScreen() {
  const [recording, setRecording] = useState(0)
  const [showMessage, setShowMessage] = useState(false)
  const [blink, setBlink] = useState(true)
  // Random IP is generated after mount so server and client HTML match.
  const [ip, setIp] = useState("0.0.0.0")
  useEffect(() => {
    const octet = () => Math.floor(Math.random() * 223) + 1
    setIp(`${octet()}.${octet()}.${octet()}.${octet()}`)
  }, [])
  const fakeLocation = {
    ip,
    location: "The Moon Base, Crater 47",
    isp: "Definitely Not Real ISP",
  }

  useEffect(() => {
    const recordingInterval = setInterval(() => {
      setRecording((prev) => prev + 1)
    }, 1000)

    const blinkInterval = setInterval(() => {
      setBlink((prev) => !prev)
    }, 500)

    const messageTimeout = setTimeout(() => {
      setShowMessage(true)
    }, 5000)

    return () => {
      clearInterval(recordingInterval)
      clearInterval(blinkInterval)
      clearTimeout(messageTimeout)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <FullscreenPrank exitMessage="WEBCAM DISABLED!" className="bg-black">
      <div className="flex h-full w-full flex-col items-center justify-center bg-black">
        {/* Fake webcam view - just shows static/noise */}
        <div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-lg border-4 border-gray-800 bg-gray-900">
          {/* Static noise effect */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              animation: "noise 0.2s steps(10) infinite",
            }}
          />
          
          {/* Recording indicator */}
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <div className={`h-4 w-4 rounded-full bg-red-600 ${blink ? "opacity-100" : "opacity-30"}`} />
            <span className="font-mono text-sm text-red-500">REC</span>
            <span className="font-mono text-sm text-white">{formatTime(recording)}</span>
          </div>

          {/* Webcam overlay graphics */}
          <div className="absolute inset-4 border border-green-500/30" />
          <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-green-500/50" />
          <div className="absolute left-1/2 top-1/2 h-2 w-24 -translate-x-1/2 -translate-y-1/2 bg-green-500/30" />
          <div className="absolute left-1/2 top-1/2 h-24 w-2 -translate-x-1/2 -translate-y-1/2 bg-green-500/30" />

          {/* Target acquired text */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between font-mono text-xs text-green-500">
            <span>TARGET: ACQUIRED</span>
            <span>TRACKING: ACTIVE</span>
          </div>
        </div>

        {/* Warning message */}
        <div className="mt-8 max-w-2xl text-center">
          <h1 className={`mb-4 text-4xl font-bold text-red-500 ${blink ? "" : "opacity-80"}`}>
            WEBCAM ACTIVATED
          </h1>
          <p className="mb-6 text-xl text-gray-300">
            Someone is watching you right now.
          </p>
          
          {/* Fake detection info */}
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-left font-mono text-sm">
            <p className="text-gray-500">Detected Information:</p>
            <p className="text-red-400">IP Address: {fakeLocation.ip}</p>
            <p className="text-red-400">Location: {fakeLocation.location}</p>
            <p className="text-red-400">ISP: {fakeLocation.isp}</p>
            <p className="text-red-400">Device: Your Computer</p>
          </div>
        </div>

        {/* Joke reveal after delay */}
        {showMessage && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded-lg bg-green-900 px-6 py-3 text-center">
            <p className="text-green-300">
              Relax! This is fake. We cannot actually see you.
            </p>
            <p className="mt-1 text-sm text-green-400">
              (Notice the ridiculous location? Press ESC to exit)
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes noise {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(5%, 5%); }
          30% { transform: translate(-5%, 5%); }
          40% { transform: translate(5%, -5%); }
          50% { transform: translate(-5%, 0); }
          60% { transform: translate(5%, 0); }
          70% { transform: translate(0, 5%); }
          80% { transform: translate(0, -5%); }
          90% { transform: translate(5%, 5%); }
        }
      `}</style>
    </FullscreenPrank>
  )
}
