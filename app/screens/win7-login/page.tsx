"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"
import { Win7Wallpaper } from "@/components/windows-ui"
import { Avatar, useLogin } from "@/components/lock-kit"

export default function Win7LoginScreen() {
  const login = useLogin({ wrong: "The user name or password is incorrect.", locked: (s) => `The referenced account is currently locked out and may not be logged on to. (${s}s)` })
  return (
    <FullscreenPrank exitMessage="YOU ARE STILL ON YOUR OWN COMPUTER - IT WAS A PRANK!" secondary="#0a3a8a" className="cursor-default font-segoe text-white">
      <Win7Wallpaper />
      <div className="absolute inset-0 bg-[#0a3a8a]/35" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="rounded-[6px] border-2 border-white/80 bg-gradient-to-b from-white/50 to-white/20 p-[5px] shadow-[0_0_20px_rgba(0,0,0,.4)]">
          <Avatar size={118} bg="#4f7fb8" />
        </div>
        <div className="mt-4 text-[26px] [text-shadow:0_1px_6px_rgba(0,0,0,.7)]">User</div>
        <form className="mt-3 flex w-[min(300px,80vw)] gap-1" onSubmit={(e) => { e.preventDefault(); login.submit() }}>
          <input autoFocus type="password" disabled={login.locked} value={login.value} onChange={(e) => login.setValue(e.target.value)} key={login.shake} className="h-8 flex-1 rounded-[3px] border border-[#6b8cb8] bg-white px-2 text-[14px] text-black outline-none" />
          <button className="grid h-8 w-8 place-items-center rounded-[3px] border border-[#1e5fa8] bg-gradient-to-b from-[#58b4f0] to-[#1e7fd8] text-[16px] shadow-[inset_0_1px_0_#a8dcff]">→</button>
        </form>
        {login.message && (
          <div className="mt-4 w-[min(380px,86vw)] text-center text-[13px]">
            <p>{login.message}</p>
            {!login.locked && <button onClick={() => login.setValue("")} className="mt-3 min-w-[90px] rounded-[3px] border border-white/70 bg-white/25 px-4 py-1 hover:bg-white/40">OK</button>}
          </div>
        )}
      </div>
      <div className="absolute bottom-0 inset-x-0 flex items-end justify-between p-5 text-[13px]">
        <div className="flex items-center gap-3"><span className="text-[26px] leading-none font-light">Windows <b className="font-semibold">7</b><sup className="text-[10px]">Ultimate</sup></span></div>
        <button className="rounded-[4px] border border-white/60 bg-gradient-to-b from-[#e0605a] to-[#b02820] px-5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,.5)]">Shut down ▸</button>
      </div>
    </FullscreenPrank>
  )
}
