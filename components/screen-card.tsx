"use client"

import Link from "next/link"
import { useState } from "react"
import { Send, Play, SlidersHorizontal } from "lucide-react"
import { ShareSheet } from "@/components/share-sheet"
import { SetupDialog } from "@/components/setup-dialog"

export interface CardScreen {
  slug: string
  name: string
  blurb: string
  categoryName?: string
}

/** One prank screen: big preview, plain launch button, set-up and copy-link actions. */
export function ScreenCard({ screen, priority = false }: { screen: CardScreen; priority?: boolean }) {
  const [setup, setSetup] = useState(false)
  const [linkBar, setLinkBar] = useState(false)
  const [thumbOk, setThumbOk] = useState(true)
  const href = `/screens/${screen.slug}`

  const copy = () => setLinkBar(true)

  return (
    <article className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-600/70 bg-zinc-900 shadow-lg shadow-black/40 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/70 hover:shadow-[0_0_28px_rgba(34,211,238,0.18)]">
      {/* Stretched link: the whole card launches the prank; the buttons and links below sit above it. */}
      <Link href={href} className="absolute inset-0 z-[5]" aria-label={`Launch ${screen.name}`} tabIndex={-1} />
      <div className="relative block aspect-video overflow-hidden bg-zinc-800">
        {thumbOk && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/thumbs/${screen.slug}.jpg`} alt={`Preview of the ${screen.name} prank screen`} width={640} height={360} loading={priority ? "eager" : "lazy"} onError={() => setThumbOk(false)} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/45 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-black"><Play className="h-4 w-4 fill-black" /> Launch</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold leading-snug text-white">{screen.name}</h3>
        <p className="mt-1 flex-1 text-sm leading-snug text-zinc-300">{screen.blurb}</p>
        <Link href={`/guide/${screen.slug}`} className="relative z-10 mt-2 w-fit text-xs font-medium text-cyan-300 hover:underline">About this prank &rarr;</Link>
        <div className="relative z-10 mt-4 grid grid-cols-[1fr_auto_auto] gap-2">
          <Link href={href} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-300"><Play className="h-4 w-4 fill-zinc-950" /> Launch</Link>
          <button onClick={() => setSetup(true)} title="Set up on this device: delay and sound" className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-500 bg-zinc-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:border-zinc-300 hover:bg-zinc-700"><SlidersHorizontal className="h-4 w-4" /><span className="hidden sm:inline">Set up</span></button>
          <button onClick={copy} title="Send this prank to someone" className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-500 bg-zinc-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:border-zinc-300 hover:bg-zinc-700"><Send className="h-4 w-4" /><span className="hidden sm:inline">Send</span></button>
        </div>
      </div>
      {linkBar && <ShareSheet slug={screen.slug} name={screen.name} onClose={() => setLinkBar(false)} />}
      {setup && <SetupDialog slug={screen.slug} name={screen.name} blurb={screen.blurb} onClose={() => setSetup(false)} />}
    </article>
  )
}
