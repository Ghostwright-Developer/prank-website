"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"
import { Clock } from "@/components/clock"
import { Avatar, MacWallpaper, useLogin } from "@/components/lock-kit"

export default function MacLockScreen() {
  const login = useLogin({ wrong: "Incorrect password", locked: (s) => `Too many attempts. Try again in ${s} seconds.` })
  return (
    <FullscreenPrank exitMessage="YOU ARE STILL ON YOUR OWN COMPUTER - IT WAS A PRANK!" secondary="#1a1030" className="cursor-default font-sf text-white">
      <MacWallpaper />
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
      <div className="absolute inset-x-0 top-0 flex h-7 items-center justify-end gap-4 px-4 text-[13px] text-white/90"><span>􀙇</span><span>⌁</span><Clock kind="date" options={{ weekday: "short", month: "short", day: "numeric" }} /><Clock /></div>
      <div className="absolute inset-x-0 top-[9%] text-center [text-shadow:0_1px_10px_rgba(0,0,0,.25)]">
        <Clock kind="date" className="block text-[clamp(18px,2.2vw,26px)] font-medium text-white/90" options={{ weekday: "long", month: "long", day: "numeric" }} />
        <Clock className="block text-[clamp(76px,11vw,140px)] font-semibold leading-none" options={{ hour: "numeric", minute: "2-digit", hour12: false }} />
      </div>
      <div className="absolute inset-x-0 bottom-[17%] flex flex-col items-center">
        <Avatar size={84} bg="#8a8fa8" />
        <div className="mt-3 text-[18px] font-semibold">User</div>
        <form className={`mt-3 ${login.shake ? "animate-[shake_.4s]" : ""}`} key={login.shake} onSubmit={(e) => { e.preventDefault(); login.submit() }}>
          <div className="flex h-8 w-[220px] items-center rounded-full bg-white/25 px-4 backdrop-blur-xl">
            <input autoFocus type="password" disabled={login.locked} value={login.value} onChange={(e) => login.setValue(e.target.value)} placeholder="Enter Password" className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-white/70" />
            <span className="text-white/80">→</span>
          </div>
        </form>
        <div className="mt-3 h-5 text-[13px] text-white/90">{login.message ?? "Touch ID or Enter Password"}</div>
      </div>
      <div className="absolute inset-x-0 bottom-5 flex justify-center gap-8 text-[12px] text-white/90">
        {["Sleep", "Restart", "Shut Down"].map((l) => <button key={l} className="flex flex-col items-center gap-1"><span className="grid h-9 w-9 place-items-center rounded-full bg-white/25">⏻</span>{l}</button>)}
      </div>
      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-12px)} 40%{transform:translateX(10px)} 60%{transform:translateX(-8px)} 80%{transform:translateX(6px)} }`}</style>
    </FullscreenPrank>
  )
}
