"use client"

import { useEffect, useRef, useState } from "react"
import { sfx } from "@/lib/sfx"
import { FullscreenPrank } from "@/components/fullscreen-prank"

const SITES = [
  { host: "search-protect-now.biz", title: "Congratulations! You are today's 1,000,000th visitor!", cta: "Claim Your Prize" },
  { host: "free-gift-cards-2026.net", title: "You have been selected for a $500 gift card", cta: "Continue" },
  { host: "pc-cleaner-pro.info", title: "Your browser is out of date and 3 threats were found", cta: "Fix Now" },
  { host: "hot-singles-near-you.online", title: "Local singles want to meet you", cta: "Enter" },
  { host: "win-an-iphone-today.top", title: "Take our 30-second survey and win a new iPhone", cta: "Start Survey" },
]
const MAX = 8

interface Pop { id: number; x: number; y: number; site: (typeof SITES)[number] }

export default function BrowserHijackScreen() {
  const [pops, setPops] = useState<Pop[]>([])
  const [tabs, setTabs] = useState(3)
  const id = useRef(0)

  const spawn = (n = 1) => {
    const w = typeof window === "undefined" ? 1024 : window.innerWidth
    const h = typeof window === "undefined" ? 768 : window.innerHeight
    const made: Pop[] = Array.from({ length: n }, () => ({
      id: ++id.current,
      x: 10 + Math.random() * Math.max(10, w - 480),
      y: 40 + Math.random() * Math.max(10, h - 340),
      site: SITES[Math.floor(Math.random() * SITES.length)],
    }))
    sfx.ding()
    setPops((p) => [...p, ...made].slice(-MAX))
    setTabs((t) => Math.min(24, t + n))
  }
  useEffect(() => {
    spawn(2)
    const t = setInterval(() => spawn(1), 1600)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <FullscreenPrank exitMessage="BROWSER RESTORED - IT WAS A PRANK!" className="cursor-default bg-white font-sans">
      {/* Browser chrome */}
      <div className="absolute inset-x-0 top-0 z-[999] bg-[#dee1e6]">
        <div className="flex h-9 items-end gap-[2px] overflow-hidden px-2 pt-2">
          {Array.from({ length: Math.min(tabs, 12) }, (_, i) => (
            <div key={i} className={`h-7 min-w-0 flex-1 truncate rounded-t-lg px-3 pt-1.5 text-[12px] ${i === 0 ? "bg-white text-black" : "bg-[#cfd3d9] text-[#444]"}`}>
              {i === 0 ? "Winner!!!" : "Special Offer"}
            </div>
          ))}
        </div>
        <div className="flex h-10 items-center gap-2 bg-white px-3 shadow-sm">
          <span className="text-[#5f6368]">←  →  ⟳</span>
          <div className="flex-1 truncate rounded-full bg-[#f1f3f4] px-4 py-1.5 text-[13px] text-[#5f6368]">⚠ Not secure | search-protect-now.biz/offer?id=88213</div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 top-[76px] bg-gradient-to-b from-[#fff7d6] to-[#ffe08a] p-6 text-center">
        <h1 className="text-[34px] font-extrabold text-[#c40000]">YOU ARE A WINNER!!!</h1>
        <p className="mt-2 text-[18px] text-[#333]">Your browser has been selected. Click anywhere to claim.</p>
      </div>

      {pops.map((p) => (
        <div key={p.id} className="absolute z-[1000] w-[min(440px,92vw)] border border-[#888] bg-white shadow-[0_6px_24px_rgba(0,0,0,.45)]" style={{ left: p.x, top: p.y, zIndex: 1000 + p.id }}>
          <div className="flex items-center justify-between bg-[#e8e8e8] px-3 py-1 text-[12px] text-[#444]">
            <span>{p.site.host}</span>
            <button onClick={() => { setPops((a) => a.filter((x) => x.id !== p.id)); setTimeout(() => spawn(2), 300) }} className="px-2 text-[14px] font-bold">✕</button>
          </div>
          <div className="p-5 text-center">
            <div className="mb-4 text-[18px] font-bold text-[#c40000]">{p.site.title}</div>
            <button onClick={() => spawn(2)} className="rounded bg-[#19a34a] px-8 py-2 text-[15px] font-bold text-white">{p.site.cta}</button>
          </div>
        </div>
      ))}
    </FullscreenPrank>
  )
}
