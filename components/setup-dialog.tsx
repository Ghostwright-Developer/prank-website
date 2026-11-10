"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import { LinkCopier } from "@/components/link-copier"
import { unlockAudio } from "@/lib/sfx"
import { Copy, Play, Share2, X } from "lucide-react"

interface Props {
  slug: string
  name: string
  blurb: string
  onClose: () => void
}

const DELAYS: [string, number][] = [["Now", 0], ["10 sec", 10], ["30 sec", 30], ["1 min", 60], ["5 min", 300], ["10 min", 600]]
type Fs = HTMLElement & { webkitRequestFullscreen?: () => void }

/**
 * "Set up on this device": pick a start delay and options, then either arm it
 * here (goes fullscreen and black, then the prank appears after the delay), or
 * copy a link that carries the same settings.
 */
export function SetupDialog({ slug, name, blurb, onClose }: Props) {
  const router = useRouter()
  const [delay, setDelay] = useState(30)
  const [sound, setSound] = useState(true)
  const [linkBar, setLinkBar] = useState(false)
  const [armed, setArmed] = useState<number | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function"

  const path = () => {
    const q = new URLSearchParams()
    if (!sound) q.set("s", "0")
    const qs = q.toString()
    return `/screens/${slug}${qs ? `?${qs}` : ""}`
  }
  const link = (withDelay: boolean) => {
    const q = new URLSearchParams()
    if (withDelay && delay > 0) q.set("d", String(delay))
    if (!sound) q.set("s", "0")
    const qs = q.toString()
    return `${location.origin}/screens/${slug}${qs ? `?${qs}` : ""}`
  }

  const copy = () => setLinkBar(true)

  const share = async () => {
    try { await navigator.share({ title: name, text: `Open this on your computer: ${name}`, url: link(true) }) } catch { /* cancelled */ }
  }

  const cancelArmed = () => {
    if (timer.current) clearTimeout(timer.current)
    setArmed(null)
    try { if (document.fullscreenElement) void document.exitFullscreen() } catch { /* ignore */ }
  }

  const start = () => {
    const el = document.documentElement as Fs
    try {
      const r = el.requestFullscreen ? el.requestFullscreen() : el.webkitRequestFullscreen?.()
      if (r && typeof (r as Promise<void>).catch === "function") (r as Promise<void>).catch(() => {})
    } catch { /* unsupported */ }
    if (sound) unlockAudio()
    if (delay === 0) {
      router.push(path())
      return
    }
    setArmed(delay)
    timer.current = setTimeout(() => {
      setArmed(null)
      router.push(path())
    }, delay * 1000)
  }

  // While armed: Esc/Q or leaving fullscreen cancels.
  useEffect(() => {
    if (armed === null) return
    let wasFs = !!document.fullscreenElement
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key === "q" || e.key === "Q") cancelArmed() }
    const onFs = () => { if (document.fullscreenElement) wasFs = true; else if (wasFs) cancelArmed() }
    window.addEventListener("keydown", onKey, true)
    document.addEventListener("fullscreenchange", onFs)
    return () => { window.removeEventListener("keydown", onKey, true); document.removeEventListener("fullscreenchange", onFs) }
  }, [armed])

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  if (armed !== null) {
    return createPortal(<div className="fixed inset-0 z-[9999] cursor-none bg-black" onContextMenu={(e) => e.preventDefault()} aria-hidden="true" />, document.body)
  }

  return createPortal(
    <>
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Set up ${name}`} onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-600 bg-zinc-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Set up on this device</h2>
            <p className="mt-1 text-sm text-zinc-300">{name} <span className="text-zinc-500">· {blurb}</span></p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <p className="mb-2 text-sm font-semibold text-zinc-200">Start the prank</p>
        <div className="mb-5 flex flex-wrap gap-2">
          {DELAYS.map(([label, s]) => (
            <button key={s} onClick={() => setDelay(s)} className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${delay === s ? "border-cyan-400 bg-cyan-500/20 text-cyan-200" : "border-zinc-600 bg-zinc-800 text-zinc-200 hover:border-zinc-400"}`}>{label}</button>
          ))}
        </div>
        <p className="mb-5 text-xs text-zinc-400">
          {delay === 0 ? "The prank starts right now." : "The screen goes fullscreen and black like a sleeping monitor, then the prank appears after the delay. Press the button, step away, let them walk up."}
        </p>

        <div className="mb-6 space-y-3">
          <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">Tip: unplug any extra monitors first. A second screen still showing the normal desktop gives the prank away.</p>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-200">
            <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} className="mt-1 h-4 w-4 accent-cyan-400" />
            <span>Play sound effects<span className="block text-xs text-zinc-400">Beeps, alarms and error dings that match the screen.</span></span>
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button onClick={start} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-semibold text-white hover:from-cyan-400 hover:to-blue-500 sm:col-span-2"><Play className="h-4 w-4" /> Start on this device</button>
          <button onClick={copy} className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-500 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-white hover:border-zinc-300"><><Copy className="h-4 w-4" /> Copy link with these settings</></button>
          {canShare ? <button onClick={share} className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-500 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-white hover:border-zinc-300"><Share2 className="h-4 w-4" /> Share…</button> : <span />}
        </div>
        <p className="mt-4 text-center text-xs text-zinc-400">Press <kbd className="rounded bg-zinc-700 px-1.5 py-0.5 font-mono text-zinc-100">Esc</kbd> or <kbd className="rounded bg-zinc-700 px-1.5 py-0.5 font-mono text-zinc-100">Q</kbd> to stop at any time.</p>
      </div>
    </div>
    {linkBar && <LinkCopier getUrl={() => link(true)} onClose={() => setLinkBar(false)} />}
    </>,
    document.body,
  )
}
