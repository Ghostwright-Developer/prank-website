"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { sfx } from "@/lib/sfx"

const PREMIUM: Record<string, string> = {
  e: "The letter E is a Plus feature. $0.99/month.",
  a: "A is part of the Vowel Pack. Upgrade to continue using A.",
  t: "T is exclusive to Pro members. We are sorry.",
  o: "O: Premium only. Your free O has been used.",
  i: "I? You mean you? That's Plus.",
  s: "S is billed annually. $14.99/year (save 2%).",
  n: "N is in the Consonant Bundle with R, L and D.",
  r: "R requires the Pirate Plan.",
  " ": "The Space bar is a Pro feature. Wordsthatarerunningtogetherareaphoto.",
  Enter: "Enter is available to Enterprise customers only.",
  Backspace: "Undo is a Premium feature. Mistakes are permanent on the Free plan.",
  Shift: "Shift is part of Ultimate. Capital letters are for people who pay.",
  Tab: "Tab: used up. You had 3 tabs in your free allowance.",
}
const FREE_KEYS = "Q, Z and X"
const PLANS: [string, string, string[]][] = [
  ["Free", "$0", ["Letters Q, Z and X", "Ads between sentences", "Slightly sticky keys"]],
  ["Plus", "$4.99/mo", ["Vowels (A, E, I, O, U)", "Occasional Y", "Number row (not 7)"]],
  ["Pro", "$9.99/mo", ["Every letter", "Space bar", "Backspace (1 per day)"]],
  ["Ultimate", "$19.99/mo", ["Shift, Caps Lock, Enter", "Priority keypresses", "Exclamation marks!"]],
]

export default function KeyboardSubscription() {
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([])
  const id = useRef(0)
  const [presses, setPresses] = useState(0)
  const [declined, setDeclined] = useState(false)

  const push = useCallback((text: string) => {
    const t = { id: ++id.current, text }
    setToasts((p) => [...p, t].slice(-4))
    sfx.error()
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== t.id)), 3800)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "q" || e.key === "Q") return
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      setPresses((n) => n + 1)
      push(PREMIUM[k] ?? `The ${e.key.length === 1 ? e.key.toUpperCase() : e.key} key is not included in your plan.`)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [push])

  return (
    <FullscreenPrank secondary="#0f172a" exitMessage="YOUR KEYBOARD IS FREE - IT WAS A PRANK!" className="cursor-default overflow-auto bg-slate-50 font-segoe text-slate-900">
      <div className="mx-auto flex min-h-full max-w-5xl flex-col items-center px-5 py-10 text-center">
        <p className="rounded-full bg-amber-100 px-4 py-1 text-[13px] font-semibold text-amber-800">Your free trial of the keyboard has ended</p>
        <h1 className="mt-5 text-[clamp(28px,4.4vw,52px)] font-bold leading-tight">Keep typing with <span className="text-indigo-600">Keyboard+</span></h1>
        <p className="mt-3 max-w-2xl text-[17px] text-slate-600">Thank you for 7,000 days of typing. To keep using the keys you already own, please choose a plan. The free plan includes the letters {FREE_KEYS}.</p>
        <div className="mt-8 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map(([name, price, feats], i) => (
            <div key={name} className={`flex flex-col rounded-2xl border p-5 text-left shadow-sm ${i === 2 ? "border-indigo-500 bg-white ring-2 ring-indigo-500" : "border-slate-200 bg-white"}`}>
              {i === 2 && <span className="mb-2 w-fit rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11px] font-bold text-white">MOST POPULAR</span>}
              <h2 className="text-lg font-semibold">{name}</h2>
              <p className="mt-1 text-2xl font-bold">{price}</p>
              <ul className="mt-3 flex-1 space-y-1.5 text-[14px] text-slate-600">{feats.map((f) => <li key={f}>✓ {f}</li>)}</ul>
              <button onClick={() => { setDeclined(true); push("Payment declined. Your wallet said, “not for this.”") }} className={`mt-4 rounded-lg px-4 py-2 text-[14px] font-semibold ${i === 2 ? "bg-indigo-600 text-white hover:bg-indigo-500" : "border border-slate-300 hover:bg-slate-100"}`}>{name === "Free" ? "Continue with Free" : `Choose ${name}`}</button>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[14px] text-slate-500">{presses === 0 ? "Try pressing any key. Go on. We dare you." : declined ? "Having trouble? Your mouse is also on a trial." : `${presses} unauthorized keypress${presses === 1 ? "" : "es"} detected. This has been reported to your fingers.`}</p>
      </div>
      <div className="pointer-events-none fixed bottom-6 right-6 z-10 flex flex-col items-end gap-2">
        {toasts.map((t) => <div key={t.id} className="max-w-xs rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-[14px] shadow-xl" style={{ animation: "pk12-rise .25s ease both" }}><b className="text-indigo-600">Keyboard+</b><br />{t.text}</div>)}
      </div>
      <style>{`@keyframes pk12-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>
    </FullscreenPrank>
  )
}
