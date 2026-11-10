"use client"

import { useEffect, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { fx, speak, startHoldMusic, stopSpeaking } from "@/lib/fx"
import { sfx } from "@/lib/sfx"

const VOICE = [
  "Your call is important to us. Please continue to hold.",
  "All of our agents are currently assisting other computers. Your wait time is... a long time.",
  "Did you know you can resolve this issue on our website? Our website says to call us.",
  "Your call may be recorded for training purposes. The training is not going well.",
  "Thank you for holding. Your hold has been noted. It will be held against you.",
  "Please listen carefully, as our menu options have not changed. They have never changed. They are all the same option.",
  "We appreciate your patience. We do not know where it comes from, but we appreciate it.",
  "If you are calling about your computer, press one. If you are calling about a different computer, you may hang up and cry.",
  "Your estimated wait time is... nine minutes. Or nine hours. We can't tell. The clock is also on hold.",
]
const BAD_KEY = [
  "I'm sorry, that was not a valid option. Please try again.",
  "I did not understand that. Please say the number out loud. Or do not. It will not matter.",
  "That option is currently unavailable. So are all the others.",
  "Thank you. For that, we have moved you to the back of the line.",
]
const NEWS = [
  "Dave from IT has joined the queue ahead of you.",
  "Karen cut the line. She said she knows a guy.",
  "Your position has increased by 40,000 due to unusually high call volume (you).",
  "A caller ahead of you has given up and started a new life.",
  "Your estimated wait time is now: 3 years.",
  "Fun fact: you are the only caller. We are just slow.",
  "Your call has been transferred to the department of transferring calls.",
  "Agent Brenda is available! ...Brenda has gone to lunch.",
]
const fmt = (n: number) => n.toLocaleString("en-US")

export default function OnHold() {
  const [pos, setPos] = useState(3201)
  const [secs, setSecs] = useState(0)
  const [say, setSay] = useState("")
  const [news, setNews] = useState(NEWS[0])
  const [bump, setBump] = useState(0)
  const [wait, setWait] = useState("47 minutes")
  const bars = useRef<(HTMLSpanElement | null)[]>([])
  const idx = useRef(0)
  const newsIdx = useRef(0)
  const speaking = useRef(false)

  useEffect(() => {
    const stopMusic = startHoldMusic()
    const tick = setInterval(() => setSecs((s) => s + 1), 1000)
    const queue = setInterval(() => setPos((p) => (p > 3 ? p - 1 : 3)), 6800)
    const eq = setInterval(() => bars.current.forEach((b, i) => { if (b) b.style.height = `${12 + Math.abs(Math.sin(Date.now() / (160 + i * 23) + i)) * 60 + Math.random() * 18}%` }), 110)
    const bad = setTimeout(function jump() {
      setPos((p) => p + 4000 + Math.floor(Math.random() * 36000))
      setBump((b) => b + 1)
      sfx.error()
      setTimeout(jump, 26000 + Math.random() * 20000)
    }, 22000)
    const waits = ["47 minutes", "52 minutes", "2 hours", "an unknowable amount", "3 years", "47 minutes"]
    let wi = 0
    const wt = setInterval(() => setWait(waits[++wi % waits.length]), 17000)
    const newsT = setInterval(() => setNews(NEWS[++newsIdx.current % NEWS.length]), 9000)

    const announce = async () => {
      if (speaking.current) return
      speaking.current = true
      const line = VOICE[idx.current++ % VOICE.length]
      setSay(line)
      await speak(line, { voice: 0, rate: 0.92, pitch: 1.05 })
      setTimeout(() => { speaking.current = false }, 1500)
    }
    const first = setTimeout(announce, 2500)
    const vt = setInterval(announce, 19000)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key.toLowerCase() === "q") return
      const line = BAD_KEY[Math.floor(Math.random() * BAD_KEY.length)]
      stopSpeaking(); speaking.current = true
      setSay(line); sfx.error()
      speak(line, { voice: 0, rate: 0.95 }).then(() => setTimeout(() => { speaking.current = false }, 1200))
      setPos((p) => p + 100 + Math.floor(Math.random() * 900)); setBump((b) => b + 1)
    }
    addEventListener("keydown", onKey)
    return () => {
      stopMusic(); stopSpeaking(); removeEventListener("keydown", onKey)
      clearInterval(tick); clearInterval(queue); clearInterval(eq); clearTimeout(bad); clearInterval(wt); clearInterval(newsT); clearTimeout(first); clearInterval(vt)
    }
  }, [])

  const mm = String(Math.floor(secs / 3600)).padStart(2, "0") + ":" + String(Math.floor((secs % 3600) / 60)).padStart(2, "0") + ":" + String(secs % 60).padStart(2, "0")
  void fx
  return (
    <FullscreenPrank exitMessage="YOUR CALL HAS FINALLY BEEN ANSWERED - IT WAS A PRANK!" className="cursor-default bg-[#120a2a] font-sans text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#3a1d7a,#120a2a_70%)]" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-[2.2vh] px-6 text-center">
        <div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-1.5 text-[13px] tracking-widest"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#ff4d6d]" /> CALL IN PROGRESS · {mm}</div>

        <div className="grid h-[clamp(120px,22vh,200px)] w-[clamp(120px,22vh,200px)] place-items-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#2563eb] shadow-[0_0_80px_#7c3aed88]">
          <svg viewBox="0 0 24 24" className="h-1/2 w-1/2 animate-[oh-ring_1.6s_ease-in-out_infinite]" fill="#fff" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" /></svg>
        </div>
        <p className="text-[clamp(22px,3.4vw,42px)] font-extrabold tracking-tight">Computer Support Hotline</p>
        <p className="-mt-1 text-[clamp(14px,1.5vw,20px)] text-white/70">Your call is important to us.</p>

        <div className="flex h-[9vh] items-end gap-[3px]">
          {Array.from({ length: 28 }, (_, i) => <span key={i} ref={(el) => { bars.current[i] = el }} className="w-[5px] rounded-sm bg-gradient-to-t from-[#7c3aed] to-[#60a5fa]" style={{ height: "20%" }} />)}
        </div>

        <div className="grid w-[min(620px,92vw)] grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/15 bg-black/35 p-3">
            <p className="text-[11px] tracking-widest text-white/55">YOUR POSITION IN QUEUE</p>
            <p key={bump} className={`font-mono text-[clamp(26px,4.2vw,52px)] font-bold ${bump ? "[animation:oh-shake_.5s]" : ""}`}>#{fmt(pos)}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-black/35 p-3">
            <p className="text-[11px] tracking-widest text-white/55">ESTIMATED WAIT</p>
            <p className="text-[clamp(18px,2.6vw,32px)] font-bold leading-tight">{wait}</p>
          </div>
        </div>

        <p key={say} className="min-h-[3.2em] max-w-[760px] text-[clamp(15px,1.8vw,24px)] leading-snug text-[#c4b5fd] [animation:oh-in_.5s_ease]">{say && <>“{say}”</>}</p>
      </div>

      <div className="absolute bottom-0 inset-x-0 z-10 border-t border-white/15 bg-black/50 px-6 py-2.5 text-center text-[13px] text-white/75">{news}<span className="ml-3 text-white/40">Press any key for more options</span></div>
      <style>{`
        @keyframes oh-ring { 0%,100% { transform: rotate(-12deg) } 50% { transform: rotate(12deg) } }
        @keyframes oh-shake { 0%,100% { transform: none; color: #fff } 20% { transform: translateX(-8px); color: #ff6b6b } 60% { transform: translateX(8px); color: #ff6b6b } }
        @keyframes oh-in { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
      `}</style>
    </FullscreenPrank>
  )
}
