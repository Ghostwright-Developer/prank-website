"use client"

import { useEffect, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { formatDuration } from "@/components/prank-kit"
import { sfx } from "@/lib/sfx"

type Id = "greg" | "brenda" | "todd" | "karen" | "steve" | "priya" | "dev" | "unknown" | "marcus" | "dennis" | "linda"
const ORDER: Id[] = ["greg", "brenda", "todd", "karen", "steve", "priya", "dev", "unknown", "marcus", "dennis", "linda"]
const NAMES: Record<Id, string> = { greg: "Greg (Sales)", brenda: "Brenda (Finance)", todd: "Todd", karen: "Karen", steve: "Steve's iPad", priya: "Priya (Design)", dev: "Dev Team (7)", unknown: "iPhone", marcus: "Marcus (driving)", dennis: "Dennis (HR)", linda: "Linda (CEO)" }
interface Chat { from: string; text: string }

function Person({ skin = "#e0ac86", hair = "#3b2a20", shirt = "#4b6cb7", mouth = "smile", watching = false, closed = false }: { skin?: string; hair?: string; shirt?: string; mouth?: "smile" | "open" | "chew" | "flat"; watching?: boolean; closed?: boolean }) {
  const px = watching ? 1.6 : 0, py = watching ? 1.6 : 0
  return (
    <svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <path d="M8 80 Q10 53 50 53 Q90 53 92 80Z" fill={shirt} />
      <rect x="44" y="44" width="12" height="12" fill={skin} />
      <circle cx="50" cy="34" r="16" fill={skin} />
      <path d="M33 33 Q34 14 50 15 Q67 14 67 33 Q62 22 50 22 Q38 22 33 33Z" fill={hair} />
      {closed ? (<><path d="M41 34 h6 M53 34 h6" stroke="#222" strokeWidth="1.6" strokeLinecap="round" /></>) : (<>
        <circle cx="43" cy="34" r="3.2" fill="#fff" /><circle cx="57" cy="34" r="3.2" fill="#fff" />
        <circle cx={43 + px} cy={34 + py} r="1.6" fill="#222" /><circle cx={57 + px} cy={34 + py} r="1.6" fill="#222" />
      </>)}
      {mouth === "smile" && <path d="M44 42 Q50 47 56 42" fill="none" stroke="#7a2e2e" strokeWidth="1.6" strokeLinecap="round" />}
      {mouth === "flat" && <path d="M45 43 h10" stroke="#7a2e2e" strokeWidth="1.6" strokeLinecap="round" />}
      {mouth === "open" && <ellipse cx="50" cy="43" rx="3.4" ry="4" fill="#5b1f1f" />}
      {mouth === "chew" && <ellipse cx="50" cy="43" rx="4" ry="2.5" fill="#5b1f1f" style={{ animation: "pk-chew .38s infinite alternate", transformOrigin: "50px 43px" }} />}
    </svg>
  )
}

function TileArt({ id, watching }: { id: Id; watching: boolean }) {
  switch (id) {
    case "greg": return (<div className="absolute inset-0 bg-[#c9d6e3]"><Person shirt="#7a5c3e" hair="#2b1d12" mouth="chew" watching={watching} /><svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" aria-hidden="true"><path d="M50 45 Q42 56 52 62 T48 74" fill="none" stroke="#f1d27a" strokeWidth="2.4" strokeLinecap="round" style={{ animation: "pk-noodle 1.1s infinite alternate" }} /><ellipse cx="50" cy="78" rx="22" ry="5" fill="#e7e2d6" /></svg></div>)
    case "brenda": return (<div className="absolute inset-0 bg-[#e9dcc9]"><div style={{ transform: "rotate(-9deg) scale(1.05)" }} className="absolute inset-0"><Person skin="#d29a76" hair="#5a2c1b" shirt="#a24b6a" mouth="open" watching={watching} /></div><div className="absolute inset-0 grid place-items-center bg-slate-700/40 backdrop-blur-[1px]"><div className="flex flex-col items-center gap-1 text-white"><span className="h-6 w-6 rounded-full border-2 border-white/30 border-t-white" style={{ animation: "pk-spin 1s linear infinite" }} /><span className="text-[11px]">Poor connection</span></div></div></div>)
    case "todd": return (<div className="absolute inset-0 grid place-items-center bg-[#111827]"><div className="grid h-14 w-14 place-items-center rounded-full bg-slate-600 text-lg font-bold text-white">TC</div><div className="absolute bottom-2 right-2 flex items-end gap-0.5">{[0, 1, 2, 3].map((k) => <span key={k} className="w-1 rounded bg-emerald-400" style={{ height: 14, animation: `pk-level ${0.7 + k * 0.15}s infinite alternate` }} />)}</div></div>)
    case "karen": return (<div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#ffb48a] to-[#ffe2c2]"><div className="absolute bottom-0 h-1/3 w-full bg-[#4a8fb5]" /><div className="absolute left-[12%] top-[34%] h-[6%] w-[76%] bg-[#d9482b]" /><div className="absolute left-[26%] top-[14%] h-[40%] w-[3%] bg-[#d9482b]" /><div className="absolute left-[68%] top-[14%] h-[40%] w-[3%] bg-[#d9482b]" /><div className="absolute inset-0 opacity-80"><Person skin="#e8b896" hair="#c99a4a" shirt="#6a8f5a" mouth="open" watching={watching} /></div><div className="absolute bottom-0 h-[55%] w-[16%] rounded-t-full bg-black/80" style={{ animation: "pk-walk 9s linear infinite" }} /></div>)
    case "steve": return (<div className="absolute inset-0 overflow-hidden bg-[#efe8d8]"><svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" aria-hidden="true"><g style={{ transformOrigin: "50px 30px", animation: "pk-spin 1.4s linear infinite" }}><rect x="20" y="28" width="60" height="5" rx="2.5" fill="#8a7a62" /><rect x="47.5" y="2" width="5" height="56" rx="2.5" fill="#8a7a62" /></g><circle cx="50" cy="30" r="5" fill="#6b5d48" /></svg><div className="absolute bottom-1 right-2 h-12 w-6 origin-bottom rounded-t-full bg-[#e8b896]" style={{ animation: "pk-wave .6s infinite alternate" }} /></div>)
    case "priya": return (<div className="absolute inset-0 bg-[#d8e6d4]"><Person skin="#b87a56" hair="#1e1e1e" shirt="#e0b04a" watching={watching} /><svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" aria-hidden="true"><path d="M30 80 Q30 46 50 46 Q70 46 70 80Z" fill="#8a8f98" /><path d="M31 52 L33 36 L42 47Z M69 52 L67 36 L58 47Z" fill="#8a8f98" /><circle cx="43" cy="60" r="3.4" fill="#d8e06a" /><circle cx="57" cy="60" r="3.4" fill="#d8e06a" /><ellipse cx="43" cy="60" rx="1" ry="3" fill="#111" /><ellipse cx="57" cy="60" rx="1" ry="3" fill="#111" /><path d="M48 66 l2 2 l2 -2z" fill="#e8a0a0" /><path d="M30 64 h12 M30 68 h12 M58 64 h12 M58 68 h12" stroke="#ddd" strokeWidth=".7" /></svg></div>)
    case "dev": return (<div className="absolute inset-0 grid place-items-center bg-[#1e293b]"><div className="flex flex-wrap justify-center gap-1.5 p-3">{["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6"].map((c) => <span key={c} className="grid h-7 w-7 place-items-center rounded-full text-[9px] font-bold text-white" style={{ background: c }}>⊘</span>)}</div></div>)
    case "unknown": return (<div className="absolute inset-0 grid place-items-center bg-black"><span className="text-[11px] text-slate-500">iPhone</span></div>)
    case "marcus": return (<div className="absolute inset-0 overflow-hidden bg-[#1c1f26]"><div className="absolute inset-x-0 top-0 h-1/3 bg-[#7fb1d8]" /><div className="absolute inset-x-0 top-1/3 h-[12%] overflow-hidden bg-[#3a3f48]">{[0, 1, 2, 3].map((k) => <span key={k} className="absolute top-1/2 h-0.5 w-6 bg-white/80" style={{ left: `${k * 30}%`, animation: "pk-road 1s linear infinite" }} />)}</div><div className="absolute inset-x-0 bottom-0 h-1/2"><Person skin="#c68a63" hair="#222" shirt="#35507a" mouth="flat" watching={watching} /></div><div className="absolute bottom-[-30%] left-1/2 h-24 w-24 -translate-x-1/2 rounded-full border-[6px] border-[#0b0c10]" /></div>)
    case "dennis": return (<div className="absolute inset-0 bg-[#dde3ea]"><div style={{ transform: "translateY(10%) rotate(14deg)", transformOrigin: "50% 100%" }} className="absolute inset-0"><Person skin="#dba98a" hair="#8a8a8a" shirt="#5a6a7a" mouth="open" closed /></div><span className="absolute left-[62%] top-[18%] text-[13px] font-bold text-slate-500" style={{ animation: "pk-zz 2s infinite" }}>Z z</span></div>)
    case "linda": return (<div className="absolute inset-0 bg-gradient-to-br from-[#312e81] to-[#0f172a]"><Person skin="#c9946f" hair="#d8d8d8" shirt="#111827" mouth="flat" watching={watching} /><div className="absolute inset-0 ring-4 ring-inset ring-emerald-400/80" /></div>)
  }
}

function Tile({ id, watching, speaking }: { id: Id; watching: boolean; speaking?: boolean }) {
  return (
    <div className={`relative aspect-video overflow-hidden rounded-lg bg-slate-800 ${speaking ? "ring-2 ring-emerald-400" : ""}`}>
      <TileArt id={id} watching={watching} />
      <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[11px] text-white">{NAMES[id]}</span>
    </div>
  )
}

const FILES = ["taxes_FINAL_v7.pdf", "Screenshot 2019-03-04.png", "New folder (47)", "resume_good.docx", "DO NOT OPEN.zip", "cat_2_(copy).jpg", "untitled.exe"]

export default function MeetingYouForgot() {
  const [cycle, setCycle] = useState(0)
  const [chat, setChat] = useState<Chat[]>([])
  const [cap, setCap] = useState("")
  const [gone, setGone] = useState<Id[]>([])
  const [lindaIn, setLindaIn] = useState(false)
  const [watching, setWatching] = useState(false)
  const [muted, setMuted] = useState(true)
  const [asked, setAsked] = useState(false)
  const [elapsed, setElapsed] = useState(26 * 60 + 14)
  const [toast, setToast] = useState<string | null>(null)
  const [sharing, setSharing] = useState(false)
  const [confirmEnd, setConfirmEnd] = useState(false)
  const [alone, setAlone] = useState(false)
  const chatEnd = useRef<HTMLDivElement>(null)
  const extra = useRef<ReturnType<typeof setTimeout>[]>([])

  const say = (from: string, text: string) => { setChat((c) => [...c, { from, text }].slice(-40)); sfx.click() }
  const leave = (id: Id) => setGone((g) => [...g, id])
  const later = (fn: () => void, ms: number) => { extra.current.push(setTimeout(fn, ms)) }

  useEffect(() => { chatEnd.current?.scrollIntoView({ block: "end" }) }, [chat])
  useEffect(() => { const t = setInterval(() => setElapsed((s) => s + 1), 1000); return () => clearInterval(t) }, [])

  useEffect(() => {
    setChat([]); setCap(""); setGone([]); setLindaIn(false); setWatching(false); setAsked(false); setAlone(false); setMuted(true)
    const S: [number, () => void][] = [
      [0.5, () => { say("Greg", "is he here"); setCap("[Greg slurping noodles]") }],
      [3, () => say("Todd", "host is in the list. camera's off")],
      [5.5, () => { setCap("Karen: Hello? Can you hear us?"); say("Karen", "he's on mute") }],
      [8, () => { say("Brenda", "i think im frozen"); setCap("[Brenda: ... ... ...]") }],
      [10, () => say("Marcus", "sorry driving. is this the budget one")],
      [11.5, () => say("Priya", "yes. the cat says hi")],
      [14, () => { setAsked(true); setCap("Everyone is waiting for you to start the meeting.") }],
      [16, () => { say("Todd", "can someone ping him"); say("Steve", "pinged. nothing") }],
      [19, () => { setLindaIn(true); setWatching(true); sfx.chime(); setCap("Linda has joined the meeting") }],
      [21.5, () => { setCap("Linda: Hi everyone. Are we starting?"); say("Linda", "Who is hosting?") }],
      [24, () => { say("Greg", "he is"); say("Karen", "he's right there") }],
      [27, () => { setCap("Linda: ...I see. Hi. You have been on mute for 26 minutes."); say("Linda", "Please unmute and give us the Q3 numbers.") }],
      [32, () => { say("Greg", "he doesn't have the numbers. he's just staring"); say("Marcus", "pulling over") }],
      [37, () => setCap("[Everyone waiting]")],
      [40, () => say("Linda", "Whenever you're ready.")],
      [44, () => { say("Todd", "i think he's in a different meeting"); say("Brenda", "(frozen)") }],
      [48, () => { setCap("Linda: Is he okay?"); say("Linda", "Is he okay?"); say("Priya", "the cat thinks he's fine") }],
      [52, () => say("Dennis", "wait what meeting is this")],
      [56, () => { leave("brenda"); setCap("Brenda left the meeting") }],
      [59, () => { leave("greg"); say("Greg", "tell him good luck"); setCap("Greg left the meeting") }],
      [62, () => { leave("steve"); setCap("Steve's iPad left the meeting") }],
      [64.5, () => { leave("marcus"); say("Marcus", "pulled over. lost signal. good luck"); setCap("Marcus left the meeting") }],
      [67, () => { leave("todd"); leave("karen"); setCap("Todd and Karen left the meeting") }],
      [70, () => { leave("dennis"); say("Dennis", "this wasn't my meeting"); setCap("Dennis left the meeting") }],
      [72.5, () => { leave("priya"); say("Priya", "bye (the cat says bye)"); setCap("Priya left the meeting") }],
      [75, () => { leave("dev"); leave("unknown"); setCap("Dev Team and iPhone left the meeting") }],
      [78, () => { say("Linda", "Let's reschedule."); setCap("Linda: Let's reschedule.") }],
      [80, () => { leave("linda"); setAlone(true); setCap("You are the only participant. This meeting will end in 59:59.") }],
      [96, () => setCycle((c) => c + 1)],
    ]
    const timers = S.map(([t, fn]) => setTimeout(fn, t * 1000))
    return () => { timers.forEach(clearTimeout); extra.current.forEach(clearTimeout); extra.current = [] }
  }, [cycle])

  const unmute = () => {
    setMuted(false); setAsked(false); sfx.chime(); setToast("You are unmuted")
    setTimeout(() => setToast(null), 2200)
    later(() => setCap("[silence]"), 1500)
    later(() => { setCap("Linda: Go ahead. We can hear you."); say("Linda", "Go ahead. We can hear you now.") }, 3500)
    later(() => { setCap("[more silence]"); say("Greg", "he's just looking at us") }, 9000)
    later(() => say("Marcus", "should i say something"), 13000)
  }
  const share = () => {
    setSharing(true); sfx.ding()
    say("Greg", "nice folder"); later(() => say("Linda", "Let's all take a moment."), 2500)
    later(() => setSharing(false), 8000)
  }
  const endAll = () => {
    setConfirmEnd(false); setToast("Meeting ended for everyone"); sfx.error()
    later(() => setToast(null), 2500)
    later(() => { say("Linda", "Wait, wait, we haven't done the budget"); setToast("Linda has rejoined the meeting") }, 3000)
    later(() => setToast(null), 5500)
  }

  const tiles = ORDER.filter((id) => !gone.includes(id) && (id !== "linda" || lindaIn))

  return (
    <FullscreenPrank exitMessage="YOU DID NOT MISS A MEETING - IT WAS A PRANK!" className="cursor-default bg-[#0f1115] font-sans text-white">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between bg-[#181b22] px-4 py-2 text-[13px]"><span className="font-semibold">Q3 Budget Review <span className="font-normal text-slate-400">· Hosted by You</span></span><span className="font-mono text-slate-300">{formatDuration(elapsed)}</span></div>
        {asked && !alone && (
          <div className="flex items-center justify-center gap-4 bg-amber-500 px-4 py-2 text-[14px] font-medium text-black"><span>{lindaIn ? "Linda has asked you to unmute." : "Everyone is waiting for you to start the meeting."}</span>{muted && <button onClick={unmute} className="rounded bg-black px-3 py-1 text-white hover:bg-slate-800">Unmute</button>}</div>
        )}
        <div className="flex min-h-0 flex-1">
          <div className="relative flex min-w-0 flex-1 flex-col p-3">
            {alone ? (
              <div className="grid flex-1 place-items-center"><div className="w-[min(460px,80%)]"><div className="relative aspect-video overflow-hidden rounded-xl bg-slate-800"><svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" aria-hidden="true"><circle cx="50" cy="32" r="14" fill="#64748b" /><path d="M16 80 Q18 52 50 52 Q82 52 84 80Z" fill="#64748b" /></svg><span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[12px]">You (Host) · Muted</span></div></div></div>
            ) : (
              <div className="grid flex-1 grid-cols-3 content-start gap-2 overflow-hidden md:grid-cols-4">
                {tiles.map((id) => <Tile key={id} id={id} watching={watching} speaking={id === "linda" && lindaIn} />)}
                <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-700 ring-2 ring-sky-400"><svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" aria-hidden="true"><circle cx="50" cy="32" r="14" fill="#94a3b8" /><path d="M16 80 Q18 52 50 52 Q82 52 84 80Z" fill="#94a3b8" /></svg><span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[11px]">You (Host)</span><span className="absolute right-1.5 top-1.5 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold">{muted ? "MUTED" : "LIVE"}</span></div>
              </div>
            )}
            {sharing && (
              <div className="absolute inset-3 z-10 rounded-xl border border-slate-600 bg-[#1d2129] p-4 shadow-2xl"><p className="text-[13px] font-semibold text-amber-300">You are sharing your screen: Downloads (14,203 items)</p><ul className="mt-3 space-y-1.5 text-[14px] text-slate-200">{FILES.map((f) => <li key={f} className="rounded bg-white/5 px-3 py-1.5">{f}</li>)}</ul></div>
            )}
            {cap && <div className="pointer-events-none mt-2 rounded bg-black/70 px-4 py-2 text-center text-[16px]">{cap}</div>}
            {toast && <div className="pointer-events-none absolute left-1/2 top-6 z-20 -translate-x-1/2 rounded-full bg-white px-5 py-2 text-[14px] font-semibold text-black shadow-xl">{toast}</div>}
            {confirmEnd && (
              <div className="absolute inset-0 z-30 grid place-items-center bg-black/60"><div className="w-[min(420px,90%)] rounded-xl bg-white p-5 text-slate-900"><p className="text-[16px] font-semibold">End meeting for all?</p><p className="mt-1 text-[14px] text-slate-600">You are the host. You cannot simply leave a meeting you are hosting.</p><div className="mt-4 flex justify-end gap-2"><button onClick={() => setConfirmEnd(false)} className="rounded border border-slate-300 px-4 py-1.5 text-[14px]">Cancel</button><button onClick={endAll} className="rounded bg-red-600 px-4 py-1.5 text-[14px] font-semibold text-white">End for everyone</button></div></div></div>
            )}
          </div>
          <div className="hidden w-[300px] flex-col border-l border-white/10 bg-[#14171d] md:flex">
            <p className="border-b border-white/10 px-4 py-2.5 text-[13px] font-semibold">Chat</p>
            <div className="flex-1 space-y-2.5 overflow-y-auto px-4 py-3 text-[13px]">{chat.map((c, i) => <p key={i}><b className={c.from === "Linda" ? "text-emerald-300" : "text-sky-300"}>{c.from}</b> <span className="text-slate-200">{c.text}</span></p>)}<div ref={chatEnd} /></div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 bg-[#181b22] px-4 py-3 text-[13px]">
          <button onClick={() => { if (muted) unmute(); else { setMuted(true); setToast("You are muted again. Nobody noticed.") ; later(() => setToast(null), 2200) } }} className={`rounded-lg px-4 py-2 font-medium ${muted ? "bg-red-600" : "bg-slate-700"}`}>{muted ? "Unmute" : "Mute"}</button>
          <button onClick={() => { setToast("Your camera is off. Everyone is already looking at you."); sfx.ding(); later(() => setToast(null), 2600) }} className="rounded-lg bg-slate-700 px-4 py-2">Camera</button>
          <button onClick={share} className="rounded-lg bg-slate-700 px-4 py-2">Share screen</button>
          <button onClick={() => setConfirmEnd(true)} className="rounded-lg bg-red-600 px-4 py-2 font-semibold">Leave</button>
        </div>
      </div>
      <style>{`@keyframes pk-chew{from{transform:scaleY(.5)}to{transform:scaleY(1.5)}}@keyframes pk-noodle{from{transform:translateY(0)}to{transform:translateY(3px)}}@keyframes pk-spin{to{transform:rotate(360deg)}}@keyframes pk-level{from{transform:scaleY(.3)}to{transform:scaleY(1.4)}}@keyframes pk-walk{from{left:-20%}to{left:110%}}@keyframes pk-wave{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}@keyframes pk-road{from{transform:translateX(0)}to{transform:translateX(-120%)}}@keyframes pk-zz{0%,100%{opacity:.2;transform:translateY(4px)}50%{opacity:1;transform:translateY(-4px)}}`}</style>
    </FullscreenPrank>
  )
}
