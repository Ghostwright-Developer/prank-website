"use client"

import { useState, useEffect } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

export default function CryptoLockerScreen() {
  const [timeLeft, setTimeLeft] = useState(15) // 15 seconds for the prank
  const [files, setFiles] = useState(0)
  const [showJoke, setShowJoke] = useState(false)
  const [btcAddress] = useState("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa")
  const [displayTime, setDisplayTime] = useState({ hrs: 71, mins: 59, secs: 45 })

  useEffect(() => {
    // Fake countdown display (looks like 72 hours but actually 15 seconds)
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowJoke(true)
          return 0
        }
        return prev - 1
      })
      
      // Animate the fake timer to look dramatic
      setDisplayTime((prev) => {
        let { hrs, mins, secs } = prev
        secs = secs - Math.floor(Math.random() * 3) - 1
        if (secs < 0) {
          secs = 59
          mins--
        }
        if (mins < 0) {
          mins = 59
          hrs--
        }
        return { hrs: Math.max(0, hrs), mins: Math.max(0, mins), secs: Math.max(0, secs) }
      })
    }, 1000)

    // File counter animation
    const targetFiles = 847293
    const fileInterval = setInterval(() => {
      setFiles((prev) => {
        const increment = Math.floor(Math.random() * 50000) + 10000
        return Math.min(prev + increment, targetFiles)
      })
    }, 200)

    // Stop file counter after it reaches target
    const fileTimeout = setTimeout(() => {
      clearInterval(fileInterval)
      setFiles(targetFiles)
    }, 3000)

    return () => {
      clearInterval(timer)
      clearInterval(fileInterval)
      clearTimeout(fileTimeout)
    }
  }, [])

  const formatTime = () => {
    const { hrs, mins, secs } = displayTime
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (showJoke) {
    return (
      <FullscreenPrank exitMessage="YOU'RE SAFE!" className="bg-black">
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-green-900 to-black p-8 text-center">
          <h1 className="mb-8 text-6xl font-bold text-green-400">GOTCHA!</h1>
          <p className="mb-4 text-2xl text-green-300">Your files were never encrypted.</p>
          <p className="mb-8 text-xl text-green-200">This was just a harmless prank!</p>
          <p className="text-lg text-gray-400">Press ESC or Q to return to safety</p>
        </div>
      </FullscreenPrank>
    )
  }

  return (
    <FullscreenPrank exitMessage="FILES DECRYPTED!" className="bg-[#2b0000]">
      <div className="flex h-full w-full flex-col bg-gradient-to-b from-[#3d0000] to-[#1a0000]">
        {/* Header */}
        <div className="border-b border-red-900 bg-gradient-to-r from-[#4a0000] to-[#2a0000] p-4">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🔒</div>
            <div>
              <h1 className="text-3xl font-bold text-red-500">CryptoLocker</h1>
              <p className="text-red-300">Your personal files are encrypted!</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
          {/* Warning message */}
          <div className="max-w-3xl rounded-lg border border-red-800 bg-black/50 p-6 text-center">
            <h2 className="mb-4 text-2xl font-bold text-red-400">
              YOUR IMPORTANT FILES HAVE BEEN ENCRYPTED
            </h2>
            <p className="mb-4 text-gray-300">
              All of your files - photos, documents, databases and other important data have been
              encrypted with RSA-2048 encryption. The only way to recover your files is to obtain
              the private key and decryption program.
            </p>
            <p className="text-yellow-400">
              Files encrypted: <span className="font-mono text-2xl">{files.toLocaleString()}</span>
            </p>
          </div>

          {/* Timer */}
          <div className="text-center">
            <p className="mb-2 text-red-300">Time remaining before key is destroyed:</p>
            <div className="font-mono text-6xl font-bold text-red-500">
              {formatTime()}
            </div>
          </div>

          {/* Payment section */}
          <div className="w-full max-w-2xl rounded-lg border border-yellow-700 bg-black/50 p-6">
            <h3 className="mb-4 text-xl font-bold text-yellow-400">
              How to pay the ransom:
            </h3>
            <div className="mb-4 rounded bg-black p-3 font-mono text-sm text-green-400">
              Send 0.5 BTC to: {btcAddress}
            </div>
            <p className="text-sm text-gray-400">
              After payment is confirmed, the decryption key will be automatically sent to your
              computer and all your files will be restored within 24 hours.
            </p>
          </div>

          {/* Fake progress bar */}
          <div className="w-full max-w-2xl">
            <div className="mb-2 flex justify-between text-sm text-gray-400">
              <span>Encrypting remaining files...</span>
              <span>{Math.min(99, Math.floor(files / 8472.93))}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
                style={{ width: `${Math.min(99, files / 8472.93)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer warning */}
        <div className="border-t border-red-900 bg-black/50 p-4 text-center text-sm text-gray-500">
          WARNING: Do not attempt to remove this software or your files will be permanently lost.
        </div>
      </div>
    </FullscreenPrank>
  )
}
