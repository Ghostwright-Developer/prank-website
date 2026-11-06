'use client'

import { FullscreenPrank } from '@/components/fullscreen-prank'
import { useState, useEffect } from 'react'

export default function FBIWarningScreen() {
  const [showReveal, setShowReveal] = useState(false)
  const [time, setTime] = useState(3599)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = () => {
    const mins = Math.floor(time / 60)
    const secs = time % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-blue-950 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* FBI Header */}
          <div className="bg-blue-900 border-4 border-yellow-500 p-6 mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-blue-900 font-bold text-sm">FBI</span>
              </div>
              <div className="text-center flex-1">
                <h1 className="text-3xl text-yellow-400 font-bold">FBI WARNING</h1>
                <p className="text-yellow-300">Intergalactic Cyber Crimes Division</p>
              </div>
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">DOJ</span>
              </div>
            </div>
          </div>

          {/* Main Warning */}
          <div className="bg-red-950 border-4 border-red-600 p-8 mb-6 text-center">
            <p className="text-white text-2xl font-bold mb-4 animate-pulse">
              ⚠️ YOUR COMPUTER HAS BEEN LOCKED ⚠️
            </p>
            <p className="text-red-300 text-lg mb-6">
              You have committed the following violations on Mars:
            </p>

            {/* Absurd Charges */}
            <div className="bg-black/50 p-6 rounded mb-6 space-y-4">
              <div className="text-left">
                <p className="text-yellow-400 font-bold">• Article 69.420 - Intergalactic Meme Trafficking</p>
                <p className="text-gray-300 text-sm">Distribution of spicy memes across planetary borders</p>
              </div>
              <div className="text-left">
                <p className="text-yellow-400 font-bold">• Statute 1337-B - Excessive Comic Sans Usage</p>
                <p className="text-gray-300 text-sm">Crimes against typography and good taste</p>
              </div>
              <div className="text-left">
                <p className="text-yellow-400 font-bold">• Code MARS-42 - Unauthorized Pineapple Pizza Possession</p>
                <p className="text-gray-300 text-sm">Intent to serve tropical fruit on Italian cuisine</p>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-4">
              <strong>Jurisdiction:</strong> Olympus Mons Security Station, Mars<br/>
              <strong>Location:</strong> 18.65°N 226.20°E<br/>
              <strong>Fine Amount:</strong> $500 USD or equivalent
            </p>
          </div>

          {/* Timer and Button */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-black border-2 border-yellow-500 p-4 text-center">
              <p className="text-yellow-400 text-sm mb-2">Time to Pay:</p>
              <p className="text-white text-3xl font-mono">{formatTime()}</p>
            </div>
            <button 
              onClick={() => setShowReveal(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded cursor-pointer transition-colors"
            >
              I Have Paid iTunes Gift Cards
            </button>
          </div>

          {/* Joke Reveal */}
          {showReveal && (
            <div className="bg-green-950 border-4 border-green-500 p-6 text-center">
              <p className="text-green-300 text-2xl font-bold mb-3">🎉 JUST A PRANK! 🎉</p>
              <p className="text-green-200 mb-2">This is a common ransomware scam!</p>
              <p className="text-gray-300 text-sm">The real FBI never locks your computer or demands payment.</p>
              <p className="text-gray-400 text-xs mt-2">Also, we're on Mars, so you're definitely safe! 🚀</p>
            </div>
          )}
        </div>
      </div>
    </FullscreenPrank>
  )
}
