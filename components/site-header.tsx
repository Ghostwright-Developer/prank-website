"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, Menu, Search, Shuffle, X } from "lucide-react"
import { CATEGORIES, FAMILIES, SCREENS, categoryPath, getCategory, guidePath } from "@/lib/screens"
import { SiteShareButton } from "@/components/share-sheet"

/** Sticky site header: logo, a Browse menu grouped into families, instant search, Surprise me. */
export function SiteHeader() {
  const router = useRouter()
  const [menu, setMenu] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [q, setQ] = useState("")
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) { setMenu(false); setQ("") } }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenu(false); setQ(""); setMobile(false) } }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown", onKey)
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey) }
  }, [])

  const results = useMemo(() => {
    const n = q.trim().toLowerCase()
    if (n.length < 2) return []
    return SCREENS.filter((s) => `${s.name} ${s.blurb} ${s.keywords.join(" ")}`.toLowerCase().includes(n)).slice(0, 8)
  }, [q])

  const surprise = () => router.push(`/screens/${SCREENS[Math.floor(Math.random() * SCREENS.length)].slug}`)

  const searchBox = (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search 70 screens…"
        aria-label="Search prank screens"
        className="h-10 w-full rounded-lg border border-zinc-600 bg-zinc-900 pl-9 pr-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-cyan-400"
      />
      {q.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-12 z-50 max-h-80 overflow-auto rounded-xl border border-zinc-600 bg-zinc-900 p-1 shadow-2xl">
          {results.length === 0 ? (
            <p className="px-3 py-3 text-sm text-zinc-400">Nothing matches. Try “windows”, “hacker” or “cat”.</p>
          ) : (
            results.map((s) => (
              <Link key={s.slug} href={guidePath(s.slug)} onClick={() => { setQ(""); setMobile(false) }} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm hover:bg-zinc-800">
                <span className="font-medium text-white">{s.name}</span>
                <span className="shrink-0 text-xs text-zinc-400">{getCategory(s.category).shortName}</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )

  const browse = (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {FAMILIES.map((f) => (
        <div key={f.id}>
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: f.accent }}>
            <span className="h-2 w-2 rounded-full" style={{ background: f.accent }} /> {f.title}
          </p>
          <ul className="space-y-1">
            {f.categories.map((slug) => {
              const c = CATEGORIES.find((x) => x.slug === slug)!
              return (
                <li key={slug}>
                  <Link href={categoryPath(slug)} onClick={() => { setMenu(false); setMobile(false) }} className="block rounded-md px-2 py-1.5 text-sm text-zinc-200 hover:bg-zinc-800 hover:text-white">
                    {c.shortName} <span className="text-xs text-zinc-500">{SCREENS.filter((s) => s.category === slug).length}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )

  return (
    <header className="sticky top-0 z-[100] border-b border-zinc-700/60 bg-[#0a0a0f]/90 backdrop-blur-md">
      <div ref={box} className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <Link href="/" className="shrink-0 font-[family-name:var(--font-orbitron)] text-xl font-bold tracking-tight" aria-label="PrankSims home">
          <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">PRANK</span><span className="text-white">SIMS</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Main">
          <button onClick={() => setMenu((v) => !v)} aria-expanded={menu} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800">
            Browse <ChevronDown className={`h-4 w-4 transition-transform ${menu ? "rotate-180" : ""}`} />
          </button>
          <Link href="/#start" className="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800">Start here</Link>
          <Link href="/screens" className="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800">All screens</Link>
          <Link href="/#faq" className="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800">FAQ</Link>
        </nav>

        <div className="ml-auto hidden w-64 md:block">{searchBox}</div>
        <button onClick={surprise} className="hidden items-center gap-1.5 rounded-lg border border-pink-400/60 bg-pink-500/15 px-3 py-2 text-sm font-semibold text-pink-100 hover:bg-pink-500/30 md:inline-flex"><Shuffle className="h-4 w-4" /> Surprise</button>
        <SiteShareButton className="hidden rounded-lg border border-zinc-500 bg-zinc-800 px-3 py-2 text-sm font-semibold text-white hover:border-zinc-300 lg:inline-flex" />

        <button onClick={() => setMobile((v) => !v)} aria-label={mobile ? "Close menu" : "Open menu"} className="ml-auto rounded-lg border border-zinc-600 p-2 text-white md:hidden">
          {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menu && (
        <div className="hidden border-t border-zinc-700/60 bg-[#0d0d14] md:block">
          <div className="mx-auto max-w-6xl px-4 py-5">{browse}</div>
        </div>
      )}
      {mobile && (
        <div className="max-h-[80vh] overflow-auto border-t border-zinc-700/60 bg-[#0d0d14] px-4 py-4 md:hidden">
          <div className="mb-4">{searchBox}</div>
          <div className="mb-4 flex gap-2">
            <button onClick={surprise} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-pink-400/60 bg-pink-500/15 px-3 py-2 text-sm font-semibold text-pink-100"><Shuffle className="h-4 w-4" /> Surprise me</button>
            <Link href="/screens" onClick={() => setMobile(false)} className="inline-flex flex-1 items-center justify-center rounded-lg border border-zinc-500 bg-zinc-800 px-3 py-2 text-sm font-semibold text-white">All screens</Link>
          </div>
          {browse}
        </div>
      )}
    </header>
  )
}
