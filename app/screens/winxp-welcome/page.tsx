"use client"

import { useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { Avatar, useLogin } from "@/components/lock-kit"

const USERS = [["Administrator", "#d8a020"], ["User", "#3aa0d8"], ["Guest", "#7fb83a"]] as const

export default function WinXPWelcomeScreen() {
  const [sel, setSel] = useState<number | null>(null)
  const login = useLogin({ wrong: "Did you forget your password?", locked: (s) => `Logon unsuccessful. Try again in ${s} seconds.` })
  return (
    <FullscreenPrank exitMessage="YOU ARE STILL ON YOUR OWN COMPUTER - IT WAS A PRANK!" secondary="#00309c" className="cursor-default bg-[#5a7edc] font-[Tahoma,Verdana,sans-serif] text-white">
      <div className="absolute inset-0 bg-[#5a7edc]" />
      <div className="absolute inset-x-0 top-0 h-[16%] bg-[#00309c]" />
      <div className="absolute inset-x-0 top-[16%] h-[3px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[15%] bg-[#00309c]" />
      <div className="absolute inset-x-0 bottom-[15%] h-[3px] bg-gradient-to-r from-[#e8942c] via-[#f5b25a] to-transparent" />
      <div className="absolute inset-y-[19%] left-1/2 hidden w-px bg-gradient-to-b from-transparent via-white/60 to-transparent md:block" />

      <div className="absolute left-[6%] top-[18%] hidden w-[44%] md:block">
        <div className="mt-[16%] text-[clamp(40px,6vw,76px)] font-bold leading-none tracking-tight [text-shadow:2px 2px 4px rgba(0,0,0,.3)]">
          <span className="text-[0.4em] align-top font-normal">Microsoft<sup>®</sup></span><br />Windows<span className="text-[#f5b25a]">xp</span>
        </div>
        <p className="mt-4 text-[18px]">To begin, click your user name</p>
      </div>

      <div className="absolute right-[6%] top-[24%] w-[min(420px,90vw)] md:right-[8%]">
        {USERS.map(([name, color], i) => (
          <div key={name} className="mb-3">
            <button onClick={() => setSel(i)} className={`flex w-full items-center gap-3 rounded-[8px] p-3 text-left transition-colors ${sel === i ? "bg-[#2f5fc7]" : "hover:bg-white/15"}`}>
              <span className="rounded-[6px] border-2 border-white/90 bg-white/30 p-[2px]"><Avatar size={56} bg={color} /></span>
              <span><span className="block text-[22px]">{name}</span>{sel === i && <span className="text-[13px]">Type your password</span>}</span>
            </button>
            {sel === i && (
              <form className="ml-[84px] mt-1" onSubmit={(e) => { e.preventDefault(); login.submit() }}>
                <div className="flex w-[240px] gap-1">
                  <input autoFocus type="password" disabled={login.locked} value={login.value} onChange={(e) => login.setValue(e.target.value)} key={login.shake} className="h-7 flex-1 rounded-[3px] border border-[#6b8cb8] bg-white px-2 text-[13px] text-black outline-none" />
                  <button className="grid h-7 w-7 place-items-center rounded-[5px] border border-white bg-gradient-to-b from-[#5cd05c] to-[#2e9a2e] text-[15px]">→</button>
                </div>
                {login.message && <p className="mt-2 w-[260px] rounded bg-[#ffffe1] px-2 py-1 text-[11px] text-black">{login.message}</p>}
              </form>
            )}
          </div>
        ))}
      </div>

      <div className="absolute bottom-[3%] left-[4%] flex items-center gap-2 text-[15px]">
        <span className="grid h-8 w-8 place-items-center rounded-[5px] border border-white bg-gradient-to-b from-[#e8704a] to-[#c0391b]">⏻</span> Turn off computer
      </div>
      <div className="absolute bottom-[3%] right-[4%] hidden max-w-[330px] text-right text-[12px] md:block">After you log on, you can add or change accounts.<br />Just go to Control Panel and click User Accounts.</div>
    </FullscreenPrank>
  )
}
