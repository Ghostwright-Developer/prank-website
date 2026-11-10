"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { gaBlocked, gaReady } from "@/lib/track"
import { needsConsent, readConsent, writeConsent } from "@/lib/consent"

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? ""
const VALID = /^G-[A-Z0-9]{6,14}$/.test(GA_ID)

/** Fired by <CookieSettingsLink /> to reopen the bar. */
export const OPEN_EVENT = "pranksims:cookie-settings"

/** Removes Google Analytics cookies (_ga, _ga_XXXX, _gid, _gat) for this host and its parent domain. */
function clearGaCookies() {
  const names = document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter((n) => /^(_ga|_gid|_gat)/.test(n))
  const parts = location.hostname.split(".")
  const parent = parts.length > 2 ? "." + parts.slice(-2).join(".") : "." + location.hostname
  for (const n of names) {
    for (const d of ["", location.hostname, parent]) {
      document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (d ? "; domain=" + d : "")
    }
  }
}

function loadGA() {
  const w = window
  ;(w as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = false
  w.gtag?.("consent", "update", { analytics_storage: "granted" }) // undo an earlier "denied" (Yes -> No -> Yes)
  if (w.__pkGA) return
  w.__pkGA = true
  w.dataLayer = w.dataLayer || []
  w.gtag = function () { w.dataLayer!.push(arguments) } // gtag.js requires the arguments object
  w.gtag("js", new Date())
  w.gtag("config", GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false })
  const s = document.createElement("script")
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(s)
}

/**
 * Loads Google Analytics only when allowed, and shows the smallest possible
 * consent bar only when it has to: visitors from the EU/EEA/UK/CH (or an
 * unknown country) who have not chosen yet, and never on the fullscreen prank
 * pages (/screens/<slug>). Everyone else is counted by default and can opt out
 * from the "Analytics settings" link in the footer.
 *
 * Render once in app/layout.tsx. Does nothing if NEXT_PUBLIC_GA_ID is missing.
 */
export function AnalyticsConsent() {
  const pathname = usePathname()
  const [allowed, setAllowed] = useState(false)
  const [mustAsk, setMustAsk] = useState(false)
  const [reopened, setReopened] = useState(false)

  useEffect(() => {
    if (!VALID) return
    const c = readConsent()
    if (c === "granted") { setAllowed(true); return }
    if (c === "denied") { gaBlocked(); return }
    let alive = true
    needsConsent().then((needs) => {
      if (!alive) return
      if (needs) { gaBlocked(); setMustAsk(true) } else setAllowed(true)
    })
    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (allowed && VALID) { loadGA(); gaReady() }
  }, [allowed])

  useEffect(() => {
    const open = () => setReopened(true)
    window.addEventListener(OPEN_EVENT, open)
    return () => window.removeEventListener(OPEN_EVENT, open)
  }, [])

  const choose = useCallback((v: "granted" | "denied") => {
    writeConsent(v)
    setMustAsk(false)
    setReopened(false)
    if (v === "granted") setAllowed(true)
    else {
      setAllowed(false)
      ;(window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = true
      gaBlocked()
      window.gtag?.("consent", "update", { analytics_storage: "denied" })
      clearGaCookies()
    }
  }, [])

  if (!VALID) return null
  const onPrankPage = pathname.startsWith("/screens/")
  const show = reopened || (mustAsk && !onPrankPage)
  if (!show) return null

  return (
    <div role="region" aria-label="Analytics choice" className="fixed bottom-2 left-2 z-[95] flex max-w-[calc(100vw-1rem)] items-center gap-2 rounded-full border border-zinc-600 bg-zinc-900/95 py-1 pl-3 pr-1 text-[11px] text-zinc-200 shadow-lg backdrop-blur">
      <span>Count my visit with Google Analytics? <Link href="/privacy" className="underline underline-offset-2 hover:text-white">Info</Link></span>
      <button onClick={() => choose("granted")} className="rounded-full bg-cyan-400 px-2.5 py-1 font-semibold text-zinc-950 hover:bg-cyan-300">Yes</button>
      <button onClick={() => choose("denied")} className="rounded-full bg-zinc-700 px-2.5 py-1 font-semibold text-white hover:bg-zinc-600">No</button>
    </div>
  )
}

/** Footer link: lets anyone change their analytics choice at any time, in any country. */
export function CookieSettingsLink({ className = "" }: { className?: string }) {
  if (!VALID) return null
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))} className={className || "hover:text-cyan-400 transition-colors"}>
      Analytics settings
    </button>
  )
}
