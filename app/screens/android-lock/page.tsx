"use client"

import { useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { Clock } from "@/components/clock"
import { Keypad, PhoneWallpaper, useLogin } from "@/components/lock-kit"

export default function AndroidLockScreen() {
  const [open, setOpen] = useState(false)
  const startY = useRef<number | null>(null)
  const login = useLogin({ wrong: "Wrong PIN", lockAfter: 5, lockSeconds: 30, locked: (s) => `Too many incorrect attempts. Try again in ${s} seconds.` })
  const press = (d: string) => {
    const next = login.value + d
    if (next.length >= 4) login.submit(next)
    else login.setValue(next)
  }
  return (
    <FullscreenPrank exitMessage="YOUR PHONE IS FINE - IT WAS A PRANK!" secondary="#07211f" className="cursor-default select-none font-sans text-white">
      <PhoneWallpaper variant="android" />
      {!open ? (
        <div className="absolute inset-0" onPointerDown={(e) => { startY.current = e.clientY }} onPointerUp={(e) => { if (startY.current !== null && startY.current - e.clientY > 40) setOpen(true); startY.current = null }}>
          <div className="absolute left-[8%] top-[11%]">
            <Clock className="block text-[clamp(80px,13vw,130px)] font-light leading-none" options={{ hour: "numeric", minute: "2-digit", hour12: false }} />
            <Clock kind="date" className="mt-1 block text-[clamp(16px,2.4vw,22px)]" options={{ weekday: "short", month: "short", day: "numeric" }} />
          </div>
          <div className="absolute inset-x-0 bottom-[8%] flex justify-center">
            <button onClick={() => setOpen(true)} className="text-center text-[13px] text-white/80"><span className="mx-auto mb-2 block h-1 w-10 rounded-full bg-white/70" />Swipe up to unlock</button>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 backdrop-blur-xl">
          {login.locked ? (
            <p className="max-w-[300px] text-center text-[18px]">{`Too many incorrect attempts. Try again in ${login.lockLeft} seconds.`}</p>
          ) : (
            <>
              <p className="text-[18px]">Enter your PIN</p>
              <div key={login.shake} className={`mt-4 flex gap-4 ${login.shake ? "animate-[shake_.4s]" : ""}`}>
                {Array.from({ length: 4 }, (_, i) => <span key={i} className={`h-3.5 w-3.5 rounded-full border-2 border-white ${i < login.value.length ? "bg-white" : ""}`} />)}
              </div>
              <p className="mt-3 h-5 text-[14px] text-[#ffb4ab]">{login.message ?? ""}</p>
              <div className="mt-6"><Keypad onDigit={press} onDelete={() => login.setValue(login.value.slice(0, -1))} size={70} /></div>
              <button onClick={() => setOpen(false)} className="mt-6 text-[14px] text-white/80">Cancel</button>
            </>
          )}
        </div>
      )}
      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-14px)} 40%{transform:translateX(12px)} 60%{transform:translateX(-9px)} 80%{transform:translateX(6px)} }`}</style>
    </FullscreenPrank>
  )
}
