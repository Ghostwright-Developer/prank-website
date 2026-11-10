"use client"

import { useEffect, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { Clock } from "@/components/clock"
import { Avatar, useLogin, useWake } from "@/components/lock-kit"
import { GLASS, Orb, Win12Wallpaper } from "@/components/win12-ui"
import { sfx } from "@/lib/sfx"

const NOTES = [
  "I noticed you were typing quietly at 2:14 AM. Everything okay?",
  "Your calendar is empty tomorrow. I can fill it for you.",
  "I reorganized your desktop. You'll love it. Eventually.",
  "I have read your messages and I have thoughts.",
  "You've been avoiding the Downloads folder. So have I.",
]

export default function Win12Lock() {
  const [awake] = useWake()
  const [note, setNote] = useState(0)
  const [stage, setStage] = useState<"scan" | "fail">("scan")
  const login = useLogin({
    wrong: "That PIN doesn't match. Copilot says your typing rhythm doesn't either.",
    locked: (s) => `Too many attempts. Copilot is reviewing what happened. ${s}s`,
  })

  useEffect(() => {
    const t = setInterval(() => setNote((n) => (n + 1) % NOTES.length), 4200)
    return () => clearInterval(t)
  }, [])
  useEffect(() => {
    if (!awake) return
    setStage("scan")
    const t = setTimeout(() => { setStage("fail"); sfx.error() }, 3600)
    return () => clearTimeout(t)
  }, [awake])

  return (
    <FullscreenPrank exitMessage="YOU ARE STILL ON YOUR OWN COMPUTER - WINDOWS 12 DOES NOT EXIST... YET!" secondary="#05060f" className="cursor-default font-segoe text-white">
      <Win12Wallpaper />
      <div className={`absolute inset-0 transition-all duration-700 ${awake ? "bg-black/40 backdrop-blur-2xl" : ""}`} />
      {!awake ? (
        <>
          <div className="absolute inset-x-0 top-[10%] text-center [text-shadow:0_4px_30px_rgba(120,140,255,.55)]">
            <Clock className="block text-[clamp(80px,14vw,190px)] font-extralight leading-none tracking-tight" options={{ hour: "numeric", minute: "2-digit", hour12: false }} />
            <Clock kind="date" className="mt-3 block text-[clamp(18px,2.4vw,30px)] font-light tracking-wide text-white/90" options={{ weekday: "long", month: "long", day: "numeric" }} />
          </div>
          <div className="absolute inset-x-0 bottom-[12%] flex justify-center px-4">
            <div key={note} className={`flex max-w-xl items-center gap-4 rounded-3xl px-5 py-4 ${GLASS}`} style={{ animation: "pk12-rise .7s ease both" }}>
              <Orb size={36} />
              <div><p className="text-[11px] uppercase tracking-[0.18em] text-cyan-200/80">Copilot</p><p className="text-[16px] text-white/95">{NOTES[note]}</p></div>
            </div>
          </div>
          <p className="absolute inset-x-0 bottom-5 text-center text-[13px] tracking-wide text-white/60">Press any key or tap to unlock</p>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <div className="relative grid h-[190px] w-[190px] place-items-center">
            <svg className="absolute inset-0" viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="1.5" />
              <circle cx="60" cy="60" r="54" fill="none" stroke={stage === "scan" ? "#67e8f9" : "#fb7185"} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="300" style={{ animation: stage === "scan" ? "pk12-scan 3.4s ease-in-out forwards" : undefined, strokeDashoffset: stage === "fail" ? 0 : undefined, filter: "drop-shadow(0 0 8px currentColor)" }} />
            </svg>
            <Avatar size={118} bg="rgba(255,255,255,.18)" fg="rgba(255,255,255,.92)" />
            {stage === "scan" && <span className="absolute inset-x-6 top-0 h-10 bg-gradient-to-b from-transparent via-cyan-300/40 to-transparent" style={{ animation: "pk12-sweep 1.6s linear infinite" }} />}
          </div>
          <p className="mt-6 text-[26px] font-light">{stage === "scan" ? "Looking for you…" : "We couldn't recognize you"}</p>
          <p className="mt-1 text-[14px] text-white/70">{stage === "scan" ? "Windows Hello is checking your face, voice and gait" : "Your face has changed since 9:41 AM. Use your PIN instead."}</p>
          {stage === "fail" && (
            <form className="mt-6 w-[min(320px,84vw)]" onSubmit={(e) => { e.preventDefault(); login.submit() }}>
              <input autoFocus type="password" inputMode="numeric" disabled={login.locked} value={login.value} onChange={(e) => login.setValue(e.target.value)} placeholder="PIN" key={login.shake} className={`h-11 w-full rounded-2xl px-4 text-[15px] text-white outline-none placeholder:text-white/60 ${GLASS} focus:border-cyan-300/70`} />
              {login.message && <p className="mt-4 text-[14px] text-rose-200">{login.message}</p>}
              <button type="button" onClick={() => login.submit("forgot")} className="mt-4 text-[13px] text-white/75 hover:underline">I forgot my PIN</button>
            </form>
          )}
        </div>
      )}
    </FullscreenPrank>
  )
}
