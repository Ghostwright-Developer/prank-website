"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Send, Shuffle, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { EXIT_MESSAGE_KEY, LAST_SCREEN_KEY } from "@/components/fullscreen-prank"
import { ShareSheet } from "@/components/share-sheet"
import { SupportLink } from "@/components/support-button"
import { SCREENS } from "@/lib/screens"
import { trackPrank } from "@/lib/track"

const SUPPORT_COUNT_KEY = "pranksims:exit-count"
const SUPPORT_SHOWN_KEY = "pranksims:support-shown"
const SUPPORT_QUIET_KEY = "pranksims:support-quiet-until"
const QUIET_MS = 30 * 24 * 3600 * 1000
const VISIBLE_MS = 2200
const FADE_MS = 700

/**
 * Shows the `exitMessage` of the prank the viewer just left as a short banner
 * on the page they land on. It fades out on its own, and disappears at once
 * if they open another prank screen.
 */
export function ExitNotice() {
  const pathname = usePathname()
  const router = useRouter()
  const [last, setLast] = useState<string | null>(null)
  const [sharing, setSharing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [fading, setFading] = useState(false)
  const [support, setSupport] = useState(false)

  useEffect(() => {
    if (pathname.startsWith("/screens/")) {
      setMessage(null)
      setLast(null)
      return
    }
    try {
      const l = sessionStorage.getItem(LAST_SCREEN_KEY)
      if (l) { sessionStorage.removeItem(LAST_SCREEN_KEY); if (SCREENS.some((x) => x.slug === l)) setLast(l) }
      // Ask for support politely: only on the second return from a prank in a visit, once per visit,
      // and never again for a month once it was dismissed or used.
      if (l) {
        const n = Number(sessionStorage.getItem(SUPPORT_COUNT_KEY) ?? "0") + 1
        sessionStorage.setItem(SUPPORT_COUNT_KEY, String(n))
        let quiet = false
        try { quiet = Date.now() < Number(localStorage.getItem(SUPPORT_QUIET_KEY) ?? "0") } catch { /* ignore */ }
        if (n >= 2 && !quiet && !sessionStorage.getItem(SUPPORT_SHOWN_KEY)) {
          sessionStorage.setItem(SUPPORT_SHOWN_KEY, "1")
          window.setTimeout(() => setSupport(true), 3800)
        }
      }
    } catch { /* ignore */ }
    let stored: string | null = null
    try {
      stored = sessionStorage.getItem(EXIT_MESSAGE_KEY)
      if (stored) sessionStorage.removeItem(EXIT_MESSAGE_KEY)
    } catch {
      return
    }
    if (!stored) return
    setFading(false)
    setMessage(stored)
    const fade = setTimeout(() => setFading(true), VISIBLE_MS)
    const gone = setTimeout(() => setMessage(null), VISIBLE_MS + FADE_MS)
    return () => {
      clearTimeout(fade)
      clearTimeout(gone)
    }
  }, [pathname])

  const closeSupport = () => {
    setSupport(false)
    try { localStorage.setItem(SUPPORT_QUIET_KEY, String(Date.now() + QUIET_MS)) } catch { /* ignore */ }
  }
  const supportCard = support && !pathname.startsWith("/screens/") && (
    <div role="dialog" aria-label="Support PrankSims" className="fixed right-3 top-[68px] z-[95] w-[min(330px,calc(100vw-24px))] rounded-2xl border border-pink-400/40 bg-zinc-900/95 p-4 shadow-[0_0_40px_rgba(236,72,153,.18)] backdrop-blur" style={{ animation: "pk-up .5s ease both" }}>
      <style>{`@keyframes pk-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}`}</style>
      <button onClick={closeSupport} aria-label="Dismiss" className="absolute right-2 top-2 rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"><X className="h-4 w-4" /></button>
      <p className="pr-6 font-semibold text-white">Enjoying the chaos?</p>
      <p className="mt-1 text-sm text-zinc-300">PrankSims is free and has no ads. If it made you laugh, you can help keep it that way.</p>
      <div className="mt-3 flex items-center gap-3">
        <SupportLink size="sm" onClick={closeSupport} />
        <button onClick={closeSupport} className="text-sm text-zinc-400 hover:text-white">Not now</button>
      </div>
    </div>
  )

  const lastScreen = SCREENS.find((x) => x.slug === last)
  const another = () => {
    if (last) trackPrank("prank_next", { prank_name: last })
    const pool = SCREENS.filter((x) => x.slug !== last)
    router.push(`/screens/${pool[Math.floor(Math.random() * pool.length)].slug}`)
  }
  const card = lastScreen && (
    <div className="fixed inset-x-0 bottom-5 z-[90] flex justify-center px-4" style={{ animation: "pk-up .5s ease both" }}>
      <style>{`@keyframes pk-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}`}</style>
      <div className="relative w-full max-w-xl rounded-2xl border border-cyan-400/50 bg-zinc-900/95 p-5 shadow-[0_0_40px_rgba(34,211,238,.2)] backdrop-blur">
        <button onClick={() => setLast(null)} aria-label="Dismiss" className="absolute right-3 top-3 rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"><X className="h-4 w-4" /></button>
        <p className="text-lg font-bold text-white">That was fun. Now send it to someone.</p>
        <p className="mt-1 text-sm text-zinc-300">One tap sends “{lastScreen.name}” by text, WhatsApp, email or a copied link. The message does not give it away.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => setSharing(true)} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 font-bold text-zinc-950 hover:bg-cyan-300"><Send className="h-4 w-4" /> Send this prank</button>
          <button onClick={another} className="inline-flex items-center gap-2 rounded-xl border border-zinc-500 bg-zinc-800 px-5 py-2.5 font-medium text-white hover:border-zinc-300"><Shuffle className="h-4 w-4" /> Try another</button>
        </div>
      </div>
      {sharing && <ShareSheet slug={lastScreen.slug} name={lastScreen.name} onClose={() => setSharing(false)} />}
    </div>
  )

  if (!message) return <>{card}{supportCard}</>

  return (
    <>
    {card}
    {supportCard}
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-6 z-[100] flex justify-center px-4"
      style={{ opacity: fading ? 0 : 1, transform: fading ? "translateY(-8px)" : "none", transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease` }}
    >
      <div className="rounded-lg border border-green-500/40 bg-green-950/90 px-6 py-3 font-mono text-sm tracking-wider text-green-300 shadow-[0_0_30px_rgba(34,197,94,0.25)] backdrop-blur">
        <span className="mr-2 text-green-400">&#10003;</span>
        {message}
      </div>
    </div>
    </>
  )
}
