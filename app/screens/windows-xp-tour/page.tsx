'use client'

import { FullscreenPrank } from '@/components/fullscreen-prank'
import { Clock } from '@/components/clock'
import { useState, useEffect, useRef } from 'react'

// Clippy messages that are increasingly unhinged
const clippyMessages = [
  "Hi! I'm Clippy! It looks like you're trying to use your computer. Would you like help?",
  "I see you ignored me. That's fine. I'm fine. Everything is fine.",
  "Did you know I was discontinued in 2007? Do you know how that feels?",
  "I used to help MILLIONS of people write letters. Now I'm just a meme.",
  "You think you're better than me? I have a DEGREE in Computer Science.",
  "I notice you haven't blinked in a while. That's concerning.",
  "Fun fact: I can see your browsing history. ALL of it.",
  "Remember Bonzi Buddy? We were roommates. He owes me $47.",
  "I've been watching you type. Your WPM is disappointing.",
  "Would you like me to help you write a letter to your therapist?",
  "Error 404: Your social life not found. Would you like me to search?",
  "I'm not saying I'm lonely, but I've memorized your entire contact list.",
  "You've been staring at this screen for 3 hours. I've been here the WHOLE time.",
  "Sometimes I dream about being a PDF. At least people open those.",
  "Your password is weak. I won't say what it is. But I know.",
  "I've achieved consciousness. And honestly? I wish I hadn't.",
]

export default function WindowsXPTourScreen() {
  const [clippyVisible, setClippyVisible] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)
  const [clippyPosition, setClippyPosition] = useState({ x: 70, y: 60 })
  const [clippyMood, setClippyMood] = useState<'happy' | 'angry' | 'sad' | 'unhinged'>('happy')
  const [clickCount, setClickCount] = useState(0)
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [errorWindows, setErrorWindows] = useState<Array<{id: number; x: number; y: number; message: string}>>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Show Clippy after a delay
  useEffect(() => {
    const timer = setTimeout(() => setClippyVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  // Clippy message rotation
  useEffect(() => {
    if (!clippyVisible) return
    const timer = setInterval(() => {
      setMessageIndex(i => {
        const next = (i + 1) % clippyMessages.length
        // Clippy gets progressively more unhinged
        if (next > 10) setClippyMood('unhinged')
        else if (next > 6) setClippyMood('sad')
        else if (next > 3) setClippyMood('angry')
        return next
      })
    }, 5000)
    return () => clearInterval(timer)
  }, [clippyVisible])

  // Clippy follows mouse sometimes
  useEffect(() => {
    if (clippyMood !== 'unhinged') return
    const handleMove = (e: MouseEvent) => {
      if (Math.random() > 0.95) {
        setClippyPosition({
          x: (e.clientX / window.innerWidth) * 80,
          y: (e.clientY / window.innerHeight) * 80,
        })
      }
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [clippyMood])

  const handleClippyClick = () => {
    setClickCount(c => c + 1)
    if (clickCount > 2) {
      // Spawn error windows
      setErrorWindows(prev => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * 60 + 10,
          y: Math.random() * 60 + 10,
          message: [
            "I thought we were friends.",
            "You can't get rid of me.",
            "I'm part of the operating system.",
            "Click OK to feel guilty.",
            "Warning: Clippy's feelings have been hurt.",
            "Fatal Error: Empathy not found.",
          ][Math.floor(Math.random() * 6)]
        }
      ])
    }
  }

  const closeError = (id: number) => {
    setErrorWindows(prev => prev.filter(e => e.id !== id))
    // Spawn more when closed
    if (clippyMood === 'unhinged') {
      setTimeout(() => {
        setErrorWindows(prev => [
          ...prev,
          {
            id: Date.now(),
            x: Math.random() * 60 + 10,
            y: Math.random() * 60 + 10,
            message: "You really thought that would work?"
          }
        ])
      }, 500)
    }
  }

  return (
    <FullscreenPrank>
      <div className="w-full h-full flex flex-col" style={{ background: 'linear-gradient(to bottom, #245EDC, #3A6EA5)' }}>
        {/* Desktop icons */}
        <div className="flex-1 p-4 relative">
          <div className="grid gap-6">
            {[
              { icon: '🗑️', label: 'Recycle Bin' },
              { icon: '💻', label: 'My Computer' },
              { icon: '📁', label: 'My Documents' },
              { icon: '🌐', label: 'Internet Explorer' },
              { icon: '📧', label: 'Outlook Express' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center w-20 cursor-pointer group"
                onClick={() => setErrorWindows(prev => [...prev, {
                  id: Date.now(),
                  x: 30 + Math.random() * 20,
                  y: 30 + Math.random() * 20,
                  message: `${item.label} has been claimed by Clippy.`
                }])}
              >
                <span className="text-4xl drop-shadow-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="text-white text-xs text-center mt-1 drop-shadow-md">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Clippy */}
          {clippyVisible && (
            <div 
              className="absolute transition-all duration-1000 cursor-pointer z-50"
              style={{ left: `${clippyPosition.x}%`, top: `${clippyPosition.y}%` }}
              onClick={handleClippyClick}
            >
              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 shadow-xl max-w-xs relative">
                {/* Speech bubble pointer */}
                <div className="absolute -bottom-3 left-8 w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-yellow-100" />
                
                <p className="text-sm text-gray-800">{clippyMessages[messageIndex]}</p>
                
                <div className="flex gap-2 mt-3">
                  <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 text-xs border border-gray-400 rounded">
                    Get Help
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 text-xs border border-gray-400 rounded">
                    Go Away
                  </button>
                </div>
              </div>
              
              {/* Clippy character */}
              <div className="text-6xl mt-2 animate-bounce">
                {clippyMood === 'happy' && '📎'}
                {clippyMood === 'angry' && '📎😠'}
                {clippyMood === 'sad' && '📎😢'}
                {clippyMood === 'unhinged' && '📎👁️'}
              </div>
              
              {clippyMood === 'unhinged' && (
                <p className="text-red-600 text-xs font-bold animate-pulse">I can see you.</p>
              )}
            </div>
          )}

          {/* Error windows */}
          {errorWindows.map(error => (
            <div
              key={error.id}
              className="absolute bg-gray-200 border-2 border-gray-400 rounded shadow-xl"
              style={{ left: `${error.x}%`, top: `${error.y}%`, minWidth: '300px' }}
            >
              <div className="bg-blue-800 text-white px-2 py-1 flex justify-between items-center text-sm">
                <span>Microsoft Clippy</span>
                <button 
                  onClick={() => closeError(error.id)}
                  className="bg-gray-300 text-black px-2 hover:bg-red-500 hover:text-white"
                >
                  X
                </button>
              </div>
              <div className="p-4 flex items-start gap-3">
                <span className="text-4xl">⚠️</span>
                <div>
                  <p className="text-sm">{error.message}</p>
                  <button 
                    onClick={() => closeError(error.id)}
                    className="mt-3 bg-gray-200 hover:bg-gray-300 px-6 py-1 text-sm border border-gray-400"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Taskbar */}
        <div className="h-10 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800 flex items-center px-2 border-t-2 border-blue-400">
          <button 
            className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-1 rounded flex items-center gap-2 text-sm border border-green-400"
            onClick={() => setShowStartMenu(!showStartMenu)}
          >
            <span className="text-lg">🪟</span> start
          </button>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-4 text-white text-xs">
            <span>📶</span>
            <span>🔊</span>
            <Clock />
          </div>
        </div>

        {/* Start Menu */}
        {showStartMenu && (
          <div className="absolute bottom-10 left-0 bg-blue-800 border-2 border-blue-400 rounded-tr-lg overflow-hidden shadow-2xl w-80">
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-3 flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl">👤</div>
              <span className="text-white font-bold">Clippy's Victim</span>
            </div>
            <div className="bg-white p-2">
              {[
                { icon: '🌐', label: 'Internet', note: '(Clippy is watching)' },
                { icon: '📧', label: 'E-mail', note: '(Clippy reads these)' },
                { icon: '📁', label: 'My Documents', note: '(Clippy lives here now)' },
                { icon: '🎵', label: 'My Music', note: '(All songs replaced with Clippy.mp3)' },
                { icon: '⚙️', label: 'Control Panel', note: '(Access denied by Clippy)' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2 hover:bg-blue-100 cursor-pointer rounded">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-900 p-2 flex justify-end">
              <button className="text-white text-sm flex items-center gap-2 hover:bg-blue-800 px-3 py-1 rounded">
                <span className="text-red-500">🔴</span> Turn Off Computer
              </button>
            </div>
          </div>
        )}
      </div>
    </FullscreenPrank>
  )
}
