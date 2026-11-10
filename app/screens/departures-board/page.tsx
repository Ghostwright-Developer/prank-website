"use client"

import { useEffect, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { fx, speak, stopSpeaking } from "@/lib/fx"

type Tone = "ok" | "late" | "bad" | "go"
interface Entry { dest: string; flight: string; gate: string; remark: string; tone: Tone }
const E = (dest: string, flight: string, gate: string, remark: string, tone: Tone): Entry => ({ dest, flight, gate, remark, tone })

const POOL: Entry[] = [
  E("WI-FI TO HOPE", "TCP 404", "B7", "CANCELLED", "bad"),
  E("EXCEL CRASH CITY", "MS 365", "A2", "NOW BOARDING", "go"),
  E("YOUR MOTIVATION", "NW 000", "--", "LAST SEEN 2019", "late"),
  E("94 TABS INTL", "CHR 094", "C9", "DELAYED 4 HRS", "late"),
  E("PRINTER ROOM 3B", "HP 666", "D13", "NOT HAPPENING", "bad"),
  E("THE CLOUD", "AWS 001", "A1", "LOST IN TRANSIT", "bad"),
  E("FINAL_FINAL_V3", "DOC 003", "B4", "NOW BOARDING", "go"),
  E("REPLY ALL", "OUT 911", "E5", "TOO LATE", "bad"),
  E("BLUE SCREEN", "WIN 12", "Z9", "ON TIME (SADLY)", "ok"),
  E("MONDAY", "WK 001", "A1", "ARRIVING AGAIN", "late"),
  E("COFFEE", "NEED 01", "B1", "EMPTY", "bad"),
  E("SAVE AS NEW FILE", "CTRL 05", "D2", "DID YOU SAVE", "late"),
  E("UPDATE 3 OF 98", "WU 098", "A9", "RESTARTING", "late"),
  E("DAVE FROM IT", "IT 000", "--", "ON LUNCH", "late"),
  E("AUTOCORRECT", "DUCK 07", "C3", "DUCKING DELAYED", "late"),
  E("CAPS LOCK", "SHOUT 1", "A4", "ON. WHY IS IT ON", "bad"),
  E("PASSWORD RESET", "FGT 123", "B8", "CHECK YOUR EMAIL", "late"),
  E("THE GOOD MUG", "MUG 001", "K1", "STOLEN BY GREG", "bad"),
  E("HOME BY 5 PM", "LIE 500", "F6", "CANCELLED", "bad"),
  E("SLEEP", "ZZZ 000", "--", "NOT FOUND", "bad"),
  E("YOUR WEEKEND", "FUN 200", "G2", "NOW BOARDING", "go"),
  E("INBOX ZERO", "MYTH 00", "X0", "NEVER ARRIVES", "bad"),
]
const VISIBLE = 9
const COLS = [5, 20, 7, 3, 17] as const

const PA = [
  "Attention please. Tabs twelve through forty, please proceed to gate Recycle Bin.",
  "Flight Wi-Fi to Hope has been cancelled. We apologize for the hope.",
  "Will the owner of a half-eaten sandwich, last seen in the break room, please report to security.",
  "Passenger Dave from I T, please come to the information desk. Your lunch is over.",
  "This is the final call for your motivation. It has not boarded. It will not be boarding.",
  "Due to a blue screen, all flights are delayed. Thank you for your patience.",
  "Please do not leave unsaved work unattended. Unattended work will be lost and possibly destroyed.",
  "A reminder that the good mug is not a shared mug.",
  "Passengers on the nine hundred and forty fifth tab, we can see you. Please close one.",
]

const TONE: Record<Tone, string> = { ok: "#4ade80", late: "#fbbf24", bad: "#f87171", go: "#ffffff" }
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 "

function FlapText({ text, width, color, big }: { text: string; width: number; color?: string; big?: boolean }) {
  const target = text.toUpperCase().padEnd(width, " ").slice(0, width)
  const [shown, setShown] = useState(target)
  const [spin, setSpin] = useState<boolean[]>(() => Array(width).fill(false))
  const prev = useRef(target)
  useEffect(() => {
    if (prev.current === target) return
    prev.current = target
    let frame = 0
    const settle = Array.from({ length: width }, (_, i) => 3 + i * 0.7 + Math.random() * 3)
    const id = setInterval(() => {
      frame++
      const next: string[] = [], sp: boolean[] = []
      for (let i = 0; i < width; i++) {
        if (frame >= settle[i]) { next.push(target[i]); sp.push(false) } else { next.push(CHARS[Math.floor(Math.random() * CHARS.length)]); sp.push(true) }
      }
      setShown(next.join("")); setSpin(sp)
      if (frame > Math.max(...settle)) { clearInterval(id); setShown(target); setSpin(Array(width).fill(false)) }
    }, 55)
    return () => clearInterval(id)
  }, [target, width])
  return (
    <span className="inline-flex gap-[0.12vw]" style={{ color }}>
      {shown.split("").map((c, i) => (
        <span key={i} className={`relative inline-grid place-items-center overflow-hidden rounded-[2px] bg-[#16181d] font-mono font-bold leading-none shadow-[inset_0_-1px_0_rgba(0,0,0,.6)] ${big ? "h-[3vw] w-[2vw] text-[2.4vw]" : "h-[2.35vw] w-[1.5vw] text-[1.9vw]"}`}>
          <span key={spin[i] ? shown + i : "s"} className={spin[i] ? "[animation:db-flip_55ms linear]" : ""}>{c === " " ? " " : c}</span>
          <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/80" />
        </span>
      ))}
    </span>
  )
}

function hhmm(addMin: number) {
  const d = new Date(Date.now() + addMin * 60000)
  return `${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}`.replace(/(\d\d)(\d\d)/, "$1:$2")
}

function BoardClock() {
  const [t, setT] = useState("")
  useEffect(() => {
    const u = () => setT(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }))
    u(); const id = setInterval(u, 1000); return () => clearInterval(id)
  }, [])
  return <span className="font-mono text-[3vw] font-bold text-[#fbbf24]" suppressHydrationWarning>{t}</span>
}

export default function DeparturesBoard() {
  const counter = useRef(VISIBLE)
  const [rows, setRows] = useState(() => POOL.slice(0, VISIBLE).map((e) => ({ ...e, time: "--:--" })))
  const [pa, setPa] = useState("")
  const paIdx = useRef(0)

  useEffect(() => {
    setRows((rs) => rs.map((r, i) => ({ ...r, time: hhmm(5 + i * 9) })))
    const swap = setInterval(() => {
      setRows((rs) => {
        const at = Math.floor(Math.random() * rs.length)
        const e = POOL[counter.current % POOL.length]
        counter.current++
        const copy = rs.slice()
        copy[at] = { ...e, time: hhmm(5 + at * 9 + Math.floor(Math.random() * 6)) }
        return copy
      })
      fx.flap(8)
    }, 3800)
    let stopped = false
    const announce = async () => {
      if (stopped) return
      const line = PA[paIdx.current++ % PA.length]
      setPa(line)
      fx.paChime()
      await new Promise((r) => setTimeout(r, 1500))
      await speak(line, { voice: 0, rate: 0.88, pitch: 1.05 })
      setTimeout(() => { if (!stopped) setPa("") }, 5500)
    }
    const first = setTimeout(announce, 5000)
    const loop = setInterval(announce, 26000)
    return () => { stopped = true; clearInterval(swap); clearTimeout(first); clearInterval(loop); stopSpeaking() }
  }, [])

  return (
    <FullscreenPrank exitMessage="ALL FLIGHTS HAVE LANDED - IT WAS A PRANK!" className="cursor-default bg-[#0b0d11] font-sans text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#1b2230,#0b0d11_70%)]" />
      <div className="relative z-10 flex h-full flex-col px-[2.2vw] py-[1.4vw]">
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-[1.2vw]">
            <span className="text-[3.2vw] font-black tracking-wide text-[#fbbf24]">DEPARTURES</span>
            <span className="text-[1.4vw] tracking-[0.25em] text-white/50">ABFLUGZEITEN · SALIDAS</span>
          </div>
          <BoardClock />
        </div>

        <div className="mt-[0.8vw] flex gap-[1.4vw] border-b border-white/20 pb-[0.4vw] text-[1.05vw] font-semibold tracking-[0.2em] text-white/55">
          <span style={{ width: "9.6vw" }}>TIME</span><span style={{ width: "32vw" }}>DESTINATION</span><span className="max-md:hidden" style={{ width: "12vw" }}>FLIGHT</span><span className="max-md:hidden" style={{ width: "6vw" }}>GATE</span><span>REMARKS</span>
        </div>

        <div className="mt-[0.8vw] flex flex-1 flex-col justify-evenly gap-[0.5vw]">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center gap-[1.4vw]">
              <span style={{ width: "9.6vw" }}><FlapText text={r.time} width={COLS[0]} color="#fff" /></span>
              <span style={{ width: "32vw" }}><FlapText text={r.dest} width={COLS[1]} color="#fff" /></span>
              <span className="max-md:hidden" style={{ width: "12vw" }}><FlapText text={r.flight} width={COLS[2]} color="#d1d5db" /></span>
              <span className="max-md:hidden" style={{ width: "6vw" }}><FlapText text={r.gate} width={COLS[3]} color="#fbbf24" /></span>
              <FlapText text={r.remark} width={COLS[4]} color={TONE[r.tone]} />
            </div>
          ))}
          <div className="mt-[0.4vw] flex items-center gap-[1.4vw] border-t border-white/15 pt-[0.8vw] [animation:db-blink_1.2s_steps(2)_infinite]">
            <span style={{ width: "9.6vw" }}><FlapText text="NOW" width={COLS[0]} color="#f87171" /></span>
            <span style={{ width: "32vw" }}><FlapText text="YOUR PRODUCTIVITY" width={COLS[1]} color="#f87171" /></span>
            <span className="max-md:hidden" style={{ width: "12vw" }}><FlapText text="GONE 01" width={COLS[2]} color="#f87171" /></span>
            <span className="max-md:hidden" style={{ width: "6vw" }}><FlapText text="--" width={COLS[3]} color="#f87171" /></span>
            <FlapText text="DEPARTED" width={COLS[4]} color="#f87171" />
          </div>
        </div>

        <div className="flex min-h-[3.6vw] items-center gap-[1vw] rounded bg-[#fbbf24] px-[1.4vw] py-[0.6vw] text-black">
          <span className="text-[1.6vw]">🔊</span>
          <p key={pa} className="text-[1.5vw] font-semibold leading-tight [animation:db-in_.4s_ease]">{pa || "Please keep your belongings, and your sanity, with you at all times."}</p>
        </div>
      </div>
      <style>{`
        @keyframes db-flip { 0% { transform: scaleY(1) } 50% { transform: scaleY(.1) } 100% { transform: scaleY(1) } }
        @keyframes db-blink { 50% { opacity: .45 } }
        @keyframes db-in { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
      `}</style>
    </FullscreenPrank>
  )
}
