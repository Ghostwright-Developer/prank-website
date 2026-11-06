'use client'

import { FullscreenPrank } from '@/components/fullscreen-prank'
import { useEffect, useRef, useState } from 'react'

export default function Win10RealisticUpdate() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [percent, setPercent] = useState(0)
  
  // Animate percent up to 92 then freeze
  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(p => {
        if (p >= 92) {
          clearInterval(interval)
          return 92
        }
        // Slow down as we approach 92
        const increment = p < 50 ? 2 : p < 80 ? 1 : 0.3
        return Math.min(92, p + increment + Math.random() * 0.5)
      })
    }, 800)
    
    return () => clearInterval(interval)
  }, [])
  
  // Canvas-based spinning dots animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const size = 80
    canvas.width = size
    canvas.height = size
    
    const centerX = size / 2
    const centerY = size / 2
    const radius = 28
    const dotRadius = 4
    const numDots = 5
    const dotSpacing = 0.4 // radians between dots
    
    let rotation = 0
    let cycleProgress = 0 // 0 to 1 for each full rotation
    let dotsVisible = Array(numDots).fill(true)
    let shootingPhase = false
    let shootProgress = 0
    
    const animate = () => {
      ctx.clearRect(0, 0, size, size)
      
      // Dots move counter-clockwise (negative rotation)
      // Speed varies: slower going up (top half), faster going down
      const baseSpeed = 0.035
      
      // Calculate speed based on position - slower at top, faster at bottom
      const topPosition = Math.cos(rotation) // -1 at top, 1 at bottom
      const speedMultiplier = 0.6 + (topPosition + 1) * 0.4 // 0.6 at top, 1.4 at bottom
      
      rotation -= baseSpeed * speedMultiplier
      cycleProgress += baseSpeed * speedMultiplier / (Math.PI * 2)
      
      if (cycleProgress >= 2) {
        // After 2 rotations, start disappearing phase
        if (!shootingPhase) {
          shootingPhase = true
          dotsVisible = Array(numDots).fill(true)
        }
      }
      
      if (shootingPhase) {
        shootProgress += 0.03
        
        // Dots disappear one by one at bottom
        const disappearThreshold = Math.PI * 0.5 // Bottom of circle
        
        for (let i = 0; i < numDots; i++) {
          const dotAngle = rotation + i * dotSpacing
          const normalizedAngle = ((dotAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
          
          // Disappear when passing bottom (around PI/2 or 3PI/2)
          if (normalizedAngle > Math.PI * 0.4 && normalizedAngle < Math.PI * 0.6) {
            dotsVisible[i] = false
          }
        }
        
        // Reset after all dots disappear
        if (dotsVisible.every(v => !v) || shootProgress > 2) {
          shootingPhase = false
          shootProgress = 0
          cycleProgress = 0
          dotsVisible = Array(numDots).fill(true)
        }
      }
      
      // Draw dots
      for (let i = 0; i < numDots; i++) {
        if (!dotsVisible[i] && !shootingPhase) continue
        
        const dotAngle = rotation + i * dotSpacing
        
        let x, y
        
        if (shootingPhase && !dotsVisible[i]) {
          // Shooting out animation - dots fly outward from bottom
          const shootAngle = Math.PI / 2 + (i - 2) * 0.3
          const shootDistance = shootProgress * 50
          x = centerX + Math.cos(shootAngle) * shootDistance
          y = centerY + Math.sin(shootAngle) * shootDistance
          
          // Fade out
          const alpha = Math.max(0, 1 - shootProgress * 0.8)
          ctx.globalAlpha = alpha
        } else if (dotsVisible[i]) {
          x = centerX + Math.cos(dotAngle) * radius
          y = centerY + Math.sin(dotAngle) * radius
          
          // Fade based on position in chain (first dot most visible)
          const alpha = 1 - (i * 0.15)
          ctx.globalAlpha = alpha
        } else {
          continue
        }
        
        ctx.beginPath()
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2)
        ctx.fillStyle = 'white'
        ctx.fill()
        ctx.globalAlpha = 1
      }
      
      requestAnimationFrame(animate)
    }
    
    const animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])
  
  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-black flex flex-col items-center justify-center select-none">
        {/* Spinning dots */}
        <canvas 
          ref={canvasRef} 
          className="mb-10"
          style={{ width: 80, height: 80 }}
        />
        
        {/* Update text */}
        <div className="text-center text-white font-light">
          <p className="text-lg tracking-wide mb-1" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            Updates are underway.
          </p>
          <p className="text-lg tracking-wide mb-6" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            {Math.floor(percent)}% complete
          </p>
          <p className="text-sm text-gray-400" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            Please keep your computer on.
          </p>
        </div>
      </div>
    </FullscreenPrank>
  )
}
