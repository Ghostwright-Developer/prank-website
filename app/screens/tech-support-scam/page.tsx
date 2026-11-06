"use client"

import { useState, useEffect, useRef } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

const errorMessages = [
  "Your computer has been BLOCKED",
  "Windows Defender Alert: Trojan Found!",
  "CRITICAL SECURITY WARNING",
  "Your personal files are being encrypted!",
  "Banking credentials at risk!",
  "System files corrupted - Call immediately!",
  "DO NOT RESTART YOUR COMPUTER",
  "FBI CRIMINAL INVESTIGATION ALERT",
]

export default function TechSupportScamScreen() {
  const [popups, setPopups] = useState<{ id: number; x: number; y: number; message: string; type: string }[]>([])
  const [showOverlay, setShowOverlay] = useState(true)
  const [audioPlaying, setAudioPlaying] = useState(true)
  const [cursorTrapped, setCursorTrapped] = useState(false)
  const [phase, setPhase] = useState<"scam" | "joke">("scam")
  const popupIdRef = useRef(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  // Spawn popups continuously
  useEffect(() => {
    if (phase !== "scam") return
    
    const spawnPopup = () => {
      if (!mountedRef.current) return
      popupIdRef.current++
      const types = ["error", "warning", "critical", "virus"]
      setPopups(prev => {
        const newPopup = {
          id: popupIdRef.current,
          x: Math.random() * 70 + 5,
          y: Math.random() * 70 + 5,
          message: errorMessages[Math.floor(Math.random() * errorMessages.length)],
          type: types[Math.floor(Math.random() * types.length)]
        }
        return [...prev.slice(-15), newPopup]
      })
    }

    // Initial burst of popups
    for (let i = 0; i < 5; i++) {
      setTimeout(spawnPopup, i * 200)
    }

    // Continue spawning
    const interval = setInterval(spawnPopup, 800)
    return () => clearInterval(interval)
  }, [phase])

  // Trap cursor effect
  useEffect(() => {
    if (phase !== "scam") return
    const handleMouseMove = () => {
      if (Math.random() > 0.7) setCursorTrapped(true)
      setTimeout(() => setCursorTrapped(false), 500)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [phase])

  const handleCallClick = () => {
    setPhase("joke")
  }

  if (phase === "joke") {
    return (
      <FullscreenPrank className="bg-black">
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-green-900 via-black to-green-900 p-8 text-center">
          <div className="text-8xl mb-8">&#128514;</div>
          <h1 className="text-5xl font-bold text-green-400 mb-4">PRANKED!</h1>
          <p className="text-2xl text-green-300 mb-4">This is exactly what a tech support scam looks like.</p>
          <p className="text-lg text-gray-400 mb-2">Real scammers use these exact tactics.</p>
          <p className="text-gray-500">Never call numbers shown in popups like these!</p>
          <p className="mt-8 text-sm text-gray-600">Press ESC to return home</p>
        </div>
      </FullscreenPrank>
    )
  }

  return (
    <FullscreenPrank className="bg-blue-900">
      <div className={`h-full w-full bg-[#0078d7] relative overflow-hidden ${cursorTrapped ? "cursor-none" : ""}`}>
        
        {/* Main BSOD-style background */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
          <div className="text-9xl mb-8">:(</div>
          <h1 className="text-4xl mb-4">Your PC ran into a problem and needs to restart.</h1>
          <p className="text-xl mb-8">We're just collecting some error info, and then we'll restart for you.</p>
          <div className="text-xl animate-pulse">
            0% complete
          </div>
          
          {/* Fake QR code area */}
          <div className="mt-12 flex items-center gap-8">
            <div className="w-32 h-32 bg-white p-2">
              <div className="w-full h-full bg-black" style={{ 
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 4px, white 4px, white 8px), 
                                  repeating-linear-gradient(90deg, transparent, transparent 4px, white 4px, white 8px)` 
              }} />
            </div>
            <div className="text-left">
              <p>For more information about this issue and possible fixes, visit</p>
              <p className="text-yellow-300">https://windows.com/stopcode</p>
              <p className="mt-4 text-2xl font-bold text-yellow-300">Stop code: CRITICAL_PROCESS_DIED</p>
            </div>
          </div>
        </div>

        {/* Fake Windows Security overlay */}
        {showOverlay && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
            <div className="w-[700px] bg-white rounded-lg shadow-2xl overflow-hidden">
              <div className="bg-red-600 px-6 py-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-3xl font-bold">X</span>
                </div>
                <span className="text-white text-xl font-bold">Windows Defender Security Warning</span>
              </div>
              <div className="p-6 text-center">
                <div className="text-6xl mb-4 text-red-500">&#9888;</div>
                <h2 className="text-2xl font-bold text-red-600 mb-4">ACCESS TO THIS PC HAS BEEN BLOCKED FOR SECURITY REASONS</h2>
                <p className="text-gray-700 mb-4">
                  Your computer has alerted us that it has been infected with a Trojan Spyware. 
                  The following information is being stolen:
                </p>
                <ul className="text-left text-red-600 mb-6 pl-12 list-disc">
                  <li>Facebook Logins</li>
                  <li>Credit Card Details</li>
                  <li>Email Account Logins</li>
                  <li>Photos stored on this computer</li>
                  <li>Banking credentials</li>
                </ul>
                <p className="text-lg font-bold text-red-600 mb-6">
                  You must contact us immediately so that our engineers can walk you through the 
                  removal process over the phone. Please call us within the next 5 minutes to prevent 
                  your computer from being disabled.
                </p>
                
                <div className="bg-yellow-100 border-2 border-yellow-500 rounded p-4 mb-6">
                  <p className="text-2xl font-bold text-red-600">TOLL FREE: 1-888-555-0123</p>
                  <p className="text-sm text-gray-600">(Available 24/7 - Microsoft Certified Technicians)</p>
                </div>

                <div className="flex justify-center gap-4">
                  <button 
                    onClick={handleCallClick}
                    className="px-8 py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 animate-pulse"
                  >
                    Call Support Now
                  </button>
                  <button 
                    onClick={() => {
                      setShowOverlay(false)
                      setTimeout(() => setShowOverlay(true), 500)
                    }}
                    className="px-8 py-3 bg-gray-300 text-gray-600 font-bold rounded"
                  >
                    Ignore (Not Recommended)
                  </button>
                </div>

                <p className="mt-4 text-xs text-gray-500">
                  Error # DW6BD36 | Windows Defender Alert | Your security is at risk
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Popup spam */}
        {popups.map(popup => (
          <div 
            key={popup.id}
            className="absolute bg-white border-2 border-red-600 rounded shadow-xl z-20"
            style={{ 
              left: `${popup.x}%`, 
              top: `${popup.y}%`,
              minWidth: "280px"
            }}
          >
            <div className={`px-3 py-1 text-white text-sm font-bold flex justify-between items-center ${
              popup.type === "critical" ? "bg-red-700" :
              popup.type === "virus" ? "bg-purple-700" :
              popup.type === "warning" ? "bg-orange-600" :
              "bg-red-600"
            }`}>
              <span>{popup.type === "virus" ? "VIRUS ALERT" : popup.type === "critical" ? "CRITICAL ERROR" : "SECURITY WARNING"}</span>
              <span 
                className="cursor-pointer px-2 hover:bg-white/20"
                onClick={() => setPopups(prev => [...prev, { 
                  id: popupIdRef.current++, 
                  x: Math.random() * 70 + 5, 
                  y: Math.random() * 70 + 5, 
                  message: errorMessages[Math.floor(Math.random() * errorMessages.length)],
                  type: "error"
                }])}
              >
                X
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{popup.type === "virus" ? "&#128128;" : "&#9888;"}</span>
                <p className="text-red-600 font-bold">{popup.message}</p>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Call Microsoft Support: <span className="font-bold text-red-600">1-888-555-0123</span>
              </p>
              <button 
                onClick={handleCallClick}
                className="w-full py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700"
              >
                Get Help Now
              </button>
            </div>
          </div>
        ))}

        {/* Fake audio indicator */}
        {audioPlaying && (
          <div className="fixed bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded flex items-center gap-2 z-30">
            <span className="animate-pulse text-red-500">&#128266;</span>
            <span className="text-sm">Alert audio playing (simulated)</span>
          </div>
        )}
      </div>
    </FullscreenPrank>
  )
}
