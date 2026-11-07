"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"
import { Clock } from "@/components/clock"
import { Win11Wallpaper } from "@/components/windows-ui"
import { Avatar, useLogin, useWake } from "@/components/lock-kit"

export default function Win11LockScreen() {
  const [awake] = useWake()
  const login = useLogin({
    wrong: "The PIN is incorrect. Try again.",
    locked: (s) => `Too many attempts. Try again in ${s} seconds.`,
  })
  return (
    <FullscreenPrank exitMessage="YOU ARE STILL ON YOUR OWN COMPUTER - IT WAS A PRANK!" secondary="#0b1224" className="cursor-default font-segoe text-white">
      <Win11Wallpaper dark />
      <div className={`absolute inset-0 transition-all duration-500 ${awake ? "bg-black/35 backdrop-blur-2xl" : ""}`} />
      {!awake ? (
        <>
          <div className="absolute inset-x-0 top-[9%] text-center [text-shadow:0_2px_12px_rgba(0,0,0,.35)]">
            <Clock className="block text-[clamp(72px,12vw,150px)] font-semibold leading-none" options={{ hour: "numeric", minute: "2-digit", hour12: false }} />
            <Clock kind="date" className="mt-2 block text-[clamp(20px,3vw,34px)]" options={{ weekday: "long", month: "long", day: "numeric" }} />
          </div>
          <div className="absolute bottom-6 right-8 flex gap-6 text-[20px] text-white/90">
            <span title="Network">⌁</span><span title="Accessibility">♿</span><span title="Power">⏻</span>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Avatar size={140} bg="#5b6b85" />
          <div className="mt-5 text-[28px] font-semibold">User</div>
          <form className="mt-6 w-[min(300px,80vw)]" onSubmit={(e) => { e.preventDefault(); login.submit() }}>
            <input
              autoFocus
              type="password"
              inputMode="numeric"
              disabled={login.locked}
              value={login.value}
              onChange={(e) => login.setValue(e.target.value)}
              placeholder="PIN"
              key={login.shake}
              className="h-10 w-full rounded-[4px] border-b-2 border-b-[#60cdff] bg-black/40 px-3 text-[15px] text-white outline-none placeholder:text-white/70"
            />
          </form>
          {login.message && (
            <div className="mt-4 text-center text-[14px]">
              <p>{login.message}</p>
              {!login.locked && <button onClick={() => login.setValue("")} className="mt-4 min-w-[120px] rounded-[4px] bg-white/20 px-6 py-1.5 hover:bg-white/30">OK</button>}
            </div>
          )}
          <button className="mt-5 text-[13px] text-white/85 underline-offset-2 hover:underline" onClick={() => login.submit("forgot")}>I forgot my PIN</button>
          <div className="absolute bottom-6 left-8 text-[13px] text-white/90">Sign-in options</div>
          <div className="absolute bottom-6 right-8 flex gap-6 text-[20px]"><span>⌁</span><span>♿</span><span>⏻</span></div>
        </div>
      )}
    </FullscreenPrank>
  )
}
