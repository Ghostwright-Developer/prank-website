'use client'

import { FullscreenPrank } from '@/components/fullscreen-prank'
import { useState, useEffect } from 'react'

// Self-contained cat faces (inline SVG data URIs), so nothing depends on an external image host.
const catFace = (fur: string, eye: string) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='#222'/><path d='M35 85 30 20 85 55zM165 85 170 20 115 55z' fill='${fur}'/><ellipse cx='100' cy='108' rx='72' ry='64' fill='${fur}'/><ellipse cx='72' cy='98' rx='13' ry='17' fill='${eye}'/><ellipse cx='128' cy='98' rx='13' ry='17' fill='${eye}'/><ellipse cx='72' cy='98' rx='4' ry='15' fill='#000'/><ellipse cx='128' cy='98' rx='4' ry='15' fill='#000'/><path d='M92 124h16l-8 9z' fill='#e88'/><path d='M100 133v8M100 141q-10 8-20 3M100 141q10 8 20 3' stroke='#000' stroke-width='2.5' fill='none'/><path d='M20 118l45 6M20 134l45-4M180 118l-45 6M180 134l-45-4' stroke='#eee' stroke-width='2'/></svg>`,
  )
const catImages = [
  catFace("#f0a04b", "#9be15d"),
  catFace("#8a8a8a", "#ffd23f"),
  catFace("#f4f1ea", "#4ec3ff"),
  catFace("#2b2b2b", "#ffd23f"),
  catFace("#c27a3a", "#9be15d"),
  catFace("#b8b8b8", "#6fd36f"),
  catFace("#e8c9a0", "#4ec3ff"),
  catFace("#5a4636", "#ffd23f"),
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
