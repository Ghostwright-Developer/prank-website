"use client"

import { useEffect, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { useBelievableProgress } from "@/components/prank-kit"
import { GLASS, Orb, Win12Logo, Win12Wallpaper } from "@/components/win12-ui"

const STEPS = [
  "Learning how you work",
  "Reading your files so Copilot can help (it has opinions)",
  "Calibrating your neural engine",
  "Reorganizing your desktop. You will not recognize it",
  "Replacing your wallpaper with something better",
  "Syncing your habits to the cloud",
  "Building your digital twin",
  "Almost there. Finalizing your digital twin",
]

export default function Win12Update() {
  const pct = useBelievableProgress({ from: 8, max: 99, perSecond: 0.5, stalls: [31, 62, 94] })
  const [step, setStep] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 6500)
    return () => clearInterval(t)
  }, [])
  return (
    <FullscreenPrank secondary="#05060f" exitMessage="UPGRADE CANCELLED - WINDOWS 12 DOES NOT EXIST... YET!" sound="pulse" className="cursor-none font-segoe text-white">
      <Win12Wallpaper />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <div className="relative grid h-[210px] w-[210px] place-items-center">
          <svg className="absolute inset-0" viewBox="0 0 100 100" aria-hidden="true" style={{ animation: "pk12-spin 6s linear infinite" }}>
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
            <circle cx="50" cy="50" r="46" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeDasharray="70 220" style={{ filter: "drop-shadow(0 0 6px #818cf8)" }} />
          </svg>
          <svg className="absolute inset-3" viewBox="0 0 100 100" aria-hidden="true" style={{ animation: "pk12-spin 9s linear infinite reverse" }}>
            <circle cx="50" cy="50" r="44" fill="none" stroke="#67e8f9" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="30 250" />
          </svg>
          <Win12Logo size={84} />
        </div>
        <h1 className="mt-9 text-[34px] font-extralight tracking-wide">Upgrading to Windows 12</h1>
        <p className="mt-2 text-[22px] font-light">{Math.floor(pct)}%</p>
        <div className={`mt-7 flex max-w-xl items-center gap-4 rounded-3xl px-5 py-4 text-left ${GLASS}`}>
          <Orb size={30} />
          <p key={step} className="text-[16px] text-white/90" style={{ animation: "pk12-rise .6s ease both" }}>{STEPS[step]}</p>
        </div>
        <p className="mt-8 text-[14px] text-white/60">Don&apos;t turn off your PC. Your PC will restart several times, and then it will have restarted you.</p>
      </div>
    </FullscreenPrank>
  )
}
