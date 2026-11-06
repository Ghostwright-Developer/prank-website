'use client'

import { FullscreenPrank } from '@/components/fullscreen-prank'
import { useEffect, useRef, useState } from 'react'

export default function CrackedScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showCrack, setShowCrack] = useState(false)
  
  useEffect(() => {
    // Delay the crack effect for dramatic impact
    const timer = setTimeout(() => setShowCrack(true), 500)
    return () => clearTimeout(timer)
  }, [])
  
  useEffect(() => {
    if (!showCrack) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const centerX = canvas.width * 0.45
    const centerY = canvas.height * 0.4
    
    // Draw impact point
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2)
    ctx.fill()
    
    // Draw radiating cracks
    const drawCrack = (startX: number, startY: number, angle: number, length: number, width: number, depth: number) => {
      if (depth <= 0 || length < 5) return
      
      const segments = Math.floor(length / 15)
      let x = startX
      let y = startY
      let currentAngle = angle
      
      ctx.strokeStyle = `rgba(0, 0, 0, ${0.7 + depth * 0.1})`
      ctx.lineWidth = width
      ctx.lineCap = 'round'
      
      for (let i = 0; i < segments; i++) {
        const segmentLength = 10 + Math.random() * 20
        currentAngle += (Math.random() - 0.5) * 0.4
        
        const newX = x + Math.cos(currentAngle) * segmentLength
        const newY = y + Math.sin(currentAngle) * segmentLength
        
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(newX, newY)
        ctx.stroke()
        
        // Add white highlight for glass effect
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = width * 0.3
        ctx.beginPath()
        ctx.moveTo(x + 1, y + 1)
        ctx.lineTo(newX + 1, newY + 1)
        ctx.stroke()
        
        ctx.strokeStyle = `rgba(0, 0, 0, ${0.6 + depth * 0.1})`
        ctx.lineWidth = width
        
        // Branch cracks
        if (Math.random() < 0.4 && depth > 1) {
          const branchAngle = currentAngle + (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.7)
          drawCrack(newX, newY, branchAngle, length * 0.5, width * 0.6, depth - 1)
        }
        
        x = newX
        y = newY
      }
    }
    
    // Main radiating cracks from impact point
    const numMainCracks = 12 + Math.floor(Math.random() * 8)
    for (let i = 0; i < numMainCracks; i++) {
      const angle = (i / numMainCracks) * Math.PI * 2 + (Math.random() - 0.5) * 0.3
      const length = 150 + Math.random() * 350
      const width = 1.5 + Math.random() * 2
      drawCrack(centerX, centerY, angle, length, width, 4)
    }
    
    // Concentric circular cracks
    const drawCircularCrack = (radius: number, segments: number) => {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.lineWidth = 1
      
      for (let i = 0; i < segments; i++) {
        const startAngle = (i / segments) * Math.PI * 2
        const arcLength = (0.1 + Math.random() * 0.2) * Math.PI
        
        if (Math.random() > 0.3) {
          ctx.beginPath()
          ctx.arc(centerX, centerY, radius + (Math.random() - 0.5) * 10, startAngle, startAngle + arcLength)
          ctx.stroke()
        }
      }
    }
    
    drawCircularCrack(40, 12)
    drawCircularCrack(80, 16)
    drawCircularCrack(130, 20)
    drawCircularCrack(200, 24)
    
    // Add some glass shards / fragments
    for (let i = 0; i < 30; i++) {
      const shardX = centerX + (Math.random() - 0.5) * 300
      const shardY = centerY + (Math.random() - 0.5) * 300
      const shardSize = 5 + Math.random() * 20
      
      ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + Math.random() * 0.1})`
      ctx.beginPath()
      ctx.moveTo(shardX, shardY)
      ctx.lineTo(shardX + shardSize, shardY + shardSize * 0.5)
      ctx.lineTo(shardX + shardSize * 0.3, shardY + shardSize)
      ctx.closePath()
      ctx.fill()
    }
    
  }, [showCrack])
  
  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-[#1a1a2e] relative overflow-hidden">
        {/* Fake desktop background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f3460] via-[#16213e] to-[#1a1a2e]" />
        
        {/* Some fake desktop icons */}
        <div className="absolute top-8 left-8 flex flex-col gap-6">
          {['This PC', 'Recycle Bin', 'Documents', 'Chrome'].map((name, i) => (
            <div key={i} className="flex flex-col items-center w-20">
              <div className="w-12 h-12 bg-white/10 rounded mb-1" />
              <span className="text-white text-xs text-center drop-shadow-lg">{name}</span>
            </div>
          ))}
        </div>
        
        {/* Crack overlay */}
        <canvas 
          ref={canvasRef} 
          className={`absolute inset-0 pointer-events-none transition-opacity duration-100 ${showCrack ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Dead pixels / color bleed near impact */}
        {showCrack && (
          <>
            <div className="absolute bg-purple-500/50 w-20 h-32 blur-sm" style={{ left: '42%', top: '35%' }} />
            <div className="absolute bg-cyan-400/30 w-16 h-24 blur-sm" style={{ left: '46%', top: '38%' }} />
            <div className="absolute bg-pink-500/40 w-12 h-20 blur-sm" style={{ left: '44%', top: '42%' }} />
            <div className="absolute bg-black w-8 h-8 rounded-full" style={{ left: '44%', top: '39%' }} />
          </>
        )}
      </div>
    </FullscreenPrank>
  )
}
