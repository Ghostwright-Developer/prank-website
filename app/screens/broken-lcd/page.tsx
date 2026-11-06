'use client'

import { FullscreenPrank } from '@/components/fullscreen-prank'
import { useEffect, useState } from 'react'

export default function BrokenLCD() {
  const [stripes, setStripes] = useState<Array<{
    left: number
    width: number
    color: string
    flicker: boolean
    type: 'dead' | 'stuck' | 'color'
  }>>([])
  
  const [glitchLines, setGlitchLines] = useState<Array<{
    top: number
    height: number
    offset: number
  }>>([])
  
  useEffect(() => {
    // Generate random vertical stripes (dead/stuck pixels columns)
    const newStripes = []
    
    // Main dead column cluster
    const mainCluster = 30 + Math.random() * 40
    for (let i = 0; i < 5 + Math.floor(Math.random() * 8); i++) {
      newStripes.push({
        left: mainCluster + i * (2 + Math.random() * 3),
        width: 1 + Math.random() * 3,
        color: Math.random() > 0.5 ? 'black' : (Math.random() > 0.5 ? '#00ff00' : '#ff00ff'),
        flicker: Math.random() > 0.7,
        type: Math.random() > 0.6 ? 'dead' : (Math.random() > 0.5 ? 'stuck' : 'color') as 'dead' | 'stuck' | 'color'
      })
    }
    
    // Secondary cluster
    const secondCluster = 60 + Math.random() * 20
    for (let i = 0; i < 3 + Math.floor(Math.random() * 4); i++) {
      newStripes.push({
        left: secondCluster + i * (1 + Math.random() * 2),
        width: 1 + Math.random() * 2,
        color: ['black', '#ff0000', '#00ff00', '#0000ff', '#ffffff'][Math.floor(Math.random() * 5)],
        flicker: Math.random() > 0.5,
        type: 'stuck'
      })
    }
    
    // Random scattered stripes
    for (let i = 0; i < 8 + Math.floor(Math.random() * 12); i++) {
      newStripes.push({
        left: Math.random() * 100,
        width: 1 + Math.random() * 2,
        color: ['black', '#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff', '#ffffff'][Math.floor(Math.random() * 7)],
        flicker: Math.random() > 0.4,
        type: ['dead', 'stuck', 'color'][Math.floor(Math.random() * 3)] as 'dead' | 'stuck' | 'color'
      })
    }
    
    setStripes(newStripes)
    
    // Generate horizontal glitch lines
    const lines = []
    for (let i = 0; i < 4 + Math.floor(Math.random() * 6); i++) {
      lines.push({
        top: Math.random() * 100,
        height: 1 + Math.random() * 4,
        offset: (Math.random() - 0.5) * 20
      })
    }
    setGlitchLines(lines)
  }, [])
  
  // Flicker effect
  const [flickerState, setFlickerState] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setFlickerState(s => s + 1)
    }, 100 + Math.random() * 200)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-[#0a0a12] relative overflow-hidden">
        {/* Fake desktop - barely visible through damage */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-slate-900/30">
          <div className="absolute top-8 left-8 flex flex-col gap-4 opacity-50">
            {['My Computer', 'Trash', 'Firefox'].map((name, i) => (
              <div key={i} className="flex flex-col items-center w-16">
                <div className="w-10 h-10 bg-white/20 rounded mb-1" />
                <span className="text-white text-[10px] text-center">{name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Vertical dead/stuck pixel columns */}
        {stripes.map((stripe, i) => (
          <div
            key={i}
            className="absolute top-0 h-full"
            style={{
              left: `${stripe.left}%`,
              width: `${stripe.width}px`,
              backgroundColor: stripe.flicker && flickerState % 3 === 0 
                ? (stripe.color === 'black' ? '#111' : 'black')
                : stripe.color,
              opacity: stripe.type === 'dead' ? 1 : 0.9,
              mixBlendMode: stripe.type === 'color' ? 'screen' : 'normal'
            }}
          />
        ))}
        
        {/* Horizontal glitch/offset lines */}
        {glitchLines.map((line, i) => (
          <div
            key={`line-${i}`}
            className="absolute left-0 right-0 overflow-hidden"
            style={{
              top: `${line.top}%`,
              height: `${line.height}px`,
              transform: `translateX(${line.offset + (flickerState % 5) * (Math.random() - 0.5) * 2}px)`,
              backgroundColor: flickerState % 7 === 0 ? 'rgba(255,0,255,0.3)' : 'transparent'
            }}
          >
            <div 
              className="w-full h-full"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(0,255,255,${0.1 + Math.random() * 0.2}), transparent)`
              }}
            />
          </div>
        ))}
        
        {/* LCD bleed/pressure damage */}
        <div 
          className="absolute rounded-full blur-xl"
          style={{
            left: '35%',
            top: '40%',
            width: '200px',
            height: '150px',
            background: 'radial-gradient(ellipse, rgba(100,0,100,0.4) 0%, transparent 70%)'
          }}
        />
        <div 
          className="absolute rounded-full blur-lg"
          style={{
            left: '55%',
            top: '25%',
            width: '120px',
            height: '100px',
            background: 'radial-gradient(ellipse, rgba(0,50,100,0.5) 0%, transparent 60%)'
          }}
        />
        
        {/* Static noise overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Scanlines */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
          }}
        />
      </div>
    </FullscreenPrank>
  )
}
