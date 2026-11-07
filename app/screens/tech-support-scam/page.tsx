"use client"

import { useEffect, useRef, useState } from "react"
import { sfx } from "@/lib/sfx"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { formatDuration, useBlink, useCountdown } from "@/components/prank-kit"

// Browser-locker "tech support" popup. The phone number is in the reserved fictional 555-01xx range.
const PHONE = "1-800-555-0142"
const POPS = [
  "Windows Defender Alert: Trojan Spyware detected",
  "Your computer has been BLOCKED",
  "Banking credentials at risk",
  "System files may be corrupted",
]
const MAX = 5

export default function TechSupportScamScreen() {
  const left = useCountdown(5 * 60 - 1)
  const on = useBlink(600)
  const [pops, setPops] = useState<{ id: number; x: number; y: number; msg: string }[]>([])
  const id = useRef(0)

  useEffect(() => {
    const add = () => {
      const item = { id: ++id.current, x: 4 + Math.random() * 55, y: 8 + Math.random() * 55, msg: POPS[Math.floor(Math.random() * POPS.length)] }
      sfx.error()
      setPops((p) => [...p, item].slice(-MAX))
    }
    add()
    const t = setInterval(add, 2600)
    return () => clearInterval(t)
  }, [])

  return (
    <FullscreenPrank sound="siren" exitMessage="NOTHING WAS WRONG - IT WAS A PRANK!" className="cursor-default bg-[#0078d7] font-segoe text-white">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        <div className="text-[120px] font-light leading-none">:(</div>
        <h1 className="mt-6 max-w-[900px] text-center text-[28px] font-light">Your PC ran into a problem and needs to restart. We&apos;re just collecting some error info.</h1>
        <div className="mt-3 text-[20px]">Stop code: <b>WINDOWS_DEFENDER_THREAT_DETECTED</b></div>
        <div className="mt-8 w-[min(640px,92vw)] border-2 border-white bg-white/95 p-5 text-black shadow-2xl">
          <div className="mb-2 flex items-center gap-2 text-[18px] font-bold text-[#c40000]"><span className={on ? "opacity-100" : "opacity-30"}>⚠</span> Windows Security Warning</div>
          <p className="mb-3 text-[15px]">
            Access to this PC has been blocked for security reasons. Your computer has alerted us that it has been
            infected with a Trojan. Do not shut down or restart this computer: doing so may lead to data loss.
          </p>
          <p className="mb-3 text-[15px]">Contact Microsoft Certified Technicians immediately to remove the threat.</p>
          <div className="mb-3 text-center text-[28px] font-bold text-[#c40000]">Toll free: {PHONE}</div>
          <div className="flex items-center justify-between text-[13px]">
            <span>Time remaining before data loss: <b className="tabular-nums">{formatDuration(left)}</b></span>
            <button className="rounded-sm bg-[#0078d7] px-6 py-2 font-semibold text-white">Call now</button>
          </div>
        </div>
      </div>
      {pops.map((p) => (
        <div key={p.id} className="absolute w-[min(340px,88vw)] border border-[#555] bg-[#f0f0f0] text-black shadow-xl" style={{ left: `${p.x}%`, top: `${p.y}%`, zIndex: 10 + p.id }}>
          <div className="bg-[#c40000] px-2 py-1 text-[12px] font-bold text-white">Windows Security Alert</div>
          <div className="p-3 text-[13px]">{p.msg}. Call {PHONE}.
            <div className="mt-2 text-right"><button onClick={() => setPops((a) => a.filter((x) => x.id !== p.id))} className="border border-[#707070] bg-gradient-to-b from-white to-[#ddd] px-5 py-[2px]">OK</button></div>
          </div>
        </div>
      ))}
    </FullscreenPrank>
  )
}
