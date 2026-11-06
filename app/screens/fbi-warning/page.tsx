"use client"

import { useEffect, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { formatDuration, useCountdown } from "@/components/prank-kit"

// Recreation of the "FBI Anti-Piracy Warning" lock screen (Reveton / FBI MoneyPak family, 2012-2013).
export default function FbiWarningScreen() {
  const left = useCountdown(48 * 3600 - 7)
  const [ip, setIp] = useState("")
  useEffect(() => {
    const o = () => Math.floor(Math.random() * 223) + 1
    setIp(`${o()}.${o()}.${o()}.${o()}`)
  }, [])

  return (
    <FullscreenPrank exitMessage="COMPUTER UNLOCKED - IT WAS A PRANK!" className="cursor-default bg-white font-segoe">
      <div className="flex h-full w-full flex-col overflow-auto bg-[#eef1f6] text-[#111]">
        {/* Header */}
        <div className="flex items-center justify-center gap-5 bg-[#0d2347] px-6 py-4 text-white">
          <svg width="64" height="72" viewBox="0 0 64 72" aria-hidden="true">
            <path d="M32 2 4 12v22c0 18 12 31 28 36 16-5 28-18 28-36V12z" fill="#f2c94c" stroke="#fff" strokeWidth="2" />
            <path d="M32 9 11 17v17c0 14 9 24 21 28 12-4 21-14 21-28V17z" fill="#0d2347" />
            <text x="32" y="42" textAnchor="middle" fontSize="19" fontWeight="700" fill="#f2c94c" fontFamily="Georgia, serif">FBI</text>
          </svg>
          <div className="text-center">
            <div className="text-[13px] tracking-[0.2em] text-[#f2c94c]">FEDERAL BUREAU OF INVESTIGATION</div>
            <h1 className="text-[30px] font-bold leading-tight">FBI Anti-Piracy Warning</h1>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-6 p-6 md:grid-cols-[1fr_320px]">
          <div>
            <h2 className="mb-4 border-l-8 border-[#c40000] bg-white py-2 pl-4 text-[26px] font-bold text-[#c40000] shadow-sm">
              ATTENTION! Your Computer has been locked!
            </h2>

            <div className="bg-white p-5 text-[16px] leading-relaxed shadow-sm">
              <p className="mb-3 font-semibold">All activity of this computer has been recorded.</p>
              <p className="mb-3">
                If you use a webcam, videos and pictures were saved for future identifications. Illegal downloaded
                material (MP3&apos;s, Movies or Software) has been located on your computer.
              </p>
              <p className="mb-3">
                Your computer has been locked for violation of Federal Law. The use of unlicensed software and the
                distribution of copyrighted content are punishable under <b>Title 17, United States Code, Section 506</b>{" "}
                and <b>Title 18, Section 2319</b>.
              </p>
              <p className="mb-3 font-semibold text-[#c40000]">
                Failure to comply with FBI Anti-Piracy warnings could result in criminal charges and possible
                imprisonment up to 3 years.
              </p>
              <h3 className="mb-2 mt-5 text-[20px] font-bold">Unlock your computer:</h3>
              <p className="mb-3">
                To unlock your computer you are obligated to pay a fine of <b>$200</b> using a Green Dot MoneyPak
                voucher. After the payment is received, your computer will be unlocked within 24 hours.
              </p>
              <ol className="ml-5 list-decimal space-y-1 text-[15px]">
                <li>Purchase a Green Dot MoneyPak at any participating retail location.</li>
                <li>Enter the 14-digit MoneyPak code in the payment field.</li>
                <li>Wait for confirmation. Do not restart or shut down your computer.</li>
              </ol>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-[#0d2347] p-4 text-center text-white shadow">
              <div className="text-[13px] tracking-widest text-[#f2c94c]">TIME REMAINING</div>
              <div className="font-term text-[40px] font-bold tabular-nums">{formatDuration(left)}</div>
              <div className="text-[12px] text-white/70">Legal action will follow after the deadline</div>
            </div>

            <div className="bg-white p-4 shadow">
              <div className="mb-2 flex aspect-video items-center justify-center bg-black text-center">
                <div>
                  <div className="mx-auto mb-1 h-3 w-3 animate-pulse rounded-full bg-red-600" />
                  <div className="font-term text-[12px] text-red-500">WEBCAM RECORDING</div>
                </div>
              </div>
              <div className="font-term text-[13px] leading-tight">
                <div>Your IP: <b>{ip || "..."}</b></div>
                <div>Status: <b className="text-[#c40000]">LOCKED</b></div>
              </div>
            </div>

            <div className="bg-white p-4 text-center shadow">
              <div className="mx-auto mb-2 inline-block rounded bg-[#2e8b2e] px-5 py-2 text-[18px] font-bold text-white">MoneyPak</div>
              <div className="text-[12px] text-gray-600">Green Dot MoneyPak accepted</div>
            </div>
          </aside>
        </div>
      </div>
    </FullscreenPrank>
  )
}
