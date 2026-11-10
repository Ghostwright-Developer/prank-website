"use client"

import { useEffect, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { sfx } from "@/lib/sfx"

interface Ev { text: string; eta: string; pos: [number, number]; step: 0 | 1 | 2; dropped?: boolean; ask?: boolean; wait?: number }

const HOME: [number, number] = [640, 150]
const EVENTS: Ev[] = [
  { text: "Dave picked up your update.", eta: "6 min", pos: [120, 440], step: 0 },
  { text: "Dave is on his way. He is going fast.", eta: "5 min", pos: [230, 410], step: 1 },
  { text: "Dave is making great time.", eta: "4 min", pos: [330, 330], step: 1 },
  { text: "Dave stopped to get gas.", eta: "6 min", pos: [330, 330], step: 1 },
  { text: "Dave stopped to get a gas station burrito.", eta: "9 min", pos: [330, 330], step: 1 },
  { text: "Dave is eating the burrito in the car. He says it is “a process.”", eta: "12 min", pos: [330, 330], step: 1, wait: 9 },
  { text: "Dave is now 14 miles from you. He was 2 miles from you.", eta: "19 min", pos: [170, 250], step: 1 },
  { text: "Dave says he is taking the scenic route.", eta: "31 min", pos: [90, 120], step: 1 },
  { text: "Dave has a question: is your update 32-bit or 64-bit?", eta: "31 min", pos: [90, 120], step: 1, ask: true, wait: 9 },
  { text: "Dave has been pulled over. Dave says it is a misunderstanding.", eta: "44 min", pos: [260, 70], step: 1 },
  { text: "Dave is on the phone with his mom. We have been asked to be quiet.", eta: "52 min", pos: [260, 70], step: 1, wait: 9 },
  { text: "Dave has dropped your update. Dave is looking for it.", eta: "58 min", pos: [420, 115], step: 1, dropped: true },
  { text: "Dave found something. It is not your update. He is bringing it anyway.", eta: "1 min", pos: [540, 190], step: 2 },
  { text: "Dave has arrived at the wrong house.", eta: "1 min", pos: [700, 340], step: 2 },
  { text: "Dave delivered your update to your neighbor, Steve. Steve says thank you.", eta: "0 min", pos: [700, 340], step: 2 },
  { text: "Steve has installed your update. Steve says it is “fine, honestly.”", eta: "0 min", pos: [700, 340], step: 2 },
  { text: "Dave wants it back. Steve is not giving it back.", eta: "12 min", pos: [690, 320], step: 2 },
  { text: "Dave has called for backup. Backup is also named Dave.", eta: "12 min", pos: [690, 320], step: 2 },
  { text: "Both Daves are at your door. They are arguing about who gets the tip.", eta: "Now", pos: [632, 168], step: 2, wait: 9 },
  { text: "Both Daves have left. Your update is in the van. The van is moving.", eta: "5 min", pos: [120, 440], step: 0 },
]

const TIPS: [string, string][] = [
  ["$0", "Dave appreciates your honesty. Dave is also a person."],
  ["$2", "Dave took the $2. Dave is now 1 mile further away."],
  ["$5", "Dave says “that will do.” Dave did not say what it will do."],
  ["$20", "Dave is sending you a photo of the burrito as a thank you."],
]
const CALL_LINES = ["Hey, it's Dave. I'm in a thing. Can I call you back?", "(call ended by Dave)"]

export default function UpdateDelivery() {
  const [i, setI] = useState(0)
  const [log, setLog] = useState<string[]>([EVENTS[0].text])
  const [extra, setExtra] = useState<string | null>(null)
  const [tipOpen, setTipOpen] = useState(false)
  const [msgOpen, setMsgOpen] = useState(false)
  const [msg, setMsg] = useState("")
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const ev = EVENTS[i]

  useEffect(() => {
    const t = setTimeout(() => {
      const n = (i + 1) % EVENTS.length
      setI(n)
      setLog((l) => [EVENTS[n].text, ...l].slice(0, 6))
      sfx.chime()
    }, (ev.wait ?? 7) * 1000)
    return () => clearTimeout(t)
  }, [i, ev.wait])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)) }
  const say = (t: string) => { setExtra(t); sfx.ding() }
  const call = () => {
    setExtra("Calling Dave…")
    for (let k = 0; k < 3; k++) later(() => sfx.beep(380), k * 900)
    later(() => say(`Dave: “${CALL_LINES[0]}”`), 3000)
    later(() => setExtra(CALL_LINES[1]), 6200)
  }
  const send = (e: React.FormEvent) => {
    e.preventDefault()
    if (!msg.trim()) return
    setMsgOpen(false); setMsg("")
    setExtra("Dave is typing…")
    later(() => setExtra("Dave is typing… still typing…"), 3000)
    later(() => say("Dave: “k”"), 6500)
  }

  const [x, y] = ev.pos
  return (
    <FullscreenPrank exitMessage="NO UPDATE WAS HARMED (OR DELIVERED) - IT WAS A PRANK!" className="cursor-default bg-white font-sans text-slate-900">
      <div className="flex h-full flex-col md:flex-row">
        {/* Map */}
        <div className="relative min-h-[40%] flex-1 overflow-hidden bg-[#e7edf1]">
          <svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <rect x="-1200" y="-1200" width="3200" height="2900" fill="#e7edf1" />
            <path d="M-1200 330 L-20 360 C 150 330, 260 430, 420 400 S 700 450, 840 400 L2000 380 L2000 480 L840 470 C 700 520, 560 480, 420 470 S 140 410, -20 430 L-1200 450Z" fill="#bcd9ee" />
            <rect x="470" y="30" width="150" height="90" rx="14" fill="#cfe8c8" />
            <rect x="40" y="260" width="120" height="70" rx="14" fill="#cfe8c8" />
            {Array.from({ length: 16 }).map((_, n) => 60 + (n - 4) * 110).map((gx) => <rect key={`v${gx}`} x={gx} y="-1200" width="26" height="2900" fill="#fff" />)}
            {Array.from({ length: 14 }).map((_, n) => 50 + (n - 4) * 100).map((gy) => <rect key={`h${gy}`} x="-1200" y={gy} width="3200" height="24" fill="#fff" />)}
            {Array.from({ length: 16 * 14 }).map((_, k) => <rect key={k} x={86 + ((k % 16) - 4) * 110 + 8} y={74 + (Math.floor(k / 16) - 4) * 100 + 6} width="70" height="60" rx="6" fill="#d6dde3" />)}
            <polyline points={`120,440 230,410 330,330 170,250 90,120 260,70 420,115 540,190 ${HOME[0]},${HOME[1]}`} fill="none" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity=".55" strokeDasharray="1 12" />
            <g transform={`translate(${HOME[0]} ${HOME[1]})`}><circle r="22" fill="#16a34a" opacity=".2" /><rect x="-13" y="-13" width="26" height="26" rx="8" fill="#16a34a" /><path d="M-6 3l6-8 6 8z" fill="#fff" /></g>
            <g transform="translate(700 340)"><rect x="-12" y="-12" width="24" height="24" rx="6" fill="#94a3b8" /><text y="30" textAnchor="middle" fontSize="13" fill="#475569">Steve</text></g>
            {ev.dropped && <g transform="translate(450 140)"><rect x="-10" y="-10" width="20" height="20" rx="4" fill="#f59e0b" /><text y="-16" textAnchor="middle" fontSize="12" fill="#92400e">update?</text></g>}
            <g style={{ transform: `translate(${x}px, ${y}px)`, transition: "transform 5.5s ease-in-out" }}><circle r="26" fill="#0f172a" stroke="#fff" strokeWidth="5" /><text textAnchor="middle" y="7" fill="#fff" fontWeight="700" fontSize="20">D</text><rect x="-22" y="32" width="44" height="18" rx="9" fill="#0f172a" /><text textAnchor="middle" y="45" fill="#fff" fontSize="12" fontWeight="600">Dave</text></g>
          </svg>
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[13px] font-semibold shadow-lg">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-emerald-600 text-white">↓</span> Update Express
          </div>
        </div>

        {/* Panel */}
        <div className="flex w-full flex-col overflow-y-auto border-t border-slate-200 bg-white p-5 md:w-[min(430px,38vw)] md:border-l md:border-t-0">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-emerald-700">Arriving in</p>
          <p className="text-[44px] font-bold leading-none tabular-nums">{ev.eta}</p>
          <div className="mt-4 grid grid-cols-3 gap-1.5">
            {["Preparing", "On the way", "Arriving"].map((s, k) => <div key={s}><div className={`h-1.5 rounded-full ${k <= ev.step ? "bg-emerald-600" : "bg-slate-200"}`} /><p className="mt-1 text-[11px] text-slate-500">{s}</p></div>)}
          </div>
          <p key={ev.text} className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-[16px] font-medium leading-snug" style={{ animation: "pk-pop .35s ease both" }}>{ev.text}</p>
          {ev.ask && (
            <div className="mt-3 flex gap-2">
              {["32-bit", "64-bit"].map((b) => <button key={b} onClick={() => say("Dave says: “sure.”")} className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-[14px] font-semibold hover:bg-slate-50">{b}</button>)}
              <button onClick={() => say("Dave says: “I'll just bring both.”")} className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-[14px] font-semibold hover:bg-slate-50">Not sure</button>
            </div>
          )}
          {extra && <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-[15px] text-emerald-900">{extra}</p>}

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 p-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-900 text-lg font-bold text-white">D</div>
            <div className="flex-1 text-[13px]"><p className="text-[15px] font-semibold">Dave <span className="font-normal text-slate-500">· 4.1 ★ (3 ratings)</span></p><p className="text-slate-500">Silver 2004 Corolla · UPDT 4U</p></div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button onClick={call} className="rounded-lg bg-slate-900 px-3 py-2.5 text-[14px] font-semibold text-white hover:bg-slate-700">Call</button>
            <button onClick={() => setMsgOpen((o) => !o)} className="rounded-lg border border-slate-300 px-3 py-2.5 text-[14px] font-semibold hover:bg-slate-50">Message</button>
            <button onClick={() => setTipOpen((o) => !o)} className="rounded-lg border border-slate-300 px-3 py-2.5 text-[14px] font-semibold hover:bg-slate-50">Tip</button>
          </div>
          {msgOpen && <form onSubmit={send} className="mt-3 flex gap-2"><input autoFocus value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Message Dave" className="h-10 flex-1 rounded-lg border border-slate-300 px-3 text-[14px] outline-none focus:border-emerald-600" /><button className="rounded-lg bg-emerald-600 px-4 text-[14px] font-semibold text-white">Send</button></form>}
          {tipOpen && <div className="mt-3 grid grid-cols-4 gap-2">{TIPS.map(([a, b]) => <button key={a} onClick={() => { setTipOpen(false); say(b) }} className="rounded-lg border border-slate-300 py-2 text-[14px] font-semibold hover:bg-slate-50">{a}</button>)}</div>}

          <p className="mt-5 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Order 4821 · Windows Update (KB5034441)</p>
          <ul className="mt-2 space-y-1.5 text-[13px] text-slate-600">
            {log.slice(1).map((l, k) => <li key={`${l}${k}`} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" /><span>{l}</span></li>)}
          </ul>
        </div>
      </div>
      <style>{`@keyframes pk-pop{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
    </FullscreenPrank>
  )
}
