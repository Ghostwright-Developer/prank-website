"use client"

import { useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { Clock } from "@/components/clock"
import { Keypad, PhoneWallpaper, useLogin } from "@/components/lock-kit"

export default function IosLockScreen() {
  const [unlocking, setUnlocking] = useState(false)
  const startY = useRef<number | null>(null)
  const login = useLogin({ wrong: "Try Again", lockAfter: 5, lockSeconds: 60, locked: (s) => `Try again in ${s} second${s === 1 ? "" : "s"}` })
  const press = (d: string) => {
    const next = login.value + d
    if (next.length >= 6) login.submit(next)
    else login.setValue(next)
  }
  return (
    <FullscreenPrank exitMessage="YOUR PHONE IS FINE - IT WAS A PRANK!" secondary="#1b1f5e" className="cursor-default select-none font-sf text-white">
      <PhoneWallpaper />
      {!unlocking ? (
        <div
          className="absolute inset-0"
          onPointerDown={(e) => { startY.current = e.clientY }}
          onPointerUp={(e) => { if (startY.current !== null && startY.current - e.clientY > 40) setUnlocking(true); startY.current = null }}
        >
          <div className="absolute inset-x-0 top-[9%] text-center">
            <Clock kind="date" className="block text-[clamp(18px,2.6vw,24px)] font-medium text-white/85" options={{ weekday: "long", month: "long", day: "numeric" }} />
            <Clock className="block text-[clamp(84px,14vw,140px)] font-semibold leading-none" options={{ hour: "numeric", minute: "2-digit", hour12: false }} />
          </div>
          <div className="absolute bottom-[12%] inset-x-0 flex justify-between px-[8%]">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-black/35 text-[20px] backdrop-blur">🔦</span>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-black/35 text-[20px] backdrop-blur">📷</span>
          </div>
          <button onClick={() => setUnlocking(true)} className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center">
            <span className="block text-[13px] text-white/70">Swipe up to unlock</span>
            <span className="mx-auto mt-2 block h-[5px] w-[140px] rounded-full bg-white/80" />
          </button>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/25 backdrop-blur-2xl">
          {login.locked ? (
            <div className="text-center"><p className="text-[28px] font-semibold">iPhone Unavailable</p><p className="mt-2 text-[17px]">{`Try again in ${login.lockLeft} second${login.lockLeft === 1 ? "" : "s"}`}</p></div>
          ) : (
            <>
              <p className="text-[20px]">Enter Passcode</p>
              <div key={login.shake} className={`mt-5 flex gap-4 ${login.shake ? "animate-[shake_.4s]" : ""}`}>
                {Array.from({ length: 6 }, (_, i) => <span key={i} className={`h-3 w-3 rounded-full border border-white ${i < login.value.length ? "bg-white" : ""}`} />)}
              </div>
              <p className="mt-3 h-5 text-[14px]">{login.message ?? ""}</p>
              <div className="mt-6"><Keypad onDigit={press} onDelete={() => login.setValue(login.value.slice(0, -1))} /></div>
              <div className="mt-6 flex w-[min(300px,80vw)] justify-between text-[15px]"><button>Emergency</button><button onClick={() => setUnlocking(false)}>Cancel</button></div>
            </>
          )}
        </div>
      )}
      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-14px)} 40%{transform:translateX(12px)} 60%{transform:translateX(-9px)} 80%{transform:translateX(6px)} }`}</style>
    </FullscreenPrank>
  )
}
