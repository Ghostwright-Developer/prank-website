"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { sfx } from "@/lib/sfx"
import { FullscreenPrank } from "@/components/fullscreen-prank"

interface Err { id: number; x: number; y: number; title: string; body: string }

const ERRORS = [
  { title: "Application Error", body: "PROGMAN caused a General Protection Fault in module USER.EXE at 0003:1D4F." },
  { title: "Application Error", body: "WINWORD caused a General Protection Fault in module KRNL386.EXE at 0001:2A84." },
  { title: "Application Error", body: "Unrecoverable Application Error. Terminating current application." },
  { title: "Insufficient Memory", body: "There is not enough memory to run this application. Quit one or more Windows applications and try again." },
  { title: "Program Manager", body: "Cannot find the file WIN.INI. Check to ensure the path and filename are correct." },
  { title: "System Error", body: "Cannot find a required device driver: VSHARE. Check SYSTEM.INI." },
  { title: "Application Error", body: "FILEMAN caused a General Protection Fault in module FILEMAN.EXE at 0002:0B6E." },
  { title: "Windows", body: "Insufficient system resources exist to complete the API." },
]
const MAX = 14

export default function Win31Screen() {
  const [errors, setErrors] = useState<Err[]>([])
  const id = useRef(0)

  const add = useCallback(() => {
    const e = ERRORS[Math.floor(Math.random() * ERRORS.length)]
    const w = typeof window === "undefined" ? 1024 : window.innerWidth
    const h = typeof window === "undefined" ? 768 : window.innerHeight
    const item: Err = { id: ++id.current, x: 10 + Math.random() * Math.max(10, w - 440), y: 10 + Math.random() * Math.max(10, h - 200), ...e }
    sfx.ding()
    setErrors((prev) => [...prev, item].slice(-MAX))
  }, [])

  useEffect(() => {
    add()
    const t = setInterval(add, 1400)
    return () => clearInterval(t)
  }, [add])

  return (
    <FullscreenPrank secondary="#008080" exitMessage="WINDOWS 3.1 RESTORED - IT WAS A PRANK!" className="cursor-default bg-[#008080] font-win9x">
      {/* Program Manager window */}
      <div className="absolute left-4 top-4 h-[min(420px,70vh)] w-[min(640px,90vw)] border-2 border-black bg-white">
        <div className="flex items-center border-b-2 border-black bg-[#000080] px-1 text-[13px] font-bold text-white">
          <span className="mr-2 border border-white px-1">-</span>Program Manager
        </div>
        <div className="border-b border-black px-2 text-[12px] text-black">File &nbsp; Options &nbsp; Window &nbsp; Help</div>
        <div className="grid grid-cols-4 gap-4 p-4 text-center text-[11px] text-black">
          {["Main", "Accessories", "Games", "StartUp", "Applications", "Windows Applications"].map((n) => (
            <div key={n}><div className="mx-auto mb-1 h-8 w-10 border-2 border-black bg-[#ffff00]" />{n}</div>
          ))}
        </div>
      </div>

      {errors.map((e) => (
        <div key={e.id} className="absolute w-[min(400px,92vw)] border-2 border-black bg-[#c0c0c0] shadow-[3px_3px_0_#000]" style={{ left: e.x, top: e.y, zIndex: e.id }}>
          <div className="border-b-2 border-black bg-white px-2 text-center text-[13px] font-bold text-black">{e.title}</div>
          <div className="flex gap-3 p-4 text-[13px] text-black">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-black bg-white text-[20px] font-bold">!</span>
            <p>{e.body}</p>
          </div>
          <div className="flex justify-center pb-3">
            <button onClick={() => setErrors((p) => p.filter((x) => x.id !== e.id))} className="border-2 border-black bg-white px-8 py-[2px] text-[13px] font-bold text-black">OK</button>
          </div>
        </div>
      ))}
    </FullscreenPrank>
  )
}
