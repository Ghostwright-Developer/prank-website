"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"
import { formatDuration, useCountdown } from "@/components/prank-kit"
import { GLASS, Win12Logo, Win12Wallpaper } from "@/components/win12-ui"
import { sfx } from "@/lib/sfx"
import { useState } from "react"

const REQS: [string, string, boolean][] = [
  ["Processor", "1 GHz or faster, 2 or more cores", true],
  ["Neural Processing Unit", "45 TOPS required. Detected: 0 TOPS (a vibe)", false],
  ["Memory", "16 GB. Detected: 16 GB, but it's DDR4 and we're hurt", false],
  ["Account", "Cloud account required. Yours seems to be 'local'. How quaint", false],
  ["Personality", "Compatible with Windows 12 Copilot lifestyle", false],
]

export default function Win12Unsupported() {
  const left = useCountdown(59 * 60 + 59)
  const [msg, setMsg] = useState<string | null>(null)
  const say = (m: string) => { sfx.error(); setMsg(m) }
  return (
    <FullscreenPrank secondary="#05060f" exitMessage="YOUR PC IS FINE - WINDOWS 12 DOES NOT EXIST... YET!" sound="beeps" className="cursor-default font-segoe text-white">
      <Win12Wallpaper hue={-35} />
      <div className="absolute inset-0 bg-black/45 backdrop-blur-md" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={`w-full max-w-2xl rounded-[28px] p-8 ${GLASS}`}>
          <div className="flex items-center gap-4"><Win12Logo size={52} /><div><h1 className="text-[26px] font-light leading-tight">This PC can&apos;t run Windows 12</h1><p className="text-[14px] text-rose-200">Windows 12 has already been installed on this PC.</p></div></div>
          <ul className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10 bg-black/25">
            {REQS.map(([n, d, ok]) => (
              <li key={n} className="flex items-center gap-3 px-4 py-3 text-[14px]">
                <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[12px] font-bold ${ok ? "bg-emerald-400 text-emerald-950" : "bg-rose-500 text-white"}`}>{ok ? "✓" : "✕"}</span>
                <span className="w-44 shrink-0 font-medium">{n}</span><span className="text-white/75">{d}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[14px] text-white/80">To keep using this PC, upgrade your hardware within:</p>
          <p className="font-[family-name:var(--font-share-tech)] text-[44px] leading-tight tabular-nums text-cyan-200">{formatDuration(left)}</p>
          <p className="text-[13px] text-white/60">After that, this PC will be restricted to 3 browser tabs and no opinions.</p>
          {msg && <p className="mt-4 rounded-xl bg-rose-500/20 px-4 py-2 text-[14px] text-rose-100">{msg}</p>}
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => say("Buying a new PC is not available in your region. Your region is: 'here'.")} className="rounded-xl bg-cyan-300 px-5 py-2.5 text-[14px] font-semibold text-slate-950 hover:bg-cyan-200">Buy a compatible PC</button>
            <button onClick={() => say("Roll back is not available. Windows 12 is already installed. This was already explained.")} className="rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-[14px] hover:bg-white/20">Roll back to Windows 11</button>
            <button onClick={() => say("Remind me later is disabled. Copilot will remind you now.")} className="rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-[14px] hover:bg-white/20">Remind me later</button>
          </div>
        </div>
      </div>
    </FullscreenPrank>
  )
}
