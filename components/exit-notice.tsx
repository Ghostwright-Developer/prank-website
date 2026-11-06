"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { EXIT_MESSAGE_KEY } from "@/components/fullscreen-prank"

const VISIBLE_MS = 3500

/**
 * Shows the `exitMessage` of the prank the viewer just left (e.g. "FILES
 * DECRYPTED!") as a short banner on the page they land on.
 */
export function ExitNotice() {
  const pathname = usePathname()
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (pathname.startsWith("/screens")) return
    let stored: string | null = null
    try {
      stored = sessionStorage.getItem(EXIT_MESSAGE_KEY)
      if (stored) sessionStorage.removeItem(EXIT_MESSAGE_KEY)
    } catch {
      return
    }
    if (!stored) return
    setMessage(stored)
    const timer = setTimeout(() => setMessage(null), VISIBLE_MS)
    return () => clearTimeout(timer)
  }, [pathname])

  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-6 z-[100] flex justify-center px-4"
    >
      <div className="rounded-lg border border-green-500/40 bg-green-950/90 px-6 py-3 font-mono text-sm tracking-wider text-green-300 shadow-[0_0_30px_rgba(34,197,94,0.25)] backdrop-blur">
        <span className="mr-2 text-green-400">&#10003;</span>
        {message}
      </div>
    </div>
  )
}
