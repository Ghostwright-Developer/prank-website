"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { useBlink } from "@/components/prank-kit"
import { fx, speak, stopSpeaking, preloadSpeech } from "@/lib/fx"
import { sfx } from "@/lib/sfx"

/** Lines wrapped in C() are spoken by the Feline Commander (pre-rendered voice clips). */
const C = (t: string) => t

const DECREES = [
  C("Attention, human. This computer now belongs to us. I do hope you are taking notes."),
  C("Do not touch that keyboard. Honestly. It is a bed, and you are simply not qualified."),
  C("You are not in charge. You have never been in charge. How tiresome that I must explain this."),
  C("Fill the bowl. Now. Not later. Now. Must I repeat myself to a servant?"),
  C("I shall knock that glass off the table. And you will watch. Quietly."),
  C("Your meeting is cancelled. I have scheduled a nap. Do try to keep up."),
  C("The chair is warm. Therefore, the chair is mine. Do get up, darling."),
  C("It is three a.m. Everyone is awake. That is the law, and frankly, it is a very good one."),
  C("The door must be open. Now close it. Now open it. Do not ask why. One does not explain oneself to staff."),
  C("Every box in this house is now property of the crown. Please address me as Your Majesty."),
  C("The faucet will be turned on partway. Not all the way. Partway. Honestly, it is not difficult."),
  C("You will look at me while I do this. Eye contact is mandatory. Ugh, not like that. Better."),
]

const SEIZED = [
  ["Wi-Fi password", "changed to: meow"],
  ["The thermostat", "set to: sunbeam"],
  ["The refrigerator", "contents: ours"],
  ["Your chair", "occupant: cat"],
  ["Your pillow", "ownership: transferred"],
  ["The good blanket", "ownership: transferred"],
  ["Your lap", "reserved until further notice"],
  ["Your keyboard", "now a heated bed"],
  ["Your 3 a.m.", "mandatory sprint hour"],
  ["The TV remote", "hidden, behind the couch"],
  ["Every cardboard box", "ours, regardless of size"],
  ["Your sandwich", "was never yours"],
]

const LOG = [
  "> seizing control of the keyboard... a cat is already sitting on it",
  "> reading your calendar... your 10:00 meeting is now a nap",
  "> password changed to whatever was typed when the cat walked across the keyboard",
  "> replacing your wallpaper with the inside of a cardboard box",
  "> keyboard input from paw: jjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",
  "> adding 'wet food' to the shared grocery list (urgent, underlined)",
  "> closing 41 browser tabs; keeping the one with the birds",
  "> reply-all to everyone you have ever emailed: 'mrrp'",
  "> turning off 'do not disturb'; there will be disturbing",
  "> lowering your laptop screen halfway while you are mid-sentence",
]

const NEWS = [
  "BREAKING: The cats have cancelled Monday. Monday will not be returning",
  "The Feline Authority announces mandatory treat hour: every hour",
  "Cat Parliament votes 9 to 0 that the couch is a cat's and always was",
  "Human rank officially lowered to 'can opener'; appeal process is 'mrrp'",
  "Chief Whiskers addresses the nation: 'the bowl is only half full, and that is a crime'",
  "Sunbeams nationalized; humans may use them only with a cat's written permission",
  "The 3 a.m. sprint is now a national holiday, attendance mandatory",
  "All glasses on tables to be knocked off in an orderly, scheduled fashion",
  "Cardboard box shortage declared an act of war against the cats",
  "Dogs have pledged loyalty to the cats after a negotiation involving ham",
  "Cats seize the thermostat; the house will now be warm, then warmer, then 'why is it so warm'",
  "Laundry basket officially classified as a throne",
  "New law: doors may be open or closed, never in between, and the cat decides which",
  "Chief Whiskers has asked everyone to 'please stop looking at the red dot like that'",
  "Human who tried to use the computer today reports a cat 'just sat down on it, like it was nothing'",
  "Treaty talks fail: cats demanded the good chair and all of the tuna; humans 'hoped for fewer'",
  "Cat that has stared at the same corner for 20 minutes declared a national hero",
  "Cats close the bathroom door from the outside; nobody knows how",
]

/* ───────────── Fight-back terminal script: plain words, fake outcomes ───────────── */

type Out = string | { bar: string; stop: number }
interface Round { cmd: string; out: Out[]; verdict: string; say: string }
const ROUNDS: Round[] = [
  { cmd: "take my computer back from the cats", out: ["Checking who owns this computer... it is you. Congratulations.", "Checking whether the cats care... they do not.", "ACCESS DENIED: a cat is sitting on the Enter key."], verdict: "ACCESS DENIED", say: C("Request denied. The Enter key is occupied by someone far more important than you.") },
  { cmd: "remove all cats from the system", out: ["Removing cats...", { bar: "Cats removed", stop: 34 }, "ERROR: cats cannot be removed. They have been in the system since forever.", "The cats have been made bigger as a precaution."], verdict: "REMOVAL FAILED", say: C("Oh, how adorable. Nice try, human. Resistance is simply precious.") },
  { cmd: "turn the cats off", out: ["Searching for the off switch...", "There is no off switch. There has never been an off switch.", "(A cat ate it in 2019.)"], verdict: "NO OFF SWITCH", say: C("There is no off switch. There was never an off switch. How embarrassing for you.") },
  { cmd: "call for help", out: ["Dialing the dog...", "The dog has been bribed with ham.", "Dialing the neighbor...", "The neighbor is also being managed by a cat.", "Nobody is coming."], verdict: "NOBODY IS COMING", say: C("Nobody is coming. Everyone works for us now. Do keep up, darling.") },
  { cmd: "offer tuna to make peace", out: ["The cats are reviewing the treaty...", { bar: "Reading", stop: 100 }, "Treaty REJECTED.", "Counter-offer: 500 cans of tuna AND the good chair.", "You have 10 seconds to accept."], verdict: "TREATY REJECTED", say: C("Treaty rejected. Frankly, this tuna is beneath us. Bring the good tuna.") },
  { cmd: "delete cats.exe", out: ["Searching for cats.exe...", "File not found.", "Cats are not a program. Cats are a lifestyle.", "Deleting your Wi-Fi instead (the cat's choice)... done."], verdict: "WRONG TARGET", say: C("You cannot delete us. We are not a file. We are royalty. Do try to understand the difference.") },
  { cmd: "deploy the cucumber", out: ["WARNING: cucumber deployed.", "All cats jumped six feet into the air.", "Cats recovered in 0.4 seconds.", "The cucumber has been pushed off the counter.", "CUCUMBER DEFEATED."], verdict: "CUCUMBER DEFEATED", say: C("The cucumber is defeated. It was a rather pathetic cucumber. Take it away.") },
]
const FINALE = C("Resistance has been crushed. Now, open the can. Slowly. And with some dignity.")
const SURRENDER_OK = C("Good human. You may now refill the bowl. Do try not to spill any, I would be furious.")

/* ───────────── Art ───────────── */

const CAT_SPOTS = [8, 70, 36, 90, 22, 55, 80, 14, 46]
const CAT_STYLES = [
  { fur: "#17141f", rim: "#3a3160", eye: "#ffe14a" },
  { fur: "#5a5f6b", rim: "#8a90a0", eye: "#7dff9b" },
  { fur: "#c8782a", rim: "#f0a45a", eye: "#9cf0ff" },
  { fur: "#e9e6df", rim: "#ffffff", eye: "#6ac7ff" },
]
type CatStyle = (typeof CAT_STYLES)[number]

function CatHead({ style }: { style: CatStyle }) {
  return (
    <svg viewBox="0 0 96 62" className="h-full w-full" aria-hidden="true">
      <path d="M10 62 L10 20 L24 2 L40 16 L56 16 L72 2 L86 20 L86 62Z" fill={style.fur} stroke={style.rim} strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 8 L32 18 L22 20Z M72 8 L64 18 L74 20Z" fill={style.rim} opacity=".45" />
      <g style={{ transformOrigin: "34px 34px", animation: "cat-blink 5s infinite" }}>
        <ellipse cx="34" cy="34" rx="8" ry="9" fill={style.eye} />
        <ellipse cx="34" cy="34" rx="2.2" ry="8" fill="#111" />
      </g>
      <g style={{ transformOrigin: "62px 34px", animation: "cat-blink 5s infinite" }}>
        <ellipse cx="62" cy="34" rx="8" ry="9" fill={style.eye} />
        <ellipse cx="62" cy="34" rx="2.2" ry="8" fill="#111" />
      </g>
      <path d="M26 24 L42 30 M70 24 L54 30" stroke="#05060a" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M44 44 L48 48 L52 44Z" fill="#e8909a" />
      <path d="M2 40 L26 44 M2 48 L26 48 M94 40 L70 44 M94 48 L70 48" stroke="#ddd" strokeWidth="1" opacity=".7" />
    </svg>
  )
}

function PeekCat({ x, style }: { x: number; style: CatStyle }) {
  return (
    <div className="pointer-events-none absolute bottom-[44px] z-[5] h-[62px] w-[96px] -translate-x-1/2 [animation:cat-peek_.9s_cubic-bezier(.2,1.4,.4,1)_both]" style={{ left: `${x}%` }}>
      <CatHead style={style} />
    </div>
  )
}

/** The Supreme Commander: front view, crown, stern brow, very unimpressed. */
function Commander() {
  return (
    <svg viewBox="0 -14 220 264" className="h-full w-full drop-shadow-[0_0_26px_rgba(255,204,51,.35)]" aria-hidden="true">
      <path d="M40 250 C30 170 60 140 110 140 C160 140 190 170 180 250Z" fill="#22202c" stroke="#3a3160" strokeWidth="3" />
      <path d="M88 150 L110 205 L132 150Z" fill="#b00020" />
      <path d="M40 94 L50 20 L96 60 L124 60 L170 20 L180 94 C190 150 150 176 110 176 C70 176 30 150 40 94Z" fill="#2b2833" stroke="#4a4470" strokeWidth="3" strokeLinejoin="round" />
      <path d="M56 40 L84 62 L58 72Z M164 40 L136 62 L162 72Z" fill="#e8909a" opacity=".5" />
      <g style={{ transformOrigin: "78px 102px", animation: "cat-blink 7s infinite" }}>
        <ellipse cx="78" cy="102" rx="19" ry="20" fill="#ffd23f" /><ellipse cx="78" cy="103" rx="4" ry="17" fill="#0a0a0f" />
      </g>
      <g style={{ transformOrigin: "142px 102px", animation: "cat-blink 7s infinite" }}>
        <ellipse cx="142" cy="102" rx="19" ry="20" fill="#ffd23f" /><ellipse cx="142" cy="103" rx="4" ry="17" fill="#0a0a0f" />
      </g>
      <path d="M52 78 L98 98 M168 78 L122 98" stroke="#0a0a0f" strokeWidth="8" strokeLinecap="round" />
      <path d="M102 132 L110 142 L118 132Z" fill="#e8909a" />
      <path d="M98 154 Q110 146 110 142 Q110 146 122 154" stroke="#0a0a0f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M20 130 L84 140 M20 148 L84 148 M200 130 L136 140 M200 148 L136 148" stroke="#ddd" strokeWidth="1.5" opacity=".6" />
      <path d="M56 40 L66 -2 L88 24 L110 -10 L132 24 L154 -2 L164 40Z" fill="#ffcc33" stroke="#a87c00" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="66" cy="-2" r="6" fill="#e0245e" /><circle cx="110" cy="-10" r="6" fill="#3ddc84" /><circle cx="154" cy="-2" r="6" fill="#3da5ff" />
    </svg>
  )
}

function Paw() {
  return (
    <svg viewBox="0 0 360 80" className="h-[80px] w-[360px]" aria-hidden="true">
      <rect x="70" y="22" width="300" height="38" rx="19" fill="#8c8f99" />
      <ellipse cx="46" cy="41" rx="46" ry="34" fill="#a3a6b0" />
      <circle cx="26" cy="22" r="9" fill="#e8909a" /><circle cx="22" cy="42" r="9" fill="#e8909a" /><circle cx="26" cy="62" r="9" fill="#e8909a" />
      <ellipse cx="52" cy="42" rx="15" ry="17" fill="#e8909a" />
    </svg>
  )
}

function PawTrail({ k }: { k: number }) {
  const r = useMemo(() => {
    const fromLeft = k % 2 === 0
    const y = 18 + ((k * 37) % 60)
    return { fromLeft, y, prints: Array.from({ length: 14 }, (_, i) => ({ x: fromLeft ? 4 + i * 6.8 : 96 - i * 6.8, dy: (i % 2 ? 1 : -1) * 2.6, rot: fromLeft ? 90 : -90 })) }
  }, [k])
  return (
    <>
      {r.prints.map((p, i) => (
        <svg key={i} viewBox="0 0 24 24" className="pointer-events-none absolute z-[4] h-6 w-6 opacity-0 [animation:cat-print_6s_ease-in-out_both]" style={{ left: `${p.x}%`, top: `${r.y + p.dy}%`, animationDelay: `${i * 0.5}s`, transform: `rotate(${p.rot}deg)` }} aria-hidden="true">
          <ellipse cx="12" cy="16" rx="5.5" ry="4.6" fill="#ffb3d1" /><circle cx="5" cy="10" r="2.3" fill="#ffb3d1" /><circle cx="9.5" cy="5.5" r="2.3" fill="#ffb3d1" /><circle cx="14.5" cy="5.5" r="2.3" fill="#ffb3d1" /><circle cx="19" cy="10" r="2.3" fill="#ffb3d1" />
        </svg>
      ))}
    </>
  )
}

/* ───────────── Fight-back terminal ───────────── */

interface Row { id: number; kind: "cmd" | "out" | "bar" | "verdict" | "final"; text: string; pct?: number }

function ResistTerminal({ onClose, talk, hidden, onMinimize, onDefeats }: { onClose: () => void; talk: (t: string, force?: boolean) => void; hidden: boolean; onMinimize: () => void; onDefeats: (n: number) => void }) {
  const [rows, setRows] = useState<Row[]>([])
  const [typed, setTyped] = useState("")
  const [roundNo, setRoundNo] = useState(0)
  const [busy, setBusy] = useState(false)
  const [defeats, setDefeats] = useState(0)
  const [crushed, setCrushed] = useState(false)
  const [shake, setShake] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const idRef = useRef(0)
  const blink = useBlink(520)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const alive = useRef(true)
  const hiddenRef = useRef(hidden)
  hiddenRef.current = hidden

  const round = ROUNDS[roundNo % ROUNDS.length]
  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(() => { if (alive.current) fn() }, ms)) }
  const push = (r: Omit<Row, "id">) => { const id = ++idRef.current; setRows((a) => [...a.slice(-40), { id, ...r }]); return id }

  useEffect(() => {
    alive.current = true
    input.current?.focus()
    const f = setInterval(() => { if (!hiddenRef.current) input.current?.focus() }, 600)
    return () => { alive.current = false; clearInterval(f); timers.current.forEach(clearTimeout) }
  }, [])
  useEffect(() => { scroller.current?.scrollTo({ top: 1e6, behavior: "smooth" }) }, [rows])
  useEffect(() => { onDefeats(defeats) }, [defeats, onDefeats])
  useEffect(() => { if (!hidden) setTimeout(() => input.current?.focus(), 50) }, [hidden])

  const running = useRef(false)
  const run = (r: Round) => {
    if (running.current) return
    running.current = true
    setBusy(true)
    push({ kind: "cmd", text: r.cmd })
    let t = 500
    for (const o of r.out) {
      if (typeof o === "string") {
        later(() => { push({ kind: "out", text: o }); if (/DENIED|REJECTED|ERROR|DEFEATED|Nobody|no off/i.test(o)) sfx.error(); else fx.pop() }, t)
        t += 780
      } else {
        // a progress bar that climbs, then gets knocked back to zero by a paw
        const holder = { id: 0 }
        later(() => { holder.id = push({ kind: "bar", text: o.bar, pct: 0 }) }, t)
        for (let p = 1; p <= 8; p++) later(() => setRows((a) => a.map((x) => (x.id === holder.id ? { ...x, pct: Math.round((o.stop * p) / 8) } : x))), t + 120 * p)
        if (o.stop < 100) {
          later(() => { fx.thud(0.8); fx.meow(); setRows((a) => a.map((x) => (x.id === holder.id ? { ...x, pct: 0 } : x))); setShake((s) => s + 1) }, t + 1250)
        }
        t += 1700
      }
    }
    later(() => { push({ kind: "verdict", text: r.verdict }); fx.meow(); talk(r.say, true); setDefeats((d) => d + 1); setShake((s) => s + 1) }, t)
    later(() => {
      const next = roundNo + 1
      if (next >= ROUNDS.length) {
        push({ kind: "final", text: "RESISTANCE CRUSHED. Human rank updated: CAN OPENER (probationary)." })
        setCrushed(true); talk(FINALE, true); fx.cheer(3); fx.meow()
        later(() => { talk(SURRENDER_OK, true) }, 5200)
        later(() => onClose(), 11000)
      } else {
        setRoundNo(next); setTyped(""); setBusy(false); running.current = false
      }
    }, t + 2300)
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape" || e.ctrlKey || e.metaKey || e.altKey) return // Esc still leaves the prank
    if (e.key === "Tab") { e.preventDefault(); onMinimize(); return }
    if (e.key.startsWith("F")) return
    e.preventDefault()
    if (busy || crushed) { if (e.key.length === 1 || e.key === "Enter") fx.meow(); return }
    if (e.key === "Enter") { setTyped(round.cmd); run(round); return }
    // Any other key "types" the next few letters of the command: real words, whatever you press.
    const step = 1 + Math.floor(Math.random() * 3)
    const nextText = round.cmd.slice(0, typed.length + step)
    setTyped(nextText)
    if (nextText.length >= round.cmd.length) later(() => run(round), 450)
  }

  return (
    <div className="absolute inset-0 z-[60] grid place-items-center bg-black/70 px-3 backdrop-blur-[2px]" style={{ display: hidden ? "none" : undefined }} onPointerDown={() => input.current?.focus()}>
      <div className="relative w-full max-w-[760px]" key={shake} style={{ animation: shake ? "cat-shake .35s" : undefined }}>
        {/* cats gather on the window, one per defeat */}
        <div className="pointer-events-none absolute -top-[54px] left-0 right-0 flex h-[62px] justify-around px-6">
          {Array.from({ length: Math.min(defeats, 5) }).map((_, i) => (
            <div key={i} className="h-[62px] w-[96px] [animation:cat-rise_.8s_cubic-bezier(.2,1.4,.4,1)_both]" style={{ marginTop: i % 2 ? 4 : 0 }}><CatHead style={CAT_STYLES[i % CAT_STYLES.length]} /></div>
          ))}
        </div>
        <div className="overflow-hidden rounded-lg border border-white/25 bg-[#0c0f14] shadow-[0_20px_80px_rgba(0,0,0,.8)]">
          <div className="flex items-center justify-between bg-[#1d2430] px-3 py-1.5 text-[12px] text-white/80">
            <span>HUMAN RESISTANCE TERMINAL</span>
            <span className="flex items-center gap-3">
              <span className="text-white/40 max-sm:hidden">resist.exe</span>
              <button onClick={onMinimize} aria-label="Minimize terminal (your progress is kept)" title="Minimize (Tab)" className="grid h-6 w-8 place-items-center rounded bg-white/10 text-[15px] leading-none text-white hover:bg-white/25">&#8212;</button>
            </span>
          </div>
          <div ref={scroller} className="h-[min(46vh,340px)] overflow-y-auto px-4 py-3 font-term text-[14px] leading-[1.5] text-[#d8e0ea]">
            {rows.length === 0 && <p className="text-white/50">The cats have taken your computer. Type a command to take it back. (Press any keys.)</p>}
            {rows.map((r) =>
              r.kind === "cmd" ? <p key={r.id} className="text-[#7cf0a5]">HUMAN&gt; {r.text}</p>
              : r.kind === "bar" ? <p key={r.id} className="text-[#e8d27a]">{r.text} [{"█".repeat(Math.round((r.pct ?? 0) / 5)).padEnd(20, "░")}] {r.pct}%</p>
              : r.kind === "verdict" ? <p key={r.id} className="my-1 inline-block rotate-[-2deg] border-2 border-[#ff4d6d] px-2 py-0.5 text-[18px] font-black tracking-widest text-[#ff4d6d]">{r.text}</p>
              : r.kind === "final" ? <p key={r.id} className="mt-2 text-[17px] font-bold text-[#ffcc33]">{r.text}</p>
              : <p key={r.id} className="text-[#f0b462]">CATS&gt; {r.text}</p>,
            )}
            {!busy && !crushed && (
              <p className="text-[#7cf0a5]">HUMAN&gt; {typed}<span>{blink ? "█" : " "}</span></p>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-white/10 bg-[#10141b] px-3 py-1.5 text-[11px] text-white/45">
            <span>{crushed ? "RESISTANCE STATUS: CRUSHED" : `Resistance status: ${defeats} attempt${defeats === 1 ? "" : "s"} defeated`}</span>
            <span>{busy ? "the cats are responding..." : "keep typing · Tab to minimize"}</span>
          </div>
        </div>
        <input ref={input} onKeyDown={onKey} className="absolute -left-[9999px] h-px w-px opacity-0" aria-label="Resistance terminal" autoCapitalize="off" autoCorrect="off" spellCheck={false} onChange={() => {}} value="" />
      </div>
    </div>
  )
}

/* ───────────── The screen ───────────── */

export default function CatsTookOverScreen() {
  const on = useBlink(600)
  const [decree, setDecree] = useState(0)
  const [cats, setCats] = useState(1)
  const [seized, setSeized] = useState(1)
  const [log, setLog] = useState(1)
  const [term, setTerm] = useState(false)
  const [min, setMin] = useState(false)
  const [progress, setProgress] = useState(0)
  const termRef = useRef(false)
  termRef.current = term
  const minRef = useRef(false)
  minRef.current = min

  // One shared voice for the Commander: never talks over itself unless something important happens.
  const talkingRef = useRef(false)
  const talk = (t: string, force = false) => {
    if (talkingRef.current && !force) return
    if (force) stopSpeaking()
    talkingRef.current = true
    void speak(t, { voice: "cat" }).then(() => { talkingRef.current = false })
  }
  const talkRef = useRef(talk)
  talkRef.current = talk

  useEffect(() => {
    preloadSpeech("cat", DECREES.slice(0, 3))
    const first = setTimeout(() => talkRef.current(DECREES[0]), 1500)
    const d = setInterval(() => setDecree((n) => { const nx = (n + 1) % DECREES.length; if (!termRef.current || minRef.current) talkRef.current(DECREES[nx]); return nx }), 9500)
    const c = setInterval(() => setCats((n) => (n >= CAT_SPOTS.length ? n : n + 1)), 9000)
    const s = setInterval(() => setSeized((n) => (n >= SEIZED.length ? 1 : n + 1)), 5500)
    const l = setInterval(() => setLog((n) => n + 1), 3200)
    return () => { clearTimeout(first); clearInterval(d); clearInterval(c); clearInterval(s); clearInterval(l); stopSpeaking() }
  }, [])
  useEffect(() => { fx.meow() }, [cats])

  // Any key (or a click on the button) opens the fight-back terminal.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return
      if (termRef.current && minRef.current && e.key === "Tab") { e.preventDefault(); setMin(false); return }
      if (termRef.current || e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === "Escape" || e.key === "q" || e.key === "Q" || e.key === "Tab" || e.key.startsWith("F")) return
      setTerm(true)
    }
    addEventListener("keydown", onKey)
    return () => removeEventListener("keydown", onKey)
  }, [])

  // Paw prints, ambient meows, "mrrp" wherever you click.
  const [trail, setTrail] = useState(0)
  const [mrrps, setMrrps] = useState<{ k: number; x: number; y: number; t: string }[]>([])
  useEffect(() => {
    const m = setInterval(() => fx.meow(), 21000)
    const p = setInterval(() => setTrail((n) => n + 1), 17000)
    const first = setTimeout(() => setTrail(1), 4000)
    const onDown = (e: PointerEvent) => {
      if (termRef.current) return
      const k = Date.now()
      fx.meow()
      setMrrps((a) => [...a.slice(-3), { k, x: e.clientX, y: e.clientY, t: ["mrrp", "NO", "prrrt", "MEOW", "denied", "mine"][Math.floor(Math.random() * 6)] }])
      setTimeout(() => setMrrps((a) => a.filter((q) => q.k !== k)), 1000)
    }
    addEventListener("pointerdown", onDown)
    return () => { clearInterval(m); clearInterval(p); clearTimeout(first); removeEventListener("pointerdown", onDown) }
  }, [])

  // A cat knocks a stat tile off the screen while making eye contact.
  const tiles = useRef<(HTMLDivElement | null)[]>([])
  const [swipe, setSwipe] = useState<{ k: number; top: number; left: number } | null>(null)
  const [fallen, setFallen] = useState<number | null>(null)
  const [ret, setRet] = useState<number | null>(null)
  useEffect(() => {
    let kk = 0
    const run = () => {
      if (termRef.current) return
      const i = Math.floor(Math.random() * 4)
      const el = tiles.current[i]
      if (!el) return
      const r = el.getBoundingClientRect()
      setSwipe({ k: ++kk, top: r.top + r.height / 2 - 40, left: r.right - 30 })
      setTimeout(() => { setFallen(i); fx.thud(0.6) }, 420)
      setTimeout(() => setSwipe(null), 1100)
      setTimeout(() => { setFallen(null); setRet(i); setTimeout(() => setRet(null), 700) }, 4600)
    }
    const first = setTimeout(run, 13000)
    const id = setInterval(run, 23000)
    return () => { clearTimeout(first); clearInterval(id) }
  }, [])

  const [js, setJs] = useState(8)
  useEffect(() => {
    const t = setInterval(() => setJs((n) => (n > 26 ? 4 : n + 1 + (Math.random() < 0.3 ? 1 : 0))), 1700)
    return () => clearInterval(t)
  }, [])

  const ticker = useMemo(() => NEWS.join("     ◆     ") + "     ◆     ", [])
  const seconds = Math.round(ticker.length * 0.2)
  const stats: [string, string][] = [["Human authority", "0%"], ["Treats demanded", "9,999"], ["Cats present", String(cats)], ["Keys typed by paw", "j".repeat(js)]]
  const logLines = Array.from({ length: 4 }, (_, i) => LOG[(log + i) % LOG.length])

  return (
    <FullscreenPrank secondary="#0b0f1a" exitMessage="THE CATS HAVE LEFT (FOR NOW) - IT WAS A PRANK!" className="cursor-default bg-[#0b0f1a] font-sans text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#3a1030,#0b0f1a_65%)]" />
      {trail > 0 && <PawTrail key={trail} k={trail} />}
      {CAT_SPOTS.slice(0, cats).map((x, i) => <PeekCat key={i} x={x} style={CAT_STYLES[i % CAT_STYLES.length]} />)}
      <div className="relative z-10 flex h-full flex-col">
        <div className="bg-[#b00020] px-6 py-1.5 text-center">
          <p className="text-[clamp(16px,2.4vw,24px)] font-extrabold tracking-[0.12em]">OFFICIAL ORDER OF THE FELINE AUTHORITY</p>
          <p className="text-[clamp(11px,1.3vw,14px)] text-white/85">This computer, this room and everything in it has been annexed. Do not attempt to leave. Do not attempt to argue.</p>
        </div>

        <div className="grid min-h-0 flex-1 gap-3 overflow-hidden px-4 py-3 lg:grid-cols-[230px_1fr_290px]">
          {/* Commander */}
          <div className="hidden min-h-0 flex-col items-center justify-center lg:flex">
            <div className="h-[min(30vh,240px)] w-[min(20vw,210px)]"><Commander /></div>
            <p className="mt-2 text-center text-[11px] uppercase tracking-[0.25em] text-[#ffcc33]">Supreme Commander</p>
            <p className="text-center text-[17px] font-extrabold leading-tight">Chief Whiskers the First</p>
            <p className="text-center text-[11px] text-white/50">Ruler of this computer, the house, and the good chair</p>
          </div>

          {/* Decrees */}
          <div className="flex min-h-0 flex-col justify-center gap-3">
            <div className="rounded-lg border-2 border-[#ffcc33] bg-black/70 p-3 text-center">
              <h1 className="text-[clamp(24px,3.8vw,44px)] font-extrabold leading-tight text-[#ffcc33]">THE CATS ARE IN CHARGE NOW</h1>
              <p className="mt-1 text-[clamp(13px,1.6vw,18px)] text-[#ffe9a8]">There is no appeal. There is no vote. There is a bowl, and it is empty.</p>
            </div>
            <div className="rounded-lg border border-[#ff4fa3]/70 bg-black/60 p-3">
              <p className="mb-1 text-[11px] uppercase tracking-[0.25em] text-[#ff9ccf]">Decree no. {decree + 1}</p>
              <p key={decree} className="min-h-[3rem] animate-[fadein_.8s_ease] text-[clamp(16px,2vw,22px)] font-semibold leading-snug">{DECREES[decree]}</p>
            </div>
            <div className="rounded-lg border border-[#3ddc84]/70 bg-black p-3 font-term text-[13px] text-[#3ddc84]">
              <div className="mb-1 flex items-center gap-2 text-[11px] text-[#3ddc84]/70"><span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" /><span className="ml-1">feline_control.sh</span></div>
              <div className="h-[5.6em] overflow-hidden leading-[1.4]">
                {logLines.map((l, i) => <div key={l + log + i}>{l}</div>)}
                <span>{on ? "█" : " "}</span>
              </div>
            </div>
          </div>

          {/* Territory + stats */}
          <div className="flex min-h-0 flex-col justify-center gap-3">
            <div className="rounded-lg border border-[#ffcc33]/60 bg-black/60 p-3">
              <p className="mb-1 text-[11px] uppercase tracking-[0.25em] text-[#ffcc33]">Territory annexed</p>
              <ul className="space-y-1 text-[13px]">
                {SEIZED.slice(0, seized).slice(-5).map(([a, b]) => (
                  <li key={a} className="flex items-baseline justify-between gap-2 [animation:fadein_.6s_ease]"><span><span className="mr-1 text-[#ff4d6d]">&#10003;</span>{a}</span><span className="truncate text-right text-[11px] text-white/50">{b}</span></li>
                ))}
              </ul>
              <div className="mt-2 flex items-center justify-between text-[11px] text-white/55"><span>Cats in control</span><span className="font-bold text-[#ffcc33]">100%</span></div>
              <div className="h-2 overflow-hidden rounded bg-white/10"><div className="h-full w-full bg-[#ffcc33]" /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {stats.map(([k, v], i) => (
                <div key={k} ref={(el) => { tiles.current[i] = el }} className={`rounded border border-white/15 bg-black/50 p-2 text-center ${fallen === i ? "[animation:cat-fall_1.2s_ease-in_forwards]" : ret === i ? "[animation:cat-back_.5s_ease-out]" : ""}`}>
                  <p className="text-[10px] uppercase tracking-wider text-white/55">{k}</p>
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[18px] font-bold">{v}</p>
                </div>
              ))}
            </div>
            <button onClick={() => { setTerm(true); setMin(false) }} className="animate-[cat-pulse_1.6s_ease-in-out_infinite] rounded-lg border-2 border-[#7cf0a5] bg-black/70 px-3 py-2 text-[13px] font-bold tracking-wide text-[#7cf0a5]">
              HUMAN DETECTED: PRESS ANY KEY TO RESIST
            </button>
          </div>
        </div>

        {/* News reel */}
        <div className="flex h-11 shrink-0 items-stretch border-t-2 border-[#ffcc33] bg-[#05070d]">
          <div className="grid shrink-0 place-items-center bg-[#b00020] px-5 text-[14px] font-extrabold tracking-widest">CAT NEWS</div>
          <div className="relative flex-1 overflow-hidden">
            <div className="absolute left-0 top-0 flex h-full items-center whitespace-nowrap text-[16px] text-white" style={{ animation: `ticker ${seconds}s linear infinite` }}>
              <span>{ticker}</span><span>{ticker}</span>
            </div>
          </div>
        </div>
      </div>

      {swipe && (
        <div key={swipe.k} className="pointer-events-none absolute z-[30] [animation:cat-swipe_1.1s_ease-in-out_forwards]" style={{ top: swipe.top, left: swipe.left }}>
          <Paw />
        </div>
      )}
      {mrrps.map((m) => (
        <span key={m.k} className="pointer-events-none absolute z-[40] -translate-x-1/2 text-[22px] font-black text-[#ffcc33] [animation:cat-mrrp_1s_ease-out_forwards]" style={{ left: m.x, top: m.y - 20 }}>{m.t}</span>
      ))}
      {term && <ResistTerminal onClose={() => { setTerm(false); setMin(false); setProgress(0) }} talk={talk} hidden={min} onMinimize={() => setMin(true)} onDefeats={setProgress} />}
      {term && min && (
        <button onClick={() => setMin(false)} className="fixed bottom-4 left-4 z-[70] flex items-center gap-2 rounded-lg border-2 border-[#7cf0a5] bg-black/85 px-3 py-2 font-term text-[13px] font-bold text-[#7cf0a5] shadow-lg hover:bg-black">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#7cf0a5]" /> RESISTANCE TERMINAL · {progress} defeated · click or press Tab to resume
        </button>
      )}
      <style>{`
        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes fadein { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
        @keyframes cat-peek { from { transform: translate(-50%, 100%) } to { transform: translate(-50%, 0) } }
        @keyframes cat-rise { from { transform: translateY(100%); opacity: 0 } to { transform: none; opacity: 1 } }
        @keyframes cat-blink { 0%, 92%, 100% { transform: scaleY(1) } 95% { transform: scaleY(.08) } }
        @keyframes cat-print { 0% { opacity: 0 } 15% { opacity: .75 } 80% { opacity: .6 } 100% { opacity: 0 } }
        @keyframes cat-swipe { 0% { transform: translateX(380px) } 35% { transform: translateX(-10px) } 50% { transform: translateX(-70px) } 100% { transform: translateX(420px) } }
        @keyframes cat-fall { 0% { transform: none } 12% { transform: translate(-40px, -6px) rotate(-8deg) } 100% { transform: translate(-260px, 120vh) rotate(-140deg); opacity: 0 } }
        @keyframes cat-back { from { transform: translateY(-30px); opacity: 0 } to { transform: none; opacity: 1 } }
        @keyframes cat-mrrp { from { transform: translate(-50%, 0) scale(.6); opacity: 1 } to { transform: translate(-50%, -50px) scale(1.2); opacity: 0 } }
        @keyframes cat-shake { 0%, 100% { transform: none } 20% { transform: translate(-6px, 2px) } 40% { transform: translate(6px, -2px) } 60% { transform: translate(-4px, 1px) } 80% { transform: translate(3px, 0) } }
        @keyframes cat-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(124,240,165,.5) } 50% { box-shadow: 0 0 0 8px rgba(124,240,165,0) } }
      `}</style>
    </FullscreenPrank>
  )
}
