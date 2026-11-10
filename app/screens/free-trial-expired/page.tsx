"use client"

import { useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { formatDuration, useCountdown } from "@/components/prank-kit"
import { sfx } from "@/lib/sfx"

export default function FreeTrialExpired() {
  const left = useCountdown(23 * 3600 + 59 * 60 + 41)
  const [msg, setMsg] = useState<string | null>(null)
  const say = (m: string) => { sfx.error(); setMsg(m) }
  return (
    <FullscreenPrank secondary="#111827" exitMessage="THIS COMPUTER IS YOURS - IT WAS A PRANK!" sound="alarm" className="cursor-default overflow-auto bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 font-segoe text-white">
      <div className="mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center px-5 py-10 text-center">
        <p className="rounded-full bg-rose-500/20 px-4 py-1 text-[13px] font-semibold text-rose-200">Trial ended</p>
        <h1 className="mt-5 text-[clamp(28px,4.6vw,54px)] font-bold leading-tight">Your 30-day free trial of this computer has ended</h1>
        <p className="mt-3 max-w-xl text-[17px] text-slate-300">We hope you enjoyed using hardware you already own. To keep using this computer, please start a subscription.</p>
        <div className="mt-8 grid w-full gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 text-left">
            <h2 className="text-lg font-semibold">Monthly</h2>
            <p className="mt-1 text-3xl font-bold">$12.99<span className="text-base font-normal text-slate-300">/month</span></p>
            <p className="mt-2 text-[14px] text-slate-300">Cancel anytime, by mailing a letter to a building we have not told you about.</p>
            <button onClick={() => say("Payment failed: your card has been declined by your own computer.")} className="mt-4 w-full rounded-lg bg-indigo-500 px-4 py-2.5 font-semibold hover:bg-indigo-400">Subscribe monthly</button>
          </div>
          <div className="relative rounded-2xl border-2 border-emerald-400 bg-white/10 p-6 text-left">
            <span className="absolute -top-3 right-4 rounded-full bg-emerald-400 px-3 py-0.5 text-[12px] font-bold text-emerald-950">SAVE 42%</span>
            <h2 className="text-lg font-semibold">Yearly</h2>
            <p className="mt-1 text-3xl font-bold">$89.99<span className="text-base font-normal text-slate-300">/year</span></p>
            <p className="mt-2 text-[14px] text-slate-300">Includes the mouse. Keyboard sold separately.</p>
            <button onClick={() => say("Payment failed: the year 2027 is not available in your region.")} className="mt-4 w-full rounded-lg bg-emerald-400 px-4 py-2.5 font-semibold text-emerald-950 hover:bg-emerald-300">Subscribe yearly</button>
          </div>
        </div>
        <p className="mt-6 text-[15px] text-slate-300">Your files will be moved to cold storage in</p>
        <p className="font-mono text-[40px] tabular-nums text-rose-300">{formatDuration(left)}</p>
        <p className="text-[13px] text-slate-400">Cold storage is a drawer. It is not a nice drawer.</p>
        {msg && <p className="mt-4 rounded-lg bg-rose-500/20 px-4 py-2 text-[14px] text-rose-100">{msg}</p>}
        <div className="mt-5 flex gap-5 text-[13px] text-slate-400">
          <button onClick={() => say("Restore is a Premium feature.")} className="hover:text-white hover:underline">Restore purchase</button>
          <button onClick={() => say("To cancel, please call our number. It is the number of a restaurant.")} className="hover:text-white hover:underline">Continue with ads</button>
        </div>
      </div>
    </FullscreenPrank>
  )
}
