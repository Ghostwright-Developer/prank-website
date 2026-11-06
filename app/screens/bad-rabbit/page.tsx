"use client"

import { useState, useEffect, useRef } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

const rabbitAscii = `
       (\\(\\
      ( -.-)
     o_(")(")
`

const bootMessages = [
  "Repairing disk structure...",
  "CHKDSK is verifying files (stage 1 of 3)...",
  "  File verification completed.",
  "CHKDSK is verifying indexes (stage 2 of 3)...",
  "  Index verification completed.",
  "CHKDSK is verifying security descriptors (stage 3 of 3)...",
  "  Security descriptor verification completed.",
  "",
  "Windows found problems with the file system that could not be corrected.",
  "",
  "A disk read error occurred",
  "Press Ctrl+Alt+Del to restart",
  "",
]

export default function BadRabbitScreen() {
  const [phase, setPhase] = useState<"flash" | "boot" | "encrypt" | "ransom" | "joke">("flash")
  const [bootLines, setBootLines] = useState<string[]>([])
  const [encryptProgress, setEncryptProgress] = useState(0)
  const [countdown, setCountdown] = useState({ hours: 39, mins: 59, secs: 59 })
  const [blinkOn, setBlinkOn] = useState(true)
  const [personalKey] = useState(`${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  // Blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (mountedRef.current) setBlinkOn(prev => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Flash update phase
  useEffect(() => {
    if (phase !== "flash") return
    const timer = setTimeout(() => {
      if (mountedRef.current) setPhase("boot")
    }, 3000)
    return () => clearTimeout(timer)
  }, [phase])

  // Boot phase
  useEffect(() => {
    if (phase !== "boot") return
    let i = 0
    const interval = setInterval(() => {
      if (!mountedRef.current) return
      if (i < bootMessages.length) {
        setBootLines(prev => [...prev, bootMessages[i]])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          if (mountedRef.current) setPhase("encrypt")
        }, 2000)
      }
    }, 200)
    return () => clearInterval(interval)
  }, [phase])

  // Encrypt phase
  useEffect(() => {
    if (phase !== "encrypt") return
    const interval = setInterval(() => {
      setEncryptProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            if (mountedRef.current) setPhase("ransom")
          }, 1500)
          return 100
        }
        return prev + Math.random() * 2 + 0.5
      })
    }, 100)
    return () => clearInterval(interval)
  }, [phase])

  // Ransom countdown
  useEffect(() => {
    if (phase !== "ransom") return
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { hours, mins, secs } = prev
        secs--
        if (secs < 0) { secs = 59; mins-- }
        if (mins < 0) { mins = 59; hours-- }
        return { hours: Math.max(0, hours), mins: Math.max(0, mins), secs: Math.max(0, secs) }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [phase])

  const formatTime = () => 
    `${countdown.hours.toString().padStart(2, "0")}:${countdown.mins.toString().padStart(2, "0")}:${countdown.secs.toString().padStart(2, "0")}`

  if (phase === "joke") {
    return (
      <FullscreenPrank className="bg-black">
        <div className="flex h-full w-full flex-col items-center justify-center bg-black p-8 text-center font-mono">
          <pre className="text-green-500 text-2xl mb-8">{rabbitAscii}</pre>
          <h1 className="text-4xl text-green-400 mb-4">GOOD RABBIT!</h1>
          <p className="text-xl text-green-300 mb-2">This was just a prank.</p>
          <p className="text-gray-500">Bad Rabbit spread via fake Flash Player updates in 2017.</p>
          <p className="mt-8 text-sm text-gray-600">Press ESC to return home</p>
        </div>
      </FullscreenPrank>
    )
  }

  if (phase === "flash") {
    return (
      <FullscreenPrank className="bg-gray-100">
        <div className="h-full w-full bg-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-2xl w-96 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-red-600 font-bold text-xl">
                f
              </div>
              <span className="text-white font-bold text-lg">Adobe Flash Player</span>
            </div>
            <div className="p-6 text-center">
              <div className="text-red-600 text-5xl mb-4">&#9888;</div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Flash Player Update Required</h2>
              <p className="text-gray-600 text-sm mb-6">
                Your Flash Player is out of date. Install the latest version to view this content.
              </p>
              <div className="bg-gray-100 rounded p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">install_flash_player.exe</span>
                  <span className="text-gray-400">2.1 MB</span>
                </div>
                <div className="mt-2 h-2 bg-gray-300 rounded overflow-hidden">
                  <div className="h-full bg-green-500 w-full animate-pulse" />
                </div>
              </div>
              <p className="text-green-600 text-sm animate-pulse">Installing update...</p>
            </div>
          </div>
        </div>
      </FullscreenPrank>
    )
  }

  if (phase === "boot") {
    return (
      <FullscreenPrank className="bg-black">
        <div className="h-full w-full bg-black p-4 font-mono text-sm text-gray-300 overflow-hidden">
          {bootLines.map((line, i) => (
            <div key={i} className={line.includes("error") || line.includes("could not") ? "text-red-500" : ""}>
              {line || "\u00a0"}
            </div>
          ))}
          <span className={`${blinkOn ? "opacity-100" : "opacity-0"}`}>_</span>
        </div>
      </FullscreenPrank>
    )
  }

  if (phase === "encrypt") {
    return (
      <FullscreenPrank className="bg-black">
        <div className="h-full w-full bg-black flex flex-col items-center justify-center font-mono">
          <pre className={`text-red-500 text-2xl mb-8 ${blinkOn ? "" : "opacity-80"}`}>{rabbitAscii}</pre>
          <div className="text-red-500 text-3xl font-bold mb-8">Bad Rabbit</div>
          <div className="text-white text-xl mb-4">Encrypting disk...</div>
          <div className="w-64 h-4 bg-gray-800 rounded overflow-hidden mb-4">
            <div 
              className="h-full bg-red-600 transition-all duration-100"
              style={{ width: `${encryptProgress}%` }}
            />
          </div>
          <div className="text-gray-400">{Math.floor(encryptProgress)}%</div>
          <div className="mt-8 text-yellow-500 text-sm animate-pulse">
            DO NOT TURN OFF YOUR COMPUTER
          </div>
        </div>
      </FullscreenPrank>
    )
  }

  // Ransom phase
  return (
    <FullscreenPrank className="bg-black">
      <div className="h-full w-full bg-black flex flex-col items-center justify-center font-mono p-8 overflow-y-auto">
        <pre className={`text-red-500 text-xl mb-6 ${blinkOn ? "" : "opacity-80"}`}>{rabbitAscii}</pre>
        
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl text-red-500 font-bold mb-6">Oops! Your files have been encrypted.</h1>
          
          <div className="bg-gray-900 border border-red-800 rounded p-6 mb-6 text-left">
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              If you see this text, your files are no longer accessible. You might have been looking 
              for a way to recover your files. Do not waste your time. No one will be able to recover 
              them without our decryption service.
            </p>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              We guarantee that you can recover all your files safely. All you need to do is submit 
              the payment and get the decryption password.
            </p>
            <p className="text-yellow-400 text-sm">
              Visit our website <span className="text-red-400">caforssztxqzf2nm.onion</span> using Tor Browser.
            </p>
          </div>

          {/* Payment box */}
          <div className="bg-red-950 border-2 border-red-600 rounded p-6 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-gray-400 text-sm mb-1">Time remaining:</div>
                <div className="text-3xl font-bold text-white">{formatTime()}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Payment required:</div>
                <div className="text-3xl font-bold text-green-400">0.05 BTC</div>
              </div>
            </div>
          </div>

          {/* Personal key */}
          <div className="bg-gray-900 border border-gray-700 rounded p-4 mb-6">
            <div className="text-gray-400 text-sm mb-2">Your personal installation key:</div>
            <div className="bg-black rounded p-3 font-mono text-yellow-400 text-lg tracking-wider">
              {personalKey}
            </div>
          </div>

          <button 
            onClick={() => setPhase("joke")}
            className="px-8 py-3 bg-red-700 text-white font-bold rounded hover:bg-red-600 transition-colors cursor-pointer"
          >
            I already paid, where is my key?
          </button>
        </div>
      </div>
    </FullscreenPrank>
  )
}
