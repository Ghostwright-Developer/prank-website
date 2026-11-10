"use client"

import { useEffect, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { Win11Taskbar, Win11Wallpaper } from "@/components/windows-ui"
import { sfx } from "@/lib/sfx"

const APPS = [
  { name: "Unknown application", path: "C:\\Windows\\System32\\svchost.exe", icon: "defender", when: "Currently in use", hot: true },
  { name: "Microsoft Edge", path: "", icon: "edge", when: "Last accessed 3 days ago", hot: false },
  { name: "Microsoft Teams", path: "", icon: "teams", when: "Last accessed 11 days ago", hot: false },
  { name: "Camera", path: "", icon: "camera", when: "Never", hot: false },
]

/** A Windows 11 "camera is in use by an unknown app" privacy alert. Everything on it is fake. */
export default function CameraInUse() {
  const [step, setStep] = useState(0)
  const [on, setOn] = useState(true)
  const [msg, setMsg] = useState("")
  const [reveal, setReveal] = useState(false)

  useEffect(() => {
    const t = [
      setTimeout(() => { setStep(1); sfx.click() }, 1500),
      setTimeout(() => { setStep(2); sfx.error() }, 4500),
      setTimeout(() => setReveal(true), 14000),
    ]
    return () => t.forEach(clearTimeout)
  }, [])

  const flip = () => {
    setOn(false); setMsg("")
    setTimeout(() => { setOn(true); setMsg("This setting is managed by an unknown administrator.") }, 650)
  }

  return (
    <FullscreenPrank exitMessage="NO ONE WAS USING YOUR CAMERA - IT WAS A PRANK!" className="bg-black font-segoe">
      <Win11Wallpaper variant="dark" dark />
      {/* tray camera indicator */}
      <div className="absolute bottom-[14px] right-[132px] z-[5] hidden h-5 w-5 place-items-center sm:grid" title="Camera in use">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h4l2-3h6l2 3h4v11H3z" /><circle cx="12" cy="13" r="3.4" /></svg>
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-[#2ecc71] ring-2 ring-[#1c1c1c]" />
      </div>
      <Win11Taskbar tasks={step >= 1 ? ["Settings"] : []} />

      {/* the Settings window */}
      {step >= 1 && (
        <div className="absolute left-1/2 top-[7%] z-[2] flex h-[72%] w-[min(920px,94%)] -translate-x-1/2 overflow-hidden rounded-lg border border-white/10 bg-[#202020] text-white shadow-[0_24px_80px_rgba(0,0,0,.6)] [animation:ci-in_.3s_ease]">
          <aside className="hidden w-[230px] shrink-0 border-r border-white/5 bg-[#1b1b1b] p-3 text-[13px] sm:block">
            <p className="mb-3 px-2 pt-1 text-[15px] font-semibold">Settings</p>
            {["System", "Bluetooth & devices", "Network & internet", "Personalisation", "Apps", "Accounts", "Privacy & security", "Windows Update"].map((n) => (
              <p key={n} className={`rounded-md px-3 py-2 ${n === "Privacy & security" ? "bg-white/10 font-medium" : "text-white/70"}`}>{n}</p>
            ))}
          </aside>
          <section className="min-w-0 flex-1 overflow-hidden p-5 sm:p-7">
            <p className="text-[12px] text-white/50">Privacy & security &rsaquo;</p>
            <h2 className="text-[26px] font-semibold">Camera</h2>
            <div className="mt-5 flex items-center justify-between rounded-lg bg-white/[.06] px-4 py-3.5 text-[14px]">
              <div><p className="font-medium">Camera access</p><p className="text-[12px] text-white/55">Let apps use your camera</p></div>
              <button onClick={flip} aria-label="Camera access" className="flex items-center gap-2 text-[13px]"><span>{on ? "On" : "Off"}</span><span className={`relative h-5 w-10 rounded-full transition ${on ? "bg-[#4cc2ff]" : "bg-white/25"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-black transition-all ${on ? "left-[22px]" : "left-0.5"}`} /></span></button>
            </div>
            {msg && <p className="mt-2 text-[12px] text-[#ffb3b3]">{msg}</p>}
            <p className="mb-2 mt-6 text-[13px] font-medium text-white/80">Recent activity</p>
            <div className="space-y-1.5">
              {APPS.map((a) => (
                <div key={a.name} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${a.hot ? "bg-[#4a1f1f] ring-1 ring-[#ff6b6b]/50" : "bg-white/[.05]"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/icons/${a.icon}.webp`} alt="" width={30} height={30} className="h-[30px] w-[30px] object-contain" />
                  <div className="min-w-0 flex-1"><p className="truncate text-[14px] font-medium">{a.name}</p>{a.path && <p className="truncate text-[11px] text-white/45">{a.path}</p>}</div>
                  <p className={`shrink-0 text-[12px] ${a.hot ? "font-semibold text-[#ff8a8a]" : "text-white/50"}`}>{a.when}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* the toast */}
      {step >= 1 && (
        <div className="absolute bottom-[62px] right-3 z-[4] flex w-[min(360px,calc(100%-1.5rem))] items-start gap-3 rounded-lg border border-white/10 bg-[#2b2b2b]/95 p-3.5 text-white shadow-2xl [animation:ci-in_.35s_ease]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/camera.webp" alt="" width={34} height={34} className="h-[34px] w-[34px] object-contain" />
          <div className="text-[13px]"><p className="font-semibold">{step >= 2 ? "Camera access granted" : "Camera"}</p><p className="text-white/75">{step >= 2 ? "Unknown application was given access to your camera." : "An app is using your camera."}</p><p className="mt-0.5 text-[11px] text-white/45">just now</p></div>
        </div>
      )}

      {reveal && (
        <div className="absolute left-1/2 top-3 z-[6] -translate-x-1/2 rounded-lg bg-green-900/95 px-5 py-2.5 text-center font-sans shadow-xl">
          <p className="text-sm text-green-200">Relax, this is fake. Nothing is using your camera. Press ESC to exit.</p>
        </div>
      )}
      <style>{`@keyframes ci-in { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
      .ci-win { }`}</style>
    </FullscreenPrank>
  )
}
