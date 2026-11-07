"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"
import { Clock } from "@/components/clock"
import { Win10Wallpaper } from "@/components/windows-ui"
import { Avatar, useLogin, useWake } from "@/components/lock-kit"

export default function Win10LockScreen() {
  const [awake] = useWake()
  const login = useLogin({
    wrong: "The password is incorrect. Try again.",
    locked: (s) => `Too many attempts. Try again in ${s} seconds.`,
  })
  return (
    <FullscreenPrank exitMessage="YOU ARE STILL ON YOUR OWN COMPUTER - IT WAS A PRANK!" secondary="#031a3d" className="cursor-default font-segoe text-white">
      <Win10Wallpaper />
      <div className={`absolute inset-0 transition-all duration-500 ${awake ? "bg-[#0a1a33]/55 backdrop-blur-xl" : ""}`} />
      {!awake ? (
        <>
          <div className="absolute bottom-24 left-12 [text-shadow:0_1px_6px_rgba(0,0,0,.4)]">
            <Clock className="block text-[clamp(64px,10vw,120px)] font-light leading-none" options={{ hour: "numeric", minute: "2-digit", hour12: false }} />
            <Clock kind="date" className="mt-1 block text-[clamp(22px,3vw,40px)] font-light" options={{ weekday: "long", month: "long", day: "numeric" }} />
          </div>
          <div className="absolute bottom-8 right-8 flex gap-6 text-[20px]"><span>⌁</span><span>♿</span></div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Avatar size={200} bg="#6b7b95" />
          <div className="mt-6 text-[34px] font-light">User</div>
          <form className="mt-5 flex w-[min(300px,80vw)]" onSubmit={(e) => { e.preventDefault(); login.submit() }}>
            <input autoFocus type="password" disabled={login.locked} value={login.value} onChange={(e) => login.setValue(e.target.value)} placeholder="Password" key={login.shake} className="h-9 flex-1 border-2 border-white/80 bg-white/90 px-3 text-[14px] text-black outline-none placeholder:text-black/55" />
            <button className="grid h-9 w-9 place-items-center border-2 border-white/80 bg-[#0078d7] text-[16px] text-white hover:bg-[#1085e0]">→</button>
          </form>
          {login.message && (
            <div className="mt-4 text-center text-[14px]">
              <p>{login.message}</p>
              {!login.locked && <button onClick={() => login.setValue("")} className="mt-3 min-w-[100px] border-2 border-transparent bg-white/25 px-5 py-1 hover:border-white">OK</button>}
            </div>
          )}
          <button onClick={() => login.submit("forgot")} className="mt-4 text-[13px] hover:underline">I forgot my password</button>
          <div className="absolute bottom-6 right-8 flex gap-6 text-[20px]"><span>⌁</span><span>♿</span><span>⏻</span></div>
        </div>
      )}
    </FullscreenPrank>
  )
}
