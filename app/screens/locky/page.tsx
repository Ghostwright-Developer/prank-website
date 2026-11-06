"use client"

import { useState, useEffect, useRef } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

const encryptedFiles = [
  { name: "family_photos.zip.locky", size: "2.4 GB", type: "Archive" },
  { name: "tax_return_2024.xlsx.locky", size: "847 KB", type: "Spreadsheet" },
  { name: "wedding_video.mp4.locky", size: "4.1 GB", type: "Video" },
  { name: "thesis_final.docx.locky", size: "12 MB", type: "Document" },
  { name: "passwords.txt.locky", size: "4 KB", type: "Text" },
  { name: "company_database.sql.locky", size: "156 MB", type: "Database" },
  { name: "childhood_memories.jpg.locky", size: "8.2 MB", type: "Image" },
  { name: "bank_statements.pdf.locky", size: "23 MB", type: "PDF" },
  { name: "source_code.zip.locky", size: "89 MB", type: "Archive" },
  { name: "contracts.docx.locky", size: "1.2 MB", type: "Document" },
]

export default function LockyScreen() {
  const [phase, setPhase] = useState<"encrypting" | "ransom" | "joke">("encrypting")
  const [encryptProgress, setEncryptProgress] = useState(0)
  const [visibleFiles, setVisibleFiles] = useState<typeof encryptedFiles>([])
  const [countdown, setCountdown] = useState({ hours: 71, mins: 59, secs: 59 })
  const [priceMultiplier, setPriceMultiplier] = useState(1)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  // Encryption phase
  useEffect(() => {
    if (phase !== "encrypting") return

    const progressInterval = setInterval(() => {
      setEncryptProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            if (mountedRef.current) setPhase("ransom")
          }, 1500)
          return 100
        }
        return prev + 1
      })
    }, 80)

    let fileIndex = 0
    const fileInterval = setInterval(() => {
      if (fileIndex < encryptedFiles.length) {
        setVisibleFiles(prev => [...prev, encryptedFiles[fileIndex]])
        fileIndex++
      }
    }, 800)

    return () => {
      clearInterval(progressInterval)
      clearInterval(fileInterval)
    }
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
        if (hours <= 48 && priceMultiplier === 1) {
          setPriceMultiplier(2)
        }
        return { hours: Math.max(0, hours), mins: Math.max(0, mins), secs: Math.max(0, secs) }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [phase, priceMultiplier])

  const formatTime = () => 
    `${countdown.hours.toString().padStart(2, "0")}:${countdown.mins.toString().padStart(2, "0")}:${countdown.secs.toString().padStart(2, "0")}`

  if (phase === "joke") {
    return (
      <FullscreenPrank className="bg-black">
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-900 p-8 text-center">
          <div className="text-8xl mb-8">&#128274;</div>
          <h1 className="text-5xl font-bold text-purple-400 mb-4">FILES UNLOCKED!</h1>
          <p className="text-2xl text-purple-300 mb-4">Just kidding - they were never locked.</p>
          <p className="text-lg text-gray-400 mb-2">This simulates the Locky ransomware that infected millions.</p>
          <p className="text-gray-500">Always keep backups of your important files!</p>
          <p className="mt-8 text-sm text-gray-600">Press ESC to return home</p>
        </div>
      </FullscreenPrank>
    )
  }

  if (phase === "encrypting") {
    return (
      <FullscreenPrank className="bg-[#1a0a20]">
        <div className="h-full w-full bg-gradient-to-br from-[#1a0a20] to-black p-8 font-mono">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-red-500 text-5xl mb-4 animate-pulse">&#128274;</div>
              <h1 className="text-3xl font-bold text-red-500 mb-2">LOCKY RANSOMWARE</h1>
              <p className="text-gray-400">Encrypting your files with RSA-2048 + AES-128...</p>
            </div>

            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Encryption Progress</span>
                <span className="text-red-400">{encryptProgress}%</span>
              </div>
              <div className="h-4 bg-gray-900 rounded overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-100"
                  style={{ width: `${encryptProgress}%` }}
                />
              </div>
            </div>

            {/* Files being encrypted */}
            <div className="bg-black/50 border border-red-900 rounded p-4">
              <div className="text-red-400 mb-4 flex items-center gap-2">
                <span className="animate-pulse">&#9679;</span>
                Files being encrypted:
              </div>
              <div className="h-64 overflow-y-auto">
                {visibleFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-900 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-red-500">&#128196;</span>
                      <span className="text-gray-300">{file.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500">{file.size}</span>
                      <span className="text-green-500 text-xs">ENCRYPTED</span>
                    </div>
                  </div>
                ))}
                {visibleFiles.length < encryptedFiles.length && (
                  <div className="py-2 text-yellow-400 animate-pulse text-sm">
                    Encrypting next file...
                  </div>
                )}
              </div>
            </div>

            {/* Warning */}
            <div className="mt-6 text-center text-red-400 text-sm animate-pulse">
              DO NOT CLOSE THIS WINDOW OR TURN OFF YOUR COMPUTER
            </div>
          </div>
        </div>
      </FullscreenPrank>
    )
  }

  // Ransom phase
  return (
    <FullscreenPrank className="bg-[#0a0a15]">
      <div className="h-full w-full bg-[#0a0a15] overflow-y-auto">
        {/* Top banner */}
        <div className="bg-gradient-to-r from-red-900 to-red-800 py-4 px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">!!! IMPORTANT INFORMATION !!!</h1>
          <p className="text-red-200">All your files have been encrypted by Locky ransomware</p>
        </div>

        <div className="max-w-5xl mx-auto p-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Left - Instructions */}
            <div className="col-span-2 space-y-6">
              <div className="bg-black/50 border border-gray-800 rounded p-6">
                <h2 className="text-2xl font-bold text-red-400 mb-4">What happened to your files?</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  All of your files were protected by a strong encryption with RSA-2048 using CryptoWall.
                  More information about the encryption can be found here: https://en.wikipedia.org/wiki/RSA_(cryptosystem)
                </p>
                <p className="text-gray-300 leading-relaxed">
                  What this means is that the structure and data within your files have been irrevocably changed. 
                  You will not be able to work with them, read them or see them. It is the same as losing them forever, 
                  but with our help, you can restore them.
                </p>
              </div>

              <div className="bg-black/50 border border-gray-800 rounded p-6">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">How to recover your files?</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The only way to decrypt your files is to obtain the private key and decryption program.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Any attempt to restore your files with third-party software will be fatal for your files!
                </p>
                <div className="bg-red-950/50 border border-red-800 rounded p-4">
                  <p className="text-red-400 font-bold">
                    WARNING: Do not rename encrypted files. Do not try to decrypt using third-party software. 
                    This may damage your files permanently.
                  </p>
                </div>
              </div>

              {/* Encrypted files preview */}
              <div className="bg-black/50 border border-gray-800 rounded p-6">
                <h2 className="text-xl font-bold text-gray-400 mb-4">Sample of encrypted files:</h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {encryptedFiles.slice(0, 6).map((file, i) => (
                    <div key={i} className="flex items-center gap-2 text-red-400">
                      <span>&#128196;</span>
                      <span className="truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-gray-500 text-sm mt-4">...and {encryptedFiles.length - 6} more files</p>
              </div>
            </div>

            {/* Right - Payment */}
            <div className="space-y-6">
              {/* Countdown */}
              <div className="bg-red-950 border-2 border-red-600 rounded p-6 text-center">
                <div className="text-gray-400 text-sm mb-2">Time until price doubles:</div>
                <div className="text-4xl font-mono font-bold text-white mb-2">{formatTime()}</div>
                {priceMultiplier === 2 && (
                  <div className="text-red-400 text-sm animate-pulse">PRICE HAS DOUBLED!</div>
                )}
              </div>

              {/* Payment */}
              <div className="bg-black/50 border border-green-800 rounded p-6 text-center">
                <div className="text-gray-400 text-sm mb-2">Payment Required:</div>
                <div className="text-4xl font-bold text-green-400 mb-1">
                  {(0.5 * priceMultiplier).toFixed(1)} BTC
                </div>
                <div className="text-gray-500 text-sm mb-4">
                  (~${(0.5 * priceMultiplier * 43000).toLocaleString()} USD)
                </div>
                
                <div className="bg-black rounded p-3 mb-4">
                  <div className="text-xs text-gray-500 mb-1">Bitcoin Address:</div>
                  <div className="text-yellow-400 font-mono text-xs break-all">
                    1LocKy7mVDjHGNXk8aJvDzHQ9pQkVzV5UK
                  </div>
                </div>

                <button 
                  onClick={() => setPhase("joke")}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition-colors cursor-pointer"
                >
                  Verify Payment
                </button>
              </div>

              {/* Personal ID */}
              <div className="bg-black/50 border border-gray-800 rounded p-4">
                <div className="text-xs text-gray-500 mb-2">Your Personal ID:</div>
                <div className="font-mono text-xs text-purple-400 break-all">
                  5HJK2-8DFGH-9WERT-4ASDF-7ZXCV
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FullscreenPrank>
  )
}
