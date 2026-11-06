"use client"

import { useEffect, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { Clock } from "@/components/clock"
import { formatDuration, useCountdown } from "@/components/prank-kit"

const HOURS_96 = 96 * 3600

const fmt = (d: Date) => {
  const h = d.getHours() % 12 || 12
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${h}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() >= 12 ? "PM" : "AM"}`
}

export default function CryptoLockerScreen() {
  const left = useCountdown(HOURS_96 - 3)
  const [deadline, setDeadline] = useState("")
  useEffect(() => setDeadline(fmt(new Date(Date.now() + HOURS_96 * 1000))), [])

  return (
    <FullscreenPrank exitMessage="PRIVATE KEY RESTORED - IT WAS A PRANK!" className="cursor-default bg-[#3a6ea5] font-win9x">
      {/* Windows 7 style desktop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#4f8fd0,#1d4c86_55%,#0c2a52)]" />

      <div className="absolute left-1/2 top-[47%] w-[min(780px,95vw)] -translate-x-1/2 -translate-y-1/2 border border-[#1b2a44] bg-[#cfdceb] p-[6px] shadow-[0_10px_50px_rgba(0,0,0,.6)]">
        <div className="mb-[6px] flex items-center justify-between px-1 text-[13px] text-black">
          <span className="font-semibold">CryptoLocker</span>
          <span className="flex gap-[3px]"><i className="h-[18px] w-7 rounded-sm bg-white/60" /><i className="h-[18px] w-7 rounded-sm bg-white/60" /><i className="h-[18px] w-11 rounded-sm bg-[#c9473a]" /></span>
        </div>

        <div className="bg-white">
          {/* Red countdown band */}
          <div className="flex items-center justify-between bg-[#c40000] px-5 py-3 text-white">
            <div>
              <div className="text-[13px]">Private key will be destroyed on</div>
              <div className="text-[24px] font-bold leading-tight">{deadline || " "}</div>
            </div>
            <div className="text-right">
              <div className="text-[13px]">Time left</div>
              <div className="text-[34px] font-bold tabular-nums leading-tight">{formatDuration(left)}</div>
            </div>
          </div>

          <div className="px-6 py-5 text-[14px] leading-snug text-black">
            <h1 className="mb-3 text-[22px] font-bold text-[#c40000]">Your personal files are encrypted!</h1>
            <p className="mb-3">
              Your important files <b>encryption</b> produced on this computer: photos, videos, documents, etc.{" "}
              <span className="text-[#0645ad] underline">Here</span> is a complete list of encrypted files, and you can
              personally verify this.
            </p>
            <p className="mb-3">
              Encryption was produced using a <b>unique</b> public key RSA-2048 generated for this computer. To decrypt
              files you need to obtain the <b>private key</b>.
            </p>
            <p className="mb-3">
              The <b>single copy</b> of the private key, which will allow you to decrypt the files, is located on a
              secret server on the Internet; the <b>server will destroy the key after a time specified in this
              window</b>. After that, <b>nobody and never will be able</b> to restore files.
            </p>
            <p className="mb-3">
              To obtain the private key for this computer, which will automatically decrypt files, you need to pay{" "}
              <b>300 USD / 300 EUR</b> / similar amount in another currency.
            </p>
            <p className="mb-4">Click «<b>Next</b>» to select the method of payment and the currency.</p>
            <p className="text-[13px] text-[#c40000]">
              Any attempt to remove or damage this software will lead to the immediate destruction of the private key
              by server.
            </p>
          </div>

          <div className="flex justify-end border-t border-gray-300 bg-[#f0f0f0] px-4 py-2">
            <button className="rounded-sm border border-[#707070] bg-gradient-to-b from-[#f2f2f2] to-[#cfcfcf] px-8 py-1 text-[13px] text-black">Next &gt;&gt;</button>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex h-10 items-center gap-2 bg-gradient-to-b from-[#6e93c1]/90 to-[#254a7c]/95 px-2 text-[12px] text-white">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1e5aa8] text-[16px]">⊞</span>
        <span className="rounded border border-white/40 bg-white/20 px-3 py-1.5">CryptoLocker</span>
        <span className="ml-auto"><Clock className="tabular-nums" /></span>
      </div>
    </FullscreenPrank>
  )
}
