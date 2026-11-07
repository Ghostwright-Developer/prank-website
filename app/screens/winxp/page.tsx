"use client"

import { useEffect, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { Clock } from "@/components/clock"
import { DesktopIcon, XPTaskbar } from "@/components/windows-ui"
import { WinSpinner } from "@/components/prank-kit"

// Windows XP Genuine Advantage failure: black wallpaper, tray balloon, watermark.
export default function WinXPScreen() {
  const [balloon, setBalloon] = useState(false)
  const [dialog, setDialog] = useState(false)
  const [wizard, setWizard] = useState<"closed" | "checking" | "failed">("closed")

  useEffect(() => {
    const a = setTimeout(() => setBalloon(true), 1500)
    const b = setTimeout(() => setDialog(true), 4500)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [])
  useEffect(() => {
    if (wizard !== "checking") return
    const t = setTimeout(() => setWizard("failed"), 4500)
    return () => clearTimeout(t)
  }, [wizard])

  return (
    <FullscreenPrank secondary="#000000" exitMessage="WINDOWS IS GENUINE - IT WAS A PRANK!" className="cursor-default bg-black font-[Tahoma,Verdana,sans-serif]">
      <div className="absolute left-3 top-3 flex flex-col gap-3">
        <DesktopIcon kind="computer" label="My Computer" />
        <DesktopIcon kind="folder" label="My Documents" />
        <DesktopIcon kind="network" label="My Network Places" />
        <DesktopIcon kind="recycle" label="Recycle Bin" />
        <DesktopIcon kind="browser" label="Internet Explorer" />
      </div>

      <div className="absolute bottom-[44px] right-5 text-right text-white [text-shadow:1px_1px_1px_#000]">
        <div className="text-[18px] font-bold leading-tight">Windows XP Professional</div>
        <div className="text-[13px]">This copy of Windows is not genuine</div>
        <div className="text-[12px] text-white/80">Build 2600.xpsp_sp3_gdr.080814-1236</div>
      </div>

      {dialog && (
        <div className="absolute left-1/2 top-[40%] w-[min(470px,94vw)] -translate-x-1/2 -translate-y-1/2 border-[3px] border-[#0054e3] bg-[#ece9d8] shadow-[3px_3px_10px_rgba(0,0,0,.6)]">
          <div className="flex items-center justify-between bg-gradient-to-b from-[#3d95ff] via-[#0058ee] to-[#0045c4] px-2 py-[5px] text-[13px] font-bold text-white">
            <span>Windows Genuine Advantage Notifications</span>
            <button onClick={() => setDialog(false)} className="grid h-[22px] w-[22px] place-items-center rounded-[3px] border border-white bg-gradient-to-b from-[#e8826a] to-[#c8432b] text-[12px]">✕</button>
          </div>
          <div className="flex gap-4 p-4 text-[12px] text-black">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e8b400] text-[26px] font-bold text-white">!</div>
            <div>
              <p className="mb-2 font-bold">This copy of Windows is not genuine</p>
              <p className="mb-2">You may be a victim of software counterfeiting. This copy of Windows failed Windows Genuine Advantage validation. Your desktop background has been changed, and you will see periodic reminders until you obtain a genuine copy of Windows.</p>
              <p>Error code: 0x80070005</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 px-4 pb-4">
            <button onClick={() => { setWizard("checking"); setDialog(false) }} className="min-w-[96px] rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#d6d0c5] px-3 py-1 text-[12px] text-black">Resolve Now</button>
            <button onClick={() => setDialog(false)} className="min-w-[96px] rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#d6d0c5] px-3 py-1 text-[12px] text-black">Resolve Later</button>
          </div>
        </div>
      )}

      {wizard !== "closed" && (
        <div className="absolute left-1/2 top-[42%] w-[min(500px,94vw)] -translate-x-1/2 -translate-y-1/2 border-[3px] border-[#0054e3] bg-[#ece9d8] shadow-[3px_3px_10px_rgba(0,0,0,.6)]">
          <div className="flex items-center justify-between bg-gradient-to-b from-[#3d95ff] via-[#0058ee] to-[#0045c4] px-2 py-[5px] text-[13px] font-bold text-white">
            <span>Get Genuine Windows</span>
            <button onClick={() => setWizard("closed")} className="grid h-[22px] w-[22px] place-items-center rounded-[3px] border border-white bg-gradient-to-b from-[#e8826a] to-[#c8432b] text-[12px]">✕</button>
          </div>
          <div className="p-5 text-[12px] text-black">
            {wizard === "checking" ? (
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-[#2a5fd0] p-2"><WinSpinner size={26} dot={4} /></div>
                <div><p className="font-bold">Validating your copy of Windows...</p><p className="mt-1">Contacting the Microsoft validation server. This may take a few moments.</p></div>
              </div>
            ) : (
              <div>
                <p className="mb-2 font-bold text-[#c40000]">Validation failed</p>
                <p className="mb-3">The product key used to install this copy of Windows has been blocked by Microsoft because it has been used on more computers than the license allows.</p>
                <p className="mb-3">Error code: 0x80070005 &nbsp; (Access denied)</p>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setWizard("checking")} className="min-w-[90px] rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#d6d0c5] px-3 py-1">Try Again</button>
                  <button onClick={() => setWizard("closed")} className="min-w-[90px] rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#d6d0c5] px-3 py-1">Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {balloon && !dialog && wizard === "closed" && (
        <div onClick={() => setDialog(true)} className="absolute bottom-[34px] right-3 w-[250px] cursor-pointer rounded-[6px] border border-black bg-[#ffffe1] p-3 text-[11px] text-black shadow-md">
          <div className="mb-1 flex justify-between font-bold"><span>⚠ This copy of Windows is not genuine</span><span>✕</span></div>
          Click here to resolve this problem.
        </div>
      )}
      <XPTaskbar />
      <Clock className="hidden" />
    </FullscreenPrank>
  )
}
