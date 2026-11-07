"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { sfx } from "@/lib/sfx"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { DesktopIcon, Win10Taskbar, Win10Wallpaper } from "@/components/windows-ui"

interface Msg { title: string; body: string; buttons: string[]; icon: "error" | "warn" | "info" }

const MSGS: Msg[] = [
  { title: "Printer", body: "PC LOAD LETTER", buttons: ["OK"], icon: "error" },
  { title: "HP Smart", body: "Your printer is offline. (Your printer is online. This message is out of date.)", buttons: ["Retry", "Cancel"], icon: "warn" },
  { title: "Printing Preferences", body: "Paper jam in Tray 2. Tray 2 does not exist.", buttons: ["OK"], icon: "error" },
  { title: "HP Smart", body: "Black ink is low. Printing has been disabled until you replace all four cartridges, including the three that are full.", buttons: ["Order ink", "Not now"], icon: "warn" },
  { title: "Print Spooler", body: "Your document was sent to the printer 4 times. It will print once, in 6 days, at the wrong size.", buttons: ["OK"], icon: "info" },
  { title: "Scan to Computer", body: "Scanning is unavailable because the printer is out of cyan.", buttons: ["OK"], icon: "error" },
  { title: "HP Smart", body: "To continue, please create an account. Your printer will stay offline until you enter your date of birth.", buttons: ["Create account", "Cancel"], icon: "info" },
  { title: "PCL XL error", body: "Subsystem: KERNEL\nError: IllegalOperatorSequence\nOperator: Unknown\nPosition: 0", buttons: ["OK"], icon: "error" },
  { title: "Printer Setup", body: "Printer driver unavailable.\nPrinter driver available.\nPrinter driver unavailable.", buttons: ["OK"], icon: "warn" },
  { title: "Printers & scanners", body: "Your printer was moved to the network 'Linksys_Guest_2'. It used to be 'Linksys_Guest'. Please reconnect.", buttons: ["Reconnect"], icon: "warn" },
  { title: "Instant Ink", body: "Your subscription has expired. Your ink is still in the printer. We are keeping it safe for you.", buttons: ["Renew", "Close"], icon: "info" },
  { title: "Unknown device", body: "Unknown device on LPT1. Please do not ask us what.", buttons: ["OK"], icon: "error" },
  { title: "Print Spooler", body: "Cancel print job failed: the job cannot be cancelled while it is printing. The job is not printing.", buttons: ["OK"], icon: "error" },
  { title: "Printer", body: "Please remove the paper jam. There is no paper in the printer.", buttons: ["OK"], icon: "error" },
  { title: "Windows", body: "Printer 'Brother HL-L2350DW (Copy 3)' is now your default printer. It was your default printer before. It is also not connected.", buttons: ["OK"], icon: "info" },
]
const MAX = 6

interface Pop extends Msg { id: number; x: number; y: number }
const iconBadge = { error: ["#e81123", "✕"], warn: ["#f0b400", "!"], info: ["#0078d7", "i"] } as const

export default function PrinterError() {
  const [pops, setPops] = useState<Pop[]>([])
  const id = useRef(0)
  const idx = useRef(0)

  const spawn = useCallback(() => {
    const m = MSGS[idx.current++ % MSGS.length]
    const w = typeof window === "undefined" ? 1280 : window.innerWidth
    const h = typeof window === "undefined" ? 720 : window.innerHeight
    const p: Pop = { ...m, id: ++id.current, x: Math.max(8, w / 2 - 200 + (Math.random() - 0.5) * Math.min(520, w - 420)), y: Math.max(8, h / 2 - 110 + (Math.random() - 0.5) * Math.min(300, h - 300)) }
    sfx.ding()
    setPops((prev) => [...prev, p].slice(-MAX))
  }, [])

  useEffect(() => {
    spawn()
    const t = setInterval(spawn, 3600)
    return () => clearInterval(t)
  }, [spawn])

  const close = (pid: number) => {
    setPops((p) => p.filter((x) => x.id !== pid))
    setTimeout(spawn, 700)
    setTimeout(spawn, 1500)
  }

  return (
    <FullscreenPrank exitMessage="PRINTER FIXED (BRIEFLY) - IT WAS A PRANK!" className="cursor-default bg-black font-segoe">
      <Win10Wallpaper />
      <div className="absolute left-2 top-2 flex flex-col gap-1">
        <DesktopIcon kind="recycle" label="Recycle Bin" />
        <DesktopIcon kind="computer" label="This PC" />
        <DesktopIcon kind="folder" label="Scans" />
        <DesktopIcon kind="doc" label="Quarterly_Report_FINAL_v7.docx" />
      </div>
      {pops.map((p) => (
        <div key={p.id} className="absolute w-[min(400px,94vw)] border border-[#1883d7] bg-white shadow-[0_8px_30px_rgba(0,0,0,.5)]" style={{ left: p.x, top: p.y, zIndex: 10 + p.id }}>
          <div className="flex items-center justify-between bg-white pl-3 text-[12px] text-black">
            <span className="py-[7px]">{p.title}</span>
            <button onClick={() => close(p.id)} className="grid h-[30px] w-[46px] place-items-center text-[14px] hover:bg-[#e81123] hover:text-white">✕</button>
          </div>
          <div className="flex items-start gap-4 px-5 pb-6 pt-4 text-[13px] text-black">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[18px] font-bold text-white" style={{ background: iconBadge[p.icon][0] }}>{iconBadge[p.icon][1]}</span>
            <p className="whitespace-pre-line pt-1">{p.body}</p>
          </div>
          <div className="flex justify-end gap-2 bg-[#f0f0f0] px-4 py-3">
            {p.buttons.map((b, i) => (
              <button key={b} onClick={() => close(p.id)} className={`min-w-[84px] border px-3 py-[3px] text-[12px] text-black hover:border-[#0078d7] hover:bg-[#e5f1fb] ${i === 0 ? "border-[#0078d7] bg-[#e1e1e1]" : "border-[#adadad] bg-[#e1e1e1]"}`}>{b}</button>
            ))}
          </div>
        </div>
      ))}
      <Win10Taskbar tasks={["Printers & scanners"]} />
    </FullscreenPrank>
  )
}
