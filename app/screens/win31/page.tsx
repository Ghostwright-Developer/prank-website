"use client"

import { useState, useEffect, useCallback } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

interface ErrorDialog {
  id: number
  x: number
  y: number
  message: string
}

const errorMessages = [
  "A fatal exception 0E has occurred at 0028:C0011E36",
  "KERNEL32.DLL caused a general protection fault",
  "EXPLORER caused an invalid page fault in module SHELL32.DLL",
  "An error has occurred in your program. Click OK to ignore.",
  "Not enough memory to complete operation",
  "Cannot find WIN.COM",
  "Segment Load Failure",
  "Stack Overflow",
  "Divide by Zero Error",
  "EMM386 has detected an error",
]

export default function Win31Screen() {
  const [errors, setErrors] = useState<ErrorDialog[]>([])
  const [dimensions, setDimensions] = useState({ width: 1024, height: 768 })

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
  }, [])

  const createError = useCallback((id: number) => {
    return {
      id,
      x: Math.random() * (dimensions.width - 350) + 20,
      y: Math.random() * (dimensions.height - 150) + 20,
      message: errorMessages[Math.floor(Math.random() * errorMessages.length)],
    }
  }, [dimensions])

  useEffect(() => {
    let idCounter = 0
    
    const addError = () => {
      idCounter++
      setErrors((prev) => [...prev, createError(idCounter)])
    }

    // Add initial errors
    for (let i = 0; i < 3; i++) {
      setTimeout(addError, i * 200)
    }

    // Keep adding errors
    const interval = setInterval(addError, 800)
    return () => clearInterval(interval)
  }, [createError])

  const handleOkClick = (id: number) => {
    setErrors((prev) => prev.filter((e) => e.id !== id))
    // Add 2-3 more errors when clicking OK
    setTimeout(() => {
      const count = Math.floor(Math.random() * 2) + 2
      const newErrors: ErrorDialog[] = []
      for (let i = 0; i < count; i++) {
        newErrors.push(createError(Date.now() + i))
      }
      setErrors((prev) => [...prev, ...newErrors])
    }, 50)
  }

  return (
    <FullscreenPrank className="bg-[#008080]" exitMessage="SYSTEM RESTORED!">
      {/* Desktop background - teal color like Win 3.1 */}
      <div className="h-full w-full bg-[#008080]">
        {/* Program Manager Window */}
        <div className="absolute left-4 top-4 w-64 border-2 border-white bg-[#c0c0c0] shadow-[inset_-2px_-2px_0_#808080,inset_2px_2px_0_#ffffff]">
          <div className="flex items-center justify-between bg-[#000080] px-2 py-1 text-white">
            <span className="text-sm font-bold">Program Manager</span>
            <div className="flex gap-1">
              <button className="h-4 w-4 border border-white bg-[#c0c0c0] text-xs leading-none text-black">_</button>
              <button className="h-4 w-4 border border-white bg-[#c0c0c0] text-xs leading-none text-black">^</button>
            </div>
          </div>
          <div className="p-2 text-sm">
            <p className="text-[#000080]">Main</p>
          </div>
        </div>

        {/* Error Dialogs */}
        {errors.map((error) => (
          <div
            key={error.id}
            className="absolute border-2 border-white bg-[#c0c0c0] shadow-[inset_-2px_-2px_0_#808080,inset_2px_2px_0_#ffffff]"
            style={{ left: error.x, top: error.y, width: 340, zIndex: error.id }}
          >
            <div className="flex items-center justify-between bg-[#000080] px-2 py-1 text-white">
              <span className="text-sm font-bold">Application Error</span>
              <button className="h-4 w-4 border border-white bg-[#c0c0c0] text-xs leading-none text-black">x</button>
            </div>
            <div className="flex gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-white text-3xl text-red-600">
                X
              </div>
              <div className="flex-1">
                <p className="mb-4 font-mono text-xs">{error.message}</p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleOkClick(error.id)}
                    className="border-2 border-white bg-[#c0c0c0] px-6 py-1 text-sm shadow-[inset_-2px_-2px_0_#808080,inset_2px_2px_0_#ffffff] active:shadow-[inset_2px_2px_0_#808080,inset_-2px_-2px_0_#ffffff]"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </FullscreenPrank>
  )
}
