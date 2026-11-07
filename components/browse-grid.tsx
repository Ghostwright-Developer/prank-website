"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { ScreenCard, type CardScreen } from "@/components/screen-card"

interface Item extends CardScreen { category: string; keywords: string[]; popular?: boolean }

export function BrowseGrid({ items, categories }: { items: Item[]; categories: { slug: string; name: string }[] }) {
  const [q, setQ] = useState("")
  const [cat, setCat] = useState<string>("all")
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return items.filter((s) => {
      if (cat === "popular" && !s.popular) return false
      if (cat !== "all" && cat !== "popular" && s.category !== cat) return false
      if (!needle) return true
      return `${s.name} ${s.blurb} ${s.keywords.join(" ")}`.toLowerCase().includes(needle)
    })
  }, [items, q, cat])

  const chip = (active: boolean) => `rounded-full border px-4 py-1.5 text-sm transition-colors ${active ? "border-cyan-400 bg-cyan-500/20 text-cyan-100" : "border-zinc-600 bg-zinc-800 text-zinc-200 hover:border-zinc-400"}`

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search screens: blue screen, ransomware, iPhone, Windows 11…" className="w-full rounded-xl border border-zinc-600 bg-zinc-900 py-3 pl-12 pr-4 text-white placeholder:text-zinc-400 focus:border-cyan-400 focus:outline-none" />
        </label>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setCat("all")} className={chip(cat === "all")}>All</button>
          <button onClick={() => setCat("popular")} className={chip(cat === "popular")}>Popular</button>
          {categories.map((c) => <button key={c.slug} onClick={() => setCat(c.slug)} className={chip(cat === c.slug)}>{c.name}</button>)}
        </div>
      </div>
      {shown.length === 0 ? (
        <p className="rounded-xl border border-zinc-700 bg-zinc-900 p-8 text-center text-zinc-300">No screens match that. Try a different word, like “Windows”, “hacker” or “phone”.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((s, i) => <ScreenCard key={s.slug} screen={s} priority={i < 3} />)}
        </div>
      )}
    </div>
  )
}
