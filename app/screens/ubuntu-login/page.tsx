"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"
import { Clock } from "@/components/clock"
import { Avatar, useLogin } from "@/components/lock-kit"

export default function UbuntuLoginScreen() {
  const login = useLogin({ wrong: "Sorry, that didn't work. Please try again.", lockAfter: 3, lockSeconds: 30, locked: (s) => `Authentication failure. Try again in ${s}s.` })
  return (
    <FullscreenPrank exitMessage="YOU ARE STILL ON YOUR OWN COMPUTER - IT WAS A PRANK!" secondary="#2c001e" className="cursor-default font-[Ubuntu,Cantarell,'Noto_Sans',sans-serif] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#5e2750,#2c001e_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_90%,rgba(233,84,32,.55),transparent_55%)]" />
      <div className="absolute inset-x-0 top-0 flex h-7 items-center bg-black/80 px-3 text-[13px]">
        <span className="flex-1" />
        <Clock kind="date" options={{ weekday: "short", month: "short", day: "numeric" }} />
        <Clock className="ml-2" options={{ hour: "numeric", minute: "2-digit", hour12: false }} />
        <span className="flex-1 text-right">⌁ &nbsp;🔊 &nbsp;🔋 &nbsp;⏻</span>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Avatar size={96} bg="#8a5a7a" />
        <div className="mt-3 text-[20px]">User</div>
        <form key={login.shake} className={`mt-4 flex w-[min(280px,80vw)] items-center rounded-full bg-white/15 px-4 ${login.shake ? "animate-[shake_.4s]" : ""}`} onSubmit={(e) => { e.preventDefault(); login.submit() }}>
          <input autoFocus type="password" disabled={login.locked} value={login.value} onChange={(e) => login.setValue(e.target.value)} placeholder="Password" className="h-10 flex-1 bg-transparent text-[14px] outline-none placeholder:text-white/60" />
          <button className="text-[16px]">⏎</button>
        </form>
        <p className="mt-3 h-5 text-[13px] text-[#ffb4a8]">{login.message ?? ""}</p>
        <div className="mt-2 text-[13px] text-white/70">Not listed?</div>
      </div>
      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-12px)} 40%{transform:translateX(10px)} 60%{transform:translateX(-8px)} 80%{transform:translateX(6px)} }`}</style>
    </FullscreenPrank>
  )
}
