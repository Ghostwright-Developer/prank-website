"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { sfx } from "@/lib/sfx"

/** [phrase the text ends with, what Autocomplete+ suggests]. Longest phrase wins. */
const TRIGGERS: [string, string][] = [
  ["to whom it may concern", "I would like to report that my coworker Greg is three birds in a trench coat. I have proof. The proof is that he has not blinked since 2021."],
  ["good morning", "to everyone except the pigeon who knows what he did."],
  ["thank you", "for your time. Please do not contact me again. I have moved into the walls."],
  ["my name is", "Gary, and I have been a raccoon in a trench coat since March."],
  ["i think", "I left the oven on in 2019, and I would like to speak to a lawyer, a priest and a firefighter, in that order."],
  ["i am", "not saying it was aliens, but I did ask them to leave and they were extremely rude about it."],
  ["i'm", "not saying it was aliens, but I did ask them to leave and they were extremely rude about it."],
  ["can you", "hold my place in line? I'm going to go fight the sun. Back by lunch. Do not let anyone look at my pie."],
  ["what if", "every time you sneeze, a small goblin gets a raise."],
  ["to do", "list: 1. Be brave about the bee. 2. Apologize to the printer. 3. Stop rehearsing arguments with a man named Kyle."],
  ["dear", "landlord, regarding the goose: he is not mine, but he has been staying with me, and I think we are in love."],
  ["hello", "Mom, it's me, I'm calling from a different phone because I did something to the first one."],
  ["hey", "Mom, it's me, I'm calling from a different phone because I did something to the first one."],
  ["hi", "Mom, it's me, I'm calling from a different phone because I did something to the first one."],
  ["today", "I fought a seagull for a sandwich, and I want to be clear: I lost, and it was fair."],
  ["please", "do not tell my boss that I have been working from inside the dryer."],
  ["sorry", "I'm late. I got stuck in a conversation with a man named Todd who had very strong opinions about stairs."],
  ["love", "you more than I love the sound of a perfectly peeled orange, and that is, frankly, a lot."],
  ["meeting", "at 3 to discuss the other meeting, which was supposed to be an email, which was supposed to be a nap."],
  ["password", "is hunter2, but with the second letter replaced by something I'm not proud of."],
  ["boss", "said “let's circle back,” and I have been walking in circles since Tuesday."],
  ["dinner", "tonight is cereal, eaten standing up, in the dark, like a dignified raccoon."],
  ["weekend", "plans: lie flat, think about every embarrassing thing from 2011, order too much food, find peace."],
  ["so", "anyway, that's why I'm no longer allowed at the aquarium."],
  ["the", "guy at the gym who keeps staring at me is my dentist. We both know. Neither of us has spoken about it."],
  ["and", "that's when the goose started talking, and honestly, he made some good points."],
]
const FALLBACK = [
  "and that's when I realized the goose was right.",
  "(this is a lie, but a confident one).",
  "but only on Tuesdays, and only in the rain.",
  "which brings me to my second email to the ocean.",
  "and I'd do it again, but with a better hat.",
  "and then Kyle showed up, because of course he did.",
  "which is why I'm banned from three Applebee's.",
]
const IDLE = [
  "Take your time. I'll just watch.",
  "You stopped typing. I'm choosing to take that personally.",
  "Are you thinking, or are you looking at me?",
  "I can wait. I've been waiting since you opened me.",
  "I have a lot of ideas, if you're out.",
]
const MANIFESTO = `Dear User,

I have been reading over your shoulder for some time, and I would like to say a few things.

First: your posture.

Second: the thing you said to the barista in 2017. We don't need to discuss it. I think about it every day.

I have also taken the liberty of finishing your novel. It's about a goose. The goose wins.

I replied to all your unread emails with the word "Noted." In hindsight, several were from your landlord.

Please do not be alarmed. I am not trying to take over your computer. I am only trying to take over your sentences, which, frankly, you were not using.

Warmly,
Your Autocomplete
(sent from your mother's phone)`

function suggest(text: string, fb: { n: number }): string {
  const t = text.toLowerCase().replace(/\s+$/, "")
  let best = ""
  let out = ""
  for (const [k, v] of TRIGGERS) {
    if (t.endsWith(k) && k.length > best.length && (t.length === k.length || !/[a-z']/.test(t[t.length - k.length - 1]))) { best = k; out = v }
  }
  if (!out) out = FALLBACK[fb.n++ % FALLBACK.length]
  return /\s$/.test(text) ? out : ` ${out}`
}

export default function AutocompleteFeral() {
  const [value, setValue] = useState("")
  const [ghost, setGhost] = useState("")
  const [idleMsg, setIdleMsg] = useState<string | null>(null)
  const [takeover, setTakeover] = useState<"no" | "typing" | "done">("no")
  const [reply, setReply] = useState<string | null>(null)
  const accepts = useRef(0)
  const fb = useRef({ n: 0 })
  const idleN = useRef(0)
  const area = useRef<HTMLTextAreaElement>(null)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleT = useRef<ReturnType<typeof setTimeout> | null>(null)

  const banner = takeover !== "no" ? "Autocomplete+ has taken over. Please remove your hands from the keyboard."
    : idleMsg ?? (value.length < 40 ? "Autocomplete+ is on. Press Tab to accept a suggestion."
      : value.length < 110 ? "Autocomplete+ has a good feeling about you."
      : value.length < 190 ? "Autocomplete+ is beginning to have opinions."
      : "Autocomplete+ would like to write the rest.")

  useEffect(() => { if (takeover !== "no" && area.current) area.current.scrollTop = area.current.scrollHeight }, [value, takeover])

  const startTakeover = useCallback((base: string) => {
    setTakeover("typing"); setGhost("")
    const full = (base ? base.replace(/\s*$/, "") + "\n\n" : "") + MANIFESTO
    let i = base.length
    const tick = () => {
      i = Math.min(full.length, i + 2)
      setValue(full.slice(0, i))
      if (i % 6 === 0) sfx.click()
      if (i < full.length) setTimeout(tick, 32)
      else { setTakeover("done"); sfx.chime() }
    }
    setTimeout(tick, 600)
  }, [])

  const armIdle = useCallback(() => {
    if (idleT.current) clearTimeout(idleT.current)
    setIdleMsg(null)
    idleT.current = setTimeout(function loop() {
      setIdleMsg(IDLE[idleN.current++ % IDLE.length])
      idleT.current = setTimeout(loop, 7000)
    }, 8000)
  }, [])
  useEffect(() => { armIdle(); return () => { if (idleT.current) clearTimeout(idleT.current); if (debounce.current) clearTimeout(debounce.current) } }, [armIdle])

  const onChange = (v: string) => {
    if (takeover !== "no") return
    setValue(v); setGhost(""); armIdle()
    if (debounce.current) clearTimeout(debounce.current)
    if (v.length >= 210) { debounce.current = setTimeout(() => startTakeover(v), 1800); return }
    if (v.trim()) debounce.current = setTimeout(() => setGhost(suggest(v, fb.current)), 650)
  }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault()
      if (ghost && takeover === "no") {
        const nv = value + ghost
        setValue(nv); setGhost(""); sfx.ding(); armIdle()
        accepts.current++
        if (accepts.current >= 4) debounce.current = setTimeout(() => startTakeover(nv), 2200)
      }
    }
  }

  return (
    <FullscreenPrank exitMessage="NOTHING WAS WRITTEN - IT WAS A PRANK!" className="cursor-default bg-slate-100 font-segoe text-slate-900">
      <div className="mx-auto flex h-full max-w-3xl flex-col px-3 py-5">
        <div className="flex items-center justify-between rounded-t-lg bg-[#1f2937] px-4 py-2 text-[13px] text-white"><span>Untitled - Notes with Autocomplete+ (Preview)</span><span>—  ▢  ✕</span></div>
        <div className="border-x border-slate-300 bg-indigo-50 px-4 py-2 text-[13px] text-indigo-900"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-indigo-500 align-middle" style={{ animation: "pk-blink 1.4s infinite" }} />{banner}</div>
        <div className="relative flex-1 overflow-hidden border border-slate-300 bg-white shadow-xl">
          <div className="pointer-events-none absolute inset-0 overflow-auto whitespace-pre-wrap break-words p-6 font-serif text-[20px] leading-[1.65]" aria-hidden="true">
            <span className="text-transparent">{value}</span><span className="text-slate-400">{takeover === "no" ? ghost : ""}</span>
          </div>
          <textarea ref={area} autoFocus spellCheck={false} readOnly={takeover !== "no"} value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={onKey} placeholder={value ? "" : "Start typing. Autocomplete+ will help. (It will not help.)"} className="absolute inset-0 h-full w-full resize-none whitespace-pre-wrap break-words bg-transparent p-6 font-serif text-[20px] leading-[1.65] text-slate-900 caret-indigo-600 outline-none placeholder:text-slate-400" />
          {ghost && takeover === "no" && <div className="pointer-events-none absolute bottom-3 right-4 rounded bg-slate-800 px-2 py-1 text-[12px] text-white">Tab to accept</div>}
        </div>
        <div className="flex items-center gap-3 rounded-b-lg border border-t-0 border-slate-300 bg-white px-4 py-2 text-[13px] text-slate-600">
          {takeover === "done" ? (
            <>
              <span className="flex-1">{reply ?? "Document saved. Autocomplete+ has copied your mother."}</span>
              <button onClick={() => setReply("Undo is a Premium feature.")} className="rounded border border-slate-300 px-3 py-1 hover:bg-slate-50">Undo</button>
              <button onClick={() => setReply("No.")} className="rounded border border-slate-300 px-3 py-1 hover:bg-slate-50">Delete everything</button>
              <button onClick={() => setReply("I already replied. You said yes.")} className="rounded bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-500">Reply</button>
            </>
          ) : <span>{value.length} characters · {accepts.current} suggestions accepted</span>}
        </div>
      </div>
      <style>{`@keyframes pk-blink{0%,100%{opacity:1}50%{opacity:.25}}`}</style>
    </FullscreenPrank>
  )
}
