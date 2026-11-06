"use client"

import { useState, useEffect, useRef } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

export default function WannaCryScreen() {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 23, mins: 59, secs: 59 })
  const [priceTimeLeft, setPriceTimeLeft] = useState({ days: 6, hours: 23, mins: 59, secs: 59 })
  const [encryptedCount, setEncryptedCount] = useState(0)
  const [selectedTab, setSelectedTab] = useState<"decrypt" | "check" | "about">("decrypt")
  const [showDecryptAttempt, setShowDecryptAttempt] = useState(false)
  const [phase, setPhase] = useState<"main" | "joke">("main")
  const jokeTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev
        secs--
        if (secs < 0) { secs = 59; mins-- }
        if (mins < 0) { mins = 59; hours-- }
        if (hours < 0) { hours = 23; days-- }
        return { days: Math.max(0, days), hours: Math.max(0, hours), mins: Math.max(0, mins), secs: Math.max(0, secs) }
      })
      setPriceTimeLeft(prev => {
        let { days, hours, mins, secs } = prev
        secs--
        if (secs < 0) { secs = 59; mins-- }
        if (mins < 0) { mins = 59; hours-- }
        if (hours < 0) { hours = 23; days-- }
        return { days: Math.max(0, days), hours: Math.max(0, hours), mins: Math.max(0, mins), secs: Math.max(0, secs) }
      })
    }, 1000)

    // File encryption counter
    const target = 186293
    const encryptInterval = setInterval(() => {
      setEncryptedCount(prev => Math.min(prev + Math.floor(Math.random() * 500) + 100, target))
    }, 50)

    setTimeout(() => {
      clearInterval(encryptInterval)
      setEncryptedCount(target)
    }, 5000)

    // Auto-reveal joke after 30 seconds
    jokeTimeoutRef.current = setTimeout(() => setPhase("joke"), 30000)

    return () => {
      clearInterval(timer)
      clearInterval(encryptInterval)
      if (jokeTimeoutRef.current) clearTimeout(jokeTimeoutRef.current)
    }
  }, [])

  const formatTime = (t: typeof timeLeft) => 
    `${t.days.toString().padStart(2, "0")}:${t.hours.toString().padStart(2, "0")}:${t.mins.toString().padStart(2, "0")}:${t.secs.toString().padStart(2, "0")}`

  if (phase === "joke") {
    return (
      <FullscreenPrank className="bg-black">
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-green-900 via-black to-green-900 p-8 text-center">
          <div className="text-8xl mb-8">&#128522;</div>
          <h1 className="mb-4 text-5xl font-bold text-green-400">RELAX!</h1>
          <p className="mb-4 text-2xl text-green-300">This is just a prank.</p>
          <p className="text-xl text-gray-400">Your files were never encrypted. WannaCry is long gone.</p>
          <p className="mt-8 text-sm text-gray-600">Press ESC to return home</p>
        </div>
      </FullscreenPrank>
    )
  }

  return (
    <FullscreenPrank className="bg-[#8b0000]">
      <div className="flex h-full w-full flex-col bg-gradient-to-b from-[#7a0000] to-[#4a0000]">
        {/* WannaCry Header */}
        <div className="bg-[#8b0000] px-6 py-4 border-b-2 border-[#ff0000]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                <div className="text-red-600 text-2xl font-bold">!</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide">Wana Decrypt0r 2.0</h1>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-red-200">Files Encrypted</div>
              <div className="text-xl font-mono text-white">{encryptedCount.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Message */}
          <div className="w-2/3 p-6 overflow-y-auto">
            <div className="bg-white text-black p-6 rounded">
              <h2 className="text-2xl font-bold text-red-700 mb-4">Ooops, your files have been encrypted!</h2>
              
              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  Your important files are encrypted. Many of your documents, photos, videos, databases 
                  and other files are no longer accessible because they have been encrypted. Maybe you 
                  are busy looking for a way to recover your files, but do not waste your time. Nobody 
                  can recover your files without our decryption service.
                </p>
                
                <p className="font-semibold">
                  Can I Recover My Files?
                </p>
                <p>
                  Sure. We guarantee that you can recover all your files safely and easily. But you have 
                  not so enough time. You can decrypt some of your files for free. Try now by clicking 
                  {"<Decrypt>"} For free decryption you need to purchase the decryption service.
                </p>
                
                <p>
                  <span className="font-semibold">You only have 3 days to submit the payment.</span> After that 
                  the price will be doubled. Also, if you don't pay in 7 days, you won't be able to 
                  recover your files forever.
                </p>

                <p className="text-red-600 font-semibold">
                  We will have free events for users who are so poor that they couldn't pay in 6 months.
                </p>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded">
                  <p className="font-bold text-yellow-800">How Do I Pay?</p>
                  <p className="mt-2">Payment is accepted in Bitcoin only. For more information, click {"<About Bitcoin>"}.</p>
                  <p className="mt-2">Please check the current price and buy some bitcoins. For more information, click {"<How to buy bitcoins>"}</p>
                  <p className="mt-2">And send the correct amount to the address specified in this window.</p>
                  <p className="mt-2 font-semibold">After your payment, click {"<Check Payment>"}. Best time to check: 9:00am - 11:00am GMT from Monday to Friday.</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => setSelectedTab("decrypt")}
                className={`px-4 py-2 rounded-t text-sm font-medium ${selectedTab === "decrypt" ? "bg-white text-red-700" : "bg-red-900 text-white"}`}
              >
                Decrypt
              </button>
              <button 
                onClick={() => setSelectedTab("check")}
                className={`px-4 py-2 rounded-t text-sm font-medium ${selectedTab === "check" ? "bg-white text-red-700" : "bg-red-900 text-white"}`}
              >
                Check Payment
              </button>
              <button 
                onClick={() => setSelectedTab("about")}
                className={`px-4 py-2 rounded-t text-sm font-medium ${selectedTab === "about" ? "bg-white text-red-700" : "bg-red-900 text-white"}`}
              >
                About Bitcoin
              </button>
            </div>

            <div className="bg-white p-4 rounded-b rounded-tr">
              {selectedTab === "decrypt" && (
                <div>
                  <p className="text-sm mb-4">You can decrypt some files for free to verify that decryption works.</p>
                  <button 
                    onClick={() => {
                      setShowDecryptAttempt(true)
                      setTimeout(() => setPhase("joke"), 3000)
                    }}
                    className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Decrypt
                  </button>
                  {showDecryptAttempt && (
                    <div className="mt-4 text-green-600 animate-pulse">Attempting decryption...</div>
                  )}
                </div>
              )}
              {selectedTab === "check" && (
                <div className="text-sm">
                  <p>After sending the payment, please click the button below to verify.</p>
                  <button 
                    onClick={() => setPhase("joke")}
                    className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Check Payment
                  </button>
                </div>
              )}
              {selectedTab === "about" && (
                <div className="text-sm space-y-2">
                  <p>Bitcoin is a worldwide cryptocurrency and digital payment system.</p>
                  <p>It is the first decentralized digital currency, as the system works without a central bank or single administrator.</p>
                  <a href="#" className="text-blue-600 underline">Learn more about Bitcoin</a>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Payment */}
          <div className="w-1/3 bg-[#5a0000] p-6 border-l border-[#ff0000]/20">
            <div className="space-y-6">
              {/* Payment Lost Timer */}
              <div className="bg-[#4a0000] p-4 rounded border border-red-900">
                <div className="text-xs text-red-300 mb-1">Payment will be raised on</div>
                <div className="font-mono text-2xl text-white">{formatTime(priceTimeLeft)}</div>
              </div>

              {/* Files Lost Timer */}
              <div className="bg-[#4a0000] p-4 rounded border border-red-900">
                <div className="text-xs text-red-300 mb-1">Your files will be lost on</div>
                <div className="font-mono text-2xl text-white">{formatTime(timeLeft)}</div>
              </div>

              {/* Bitcoin Address */}
              <div className="bg-[#4a0000] p-4 rounded border border-red-900">
                <div className="text-xs text-red-300 mb-2">Send $300 worth of Bitcoin to:</div>
                <div className="font-mono text-xs text-yellow-300 break-all bg-black/30 p-2 rounded">
                  115p7UMMngoj1pMvkpHijcRdfJNXj6LrLn
                </div>
              </div>

              {/* Copy Address Button */}
              <button className="w-full py-2 bg-[#333] text-white rounded text-sm hover:bg-[#444]">
                Copy Address
              </button>

              {/* Contact */}
              <div className="text-xs text-red-300 text-center">
                <p>Contact us if you have questions.</p>
                <p className="text-yellow-300 mt-1">support@wanaDecrypt0r.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-[#3a0000] px-6 py-3 border-t border-red-900/50">
          <div className="flex items-center justify-between text-xs text-red-300">
            <span>English</span>
            <span>Wana Decrypt0r 2.0</span>
            <span>v2.0</span>
          </div>
        </div>
      </div>
    </FullscreenPrank>
  )
}
