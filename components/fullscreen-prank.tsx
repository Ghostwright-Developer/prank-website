"use client"

import { useEffect, useCallback, useState, useRef } from "react"
import { useRouter } from "next/navigation"

interface FullscreenPrankProps {
  children: React.ReactNode
  className?: string
}

export function FullscreenPrank({
  children,
  className = "",
}: FullscreenPrankProps) {
  const router = useRouter()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const attemptedRef = useRef(false)
  const moveCountRef = useRef(0)

  const requestFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      setIsFullscreen(true)
      return true
    }
    
    try {
      await document.documentElement.requestFullscreen()
      setIsFullscreen(true)
      attemptedRef.current = true
      return true
    } catch {
      return false
    }
  }, [])

  const exitPrank = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    }
    router.push("/")
  }, [router])

  // Try fullscreen on mount
  useEffect(() => {
    requestFullscreen()
  }, [requestFullscreen])

  // Listen for user interactions - including mouse movement
  useEffect(() => {
    if (isFullscreen) return

    const handleClick = () => {
      requestFullscreen()
    }

    const handleTouch = () => {
      requestFullscreen()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "q" || e.key === "Q") {
        exitPrank()
        return
      }
      requestFullscreen()
    }

    // For mouse movement, we need to be clever - browsers may not allow
    // fullscreen on just mousemove, but we can try after enough movement
    const handleMouseMove = () => {
      moveCountRef.current++
      // After significant mouse movement, try on next click-like event
      if (moveCountRef.current > 5 && !attemptedRef.current) {
        // Create a "trust" context by waiting for any interaction
        requestFullscreen()
      }
    }

    const handleScroll = () => {
      requestFullscreen()
    }

    // Add all listeners with capture phase
    document.addEventListener("click", handleClick, { capture: true })
    document.addEventListener("touchstart", handleTouch, { capture: true })
    document.addEventListener("touchend", handleTouch, { capture: true })
    document.addEventListener("keydown", handleKeyDown, { capture: true })
    document.addEventListener("keyup", handleClick, { capture: true })
    document.addEventListener("mousemove", handleMouseMove, { capture: true })
    document.addEventListener("mousedown", handleClick, { capture: true })
    document.addEventListener("mouseup", handleClick, { capture: true })
    document.addEventListener("scroll", handleScroll, { capture: true })
    document.addEventListener("wheel", handleClick, { capture: true })

    return () => {
      document.removeEventListener("click", handleClick, { capture: true })
      document.removeEventListener("touchstart", handleTouch, { capture: true })
      document.removeEventListener("touchend", handleTouch, { capture: true })
      document.removeEventListener("keydown", handleKeyDown, { capture: true })
      document.removeEventListener("keyup", handleClick, { capture: true })
      document.removeEventListener("mousemove", handleMouseMove, { capture: true })
      document.removeEventListener("mousedown", handleClick, { capture: true })
      document.removeEventListener("mouseup", handleClick, { capture: true })
      document.removeEventListener("scroll", handleScroll, { capture: true })
      document.removeEventListener("wheel", handleClick, { capture: true })
    }
  }, [isFullscreen, requestFullscreen, exitPrank])

  // ESC/Q to exit (separate listener that always works)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "q" || e.key === "Q") {
        exitPrank()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [exitPrank])

  // Track fullscreen state changes
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleChange)
    return () => document.removeEventListener("fullscreenchange", handleChange)
  }, [])

  return (
    <div className={`fixed inset-0 overflow-hidden ${className}`}>
      {children}
    </div>
  )
}
