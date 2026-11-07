"use client"

import { useRouter } from "next/navigation"
import { Shuffle } from "lucide-react"

/** Opens a random prank screen. The click counts as the gesture that allows fullscreen. */
export function SurpriseButton({ slugs, className = "" }: { slugs: string[]; className?: string }) {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push(`/screens/${slugs[Math.floor(Math.random() * slugs.length)]}`)}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-pink-400/60 bg-pink-500/15 px-6 py-3 font-semibold text-pink-100 transition-colors hover:bg-pink-500/30 ${className}`}
    >
      <Shuffle className="h-5 w-5" /> Surprise me
    </button>
  )
}
