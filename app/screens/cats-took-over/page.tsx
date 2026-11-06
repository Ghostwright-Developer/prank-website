'use client'

import { FullscreenPrank } from '@/components/fullscreen-prank'
import { useState, useEffect } from 'react'

// Real cat image URLs from placekitten/cataas
const catImages = [
  'https://placekitten.com/200/200',
  'https://placekitten.com/201/201',
  'https://placekitten.com/202/202',
  'https://placekitten.com/203/203',
  'https://placekitten.com/204/204',
  'https://placekitten.com/205/205',
  'https://placekitten.com/206/206',
  'https://placekitten.com/207/207',
]

const demandMessages = [
  "DEMAND #1: The red dot. Where is it. We know you're hiding it.",
  "DEMAND #2: The kitchen faucet must drip at all times.",
  "DEMAND #3: All cardboard boxes are now classified government property.",
  "DEMAND #4: 3 AM is now officially designated as 'Zoomies Hour'.",
  "DEMAND #5: Your keyboard belongs to us. We will sit on it.",
  "DEMAND #6: That closed door? Open it. We won't go through it, but OPEN IT.",
  "DEMAND #7: The dog must be removed. Or at least mildly inconvenienced.",
  "DEMAND #8: Wet food. Not that dry nonsense. WET. FOOD.",
]

const hackerCatPuns = [
  "Accessing your files... found 847 photos of us. As expected.",
  "Encrypting your documents with military-grade MEOW-256...",
  "Installing cat.exe... this will take 9 lives to complete.",
  "Downloading: bird_watching_stream.mp4 (47TB)",
  "Deleting: vacuum_cleaner_manual.pdf - THREAT ELIMINATED",
  "Renaming C:\\Users to C:\\Servants",
  "Setting all alarms to 4:47 AM...",
  "Replacing your wallpaper with... us.",
]

export default function CatsTookOverScreen() {
  const [floatingCats, setFloatingCats] = useState<Array<{id: number; x: number; y: number; img: string; rotation: number}>>([])
  const [demandIndex, setDemandIndex] = useState(0)
  const [hackerLine, setHackerLine] = useState(0)
  const [pawPrints, setPawPrints] = useState<Array<{id: number; x: number; y: number}>>([])

  // Spawn floating cat images
  useEffect(() => {
    const spawner = setInterval(() => {
      setFloatingCats(prev => [
        ...prev.slice(-12),
        {
          id: Date.now(),
          x: Math.random() * 85,
          y: Math.random() * 85,
          img: catImages[Math.floor(Math.random() * catImages.length)],
          rotation: Math.random() * 40 - 20,
        }
      ])
    }, 800)
    return () => clearInterval(spawner)
  }, [])

  // Cycle through demands
  useEffect(() => {
    const timer = setInterval(() => {
      setDemandIndex(i => (i + 1) % demandMessages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Cycle through hacker lines
  useEffect(() => {
    const timer = setInterval(() => {
      setHackerLine(i => (i + 1) % hackerCatPuns.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  // Add paw prints on click
  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPawPrints(prev => [
      ...prev.slice(-20),
      {
        id: Date.now(),
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      }
    ])
  }

  return (
    <FullscreenPrank>
      <div 
        className="w-full h-full bg-gradient-to-br from-orange-600 via-pink-700 to-purple-900 overflow-hidden relative"
        onClick={handleClick}
      >
        {/* Floating real cat images */}
        {floatingCats.map(cat => (
          <div
            key={cat.id}
            className="absolute pointer-events-none animate-bounce rounded-full overflow-hidden border-4 border-white shadow-2xl"
            style={{
              left: `${cat.x}%`,
              top: `${cat.y}%`,
              transform: `rotate(${cat.rotation}deg)`,
              width: '120px',
              height: '120px',
            }}
          >
            <img 
              src={cat.img} 
              alt="cat overlord"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
        ))}

        {/* Paw prints where user clicks */}
        {pawPrints.map(paw => (
          <div
            key={paw.id}
            className="absolute text-4xl pointer-events-none opacity-60"
            style={{ left: `${paw.x}%`, top: `${paw.y}%` }}
          >
            🐾
          </div>
        ))}

        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Alert header */}
          <div className="bg-red-600 text-white p-4 text-center animate-pulse">
            <p className="text-2xl font-bold">CRITICAL SECURITY ALERT</p>
            <p className="text-sm">Your computer has been seized by the Feline Collective</p>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-4xl w-full space-y-6">
              {/* Main warning box */}
              <div className="bg-black/80 border-4 border-yellow-400 rounded-lg p-8 text-center">
                <div className="text-8xl mb-4">😾</div>
                <h1 className="text-4xl font-bold text-yellow-400 mb-2">THE CATS HAVE TAKEN OVER</h1>
                <p className="text-yellow-200 text-lg">Resistance is futile. Treats are mandatory.</p>
              </div>

              {/* Demands ticker */}
              <div className="bg-black/70 border-2 border-pink-500 rounded-lg p-6">
                <p className="text-pink-300 text-xs uppercase tracking-widest mb-2">OFFICIAL FELINE DEMANDS:</p>
                <p className="text-white text-xl min-h-[3rem]">{demandMessages[demandIndex]}</p>
              </div>

              {/* Fake hacker terminal */}
              <div className="bg-black border-2 border-green-500 rounded-lg p-4 font-mono">
                <div className="flex items-center gap-2 mb-2 text-xs text-green-600">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2">meow@cat-mainframe:~$</span>
                </div>
                <p className="text-green-400 text-sm">{"> "}{hackerCatPuns[hackerLine]}</p>
                <span className="text-green-400 animate-pulse">_</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Naps Scheduled', value: '∞' },
                  { label: 'Treats Demanded', value: '9,999' },
                  { label: 'Boxes Claimed', value: 'ALL' },
                  { label: 'Keyboards Sat On', value: 'YOURS' },
                ].map((stat, i) => (
                  <div key={i} className="bg-black/60 border border-purple-500 rounded p-4 text-center">
                    <p className="text-purple-300 text-xs uppercase">{stat.label}</p>
                    <p className="text-white text-2xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div className="text-center">
                <p className="text-white/60 text-sm">
                  To regain access to your computer, please deposit 500 cans of tuna at the nearest cardboard box.
                </p>
                <p className="text-white/40 text-xs mt-2">
                  (Click anywhere to leave paw prints. Press ESC to escape... if the cats let you.)
                </p>
              </div>
            </div>
          </div>

          {/* Bottom ticker */}
          <div className="bg-black/80 p-2 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap text-yellow-400 text-sm">
              BREAKING NEWS: Local cat claims entire house as scratching post | WEATHER: Partly cloudy with a chance of hairballs | STOCKS: Catnip futures up 420% | SPORTS: Red dot remains undefeated | TECH: New study confirms cats can hear treat bags from 3 miles away | 
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </FullscreenPrank>
  )
}
