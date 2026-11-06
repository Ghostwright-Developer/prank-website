'use client'

import { FullscreenPrank } from '@/components/fullscreen-prank'
import { Clock } from '@/components/clock'
import { useEffect, useState } from 'react'

interface Pixel {
  x: number
  y: number
  size: number
  type: 'dead' | 'stuck-white' | 'stuck-red' | 'stuck-green' | 'stuck-blue' | 'hot'
}

export default function DeadPixels() {
  const [pixels, setPixels] = useState<Pixel[]>([])
  const [hotPixelFlicker, setHotPixelFlicker] = useState(0)
  
  useEffect(() => {
    const newPixels: Pixel[] = []
    
    // Cluster of dead pixels (common failure pattern)
    const clusterX = 20 + Math.random() * 60
    const clusterY = 20 + Math.random() * 60
    for (let i = 0; i < 15 + Math.floor(Math.random() * 20); i++) {
      newPixels.push({
        x: clusterX + (Math.random() - 0.5) * 8,
        y: clusterY + (Math.random() - 0.5) * 8,
        size: 1 + Math.random() * 2,
        type: Math.random() > 0.3 ? 'dead' : 'stuck-white'
      })
    }
    
    // Scattered dead pixels
    for (let i = 0; i < 30 + Math.floor(Math.random() * 40); i++) {
      const types: Pixel['type'][] = ['dead', 'stuck-white', 'stuck-red', 'stuck-green', 'stuck-blue', 'hot']
      newPixels.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 1.5,
        type: types[Math.floor(Math.random() * types.length)]
      })
    }
    
    // Line of stuck pixels (common LCD defect)
    const lineY = 30 + Math.random() * 40
    for (let i = 0; i < 50; i++) {
      if (Math.random() > 0.3) {
        newPixels.push({
          x: 10 + i * 1.5,
          y: lineY + (Math.random() - 0.5) * 0.5,
          size: 1,
          type: 'stuck-green'
        })
      }
    }
    
    setPixels(newPixels)
  }, [])
  
  // Hot pixel flicker
  useEffect(() => {
    const interval = setInterval(() => {
      setHotPixelFlicker(f => f + 1)
    }, 50)
    return () => clearInterval(interval)
  }, [])
  
  const getPixelColor = (pixel: Pixel): string => {
    switch (pixel.type) {
      case 'dead':
        return 'rgb(0, 0, 0)'
      case 'stuck-white':
        return 'rgb(255, 255, 255)'
      case 'stuck-red':
        return 'rgb(255, 0, 0)'
      case 'stuck-green':
        return 'rgb(0, 255, 0)'
      case 'stuck-blue':
        return 'rgb(0, 0, 255)'
      case 'hot':
        // Hot pixels flicker
        return hotPixelFlicker % 2 === 0 ? 'rgb(255, 255, 255)' : 'rgb(200, 200, 255)'
      default:
        return 'rgb(0, 0, 0)'
    }
  }
  
  return (
    <FullscreenPrank>
      <div className="w-full h-full relative overflow-hidden">
        {/* Normal looking desktop background */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        />
        
        {/* Fake Windows taskbar */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#1a1a1a]/90 backdrop-blur flex items-center px-4">
          <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
            </svg>
          </div>
          <div className="ml-4 flex gap-2">
            <div className="w-10 h-10 bg-white/10 rounded" />
            <div className="w-10 h-10 bg-white/10 rounded" />
            <div className="w-10 h-10 bg-white/10 rounded" />
          </div>
          <div className="ml-auto text-white text-sm">
            <Clock />
          </div>
        </div>
        
        {/* Desktop icons */}
        <div className="absolute top-8 left-8 flex flex-col gap-6">
          {['This PC', 'Recycle Bin', 'Chrome', 'Steam'].map((name, i) => (
            <div key={i} className="flex flex-col items-center w-20">
              <div className="w-12 h-12 bg-white/20 rounded-lg mb-1 backdrop-blur" />
              <span className="text-white text-xs text-center drop-shadow-lg">{name}</span>
            </div>
          ))}
        </div>
        
        {/* Dead/stuck pixels overlay */}
        {pixels.map((pixel, i) => (
          <div
            key={i}
            className="absolute rounded-sm"
            style={{
              left: `${pixel.x}%`,
              top: `${pixel.y}%`,
              width: `${pixel.size}px`,
              height: `${pixel.size}px`,
              backgroundColor: getPixelColor(pixel),
              boxShadow: pixel.type === 'hot' ? '0 0 2px white' : 'none'
            }}
          />
        ))}
        
        {/* Info text (subtle, looks like it could be a wallpaper watermark) */}
        <div className="absolute bottom-16 right-4 text-white/30 text-xs text-right">
          Display defects detected<br />
          Contact manufacturer for warranty
        </div>
      </div>
    </FullscreenPrank>
  )
}
