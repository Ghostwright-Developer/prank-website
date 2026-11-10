"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, Play, SlidersHorizontal } from "lucide-react"
import { LinkCopier } from "@/components/link-copier"
import { SetupDialog } from "@/components/setup-dialog"

type Fs = HTMLElement & { webkitRequestFullscreen?: () => void }

/**
 * Launch / Set up / Copy link for a guide page. The Launch click is the user
 * gesture browsers require for fullscreen: we request fullscreen first, then
 * navigate client-side (the document stays fullscreen), so the prank starts
 * fullscreen right away.
 */
export function GuideActions({ slug, name, blurb }: { slug: string; name: string; blurb: string }) {
  const router = useRouter()
  const [setup, setSetup] = useState(false)
  const [linkBar, setLinkBar] = useState(false)

  const launch = () => {
    const el = document.documentElement as Fs
    try {
      const p = el.requestFullscreen?.() as Promise<void> | undefined
      if (p && typeof p.catch === "function") p.catch(() => {})
      else el.webkitRequestFullscreen?.()
    } catch { /* fullscreen refused: the prank page retries on first click */ }
    router.push(`/screens/${slug}`)
  }

  const copy = () => setLinkBar(true)

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button onClick={launch} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-base font-bold text-zinc-950 transition-colors hover:bg-cyan-300">
          <Play className="h-5 w-5 fill-zinc-950" /> Launch {name} fullscreen
        </button>
        <button onClick={() => setSetup(true)} className="inline-flex items-center gap-2 rounded-xl border border-zinc-500 bg-zinc-800 px-5 py-3 text-base font-medium text-white transition-colors hover:border-zinc-300 hover:bg-zinc-700">
          <SlidersHorizontal className="h-5 w-5" /> Set up with a delay
        </button>
        <button onClick={copy} className="inline-flex items-center gap-2 rounded-xl border border-zinc-500 bg-zinc-800 px-5 py-3 text-base font-medium text-white transition-colors hover:border-zinc-300 hover:bg-zinc-700">
          <Copy className="h-5 w-5" /> Copy prank link
        </button>
      </div>
      {linkBar && <LinkCopier getUrl={() => `${location.origin}/screens/${slug}`} onClose={() => setLinkBar(false)} />}
      {setup && <SetupDialog slug={slug} name={name} blurb={blurb} onClose={() => setSetup(false)} />}
    </>
  )
}
