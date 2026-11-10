"use client"

import { useEffect } from "react"
import { currentPrankSlug, trackPrank } from "@/lib/track"

/**
 * If a prank screen crashes, show something calm instead of a white page, and
 * record prank_error (error NAME only, never the message or anything typed).
 */
export default function ScreenError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    trackPrank("prank_error", { prank_name: currentPrankSlug() || "unknown", error_code: (error.name || "Error").slice(0, 40) })
  }, [error])
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black px-6 text-center text-white">
      <div>
        <p className="text-xl font-semibold">This screen hit a problem.</p>
        <p className="mt-2 text-zinc-400">Sorry about that. It has been noted.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={reset} className="rounded-lg bg-cyan-400 px-5 py-2 font-semibold text-zinc-950 hover:bg-cyan-300">Try again</button>
          <a href="/" className="rounded-lg border border-zinc-600 px-5 py-2 hover:border-zinc-300">Back to home</a>
        </div>
      </div>
    </div>
  )
}
