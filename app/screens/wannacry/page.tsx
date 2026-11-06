"use client"

import { useEffect, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { Clock } from "@/components/clock"
import { formatDuration, useCountdown } from "@/components/prank-kit"

// Fabricated address in valid Bitcoin format: nothing here can receive funds.
const BTC_ADDRESS = "15zLQ8nqFeWwQ5pR3sKuV4yDmoX7TgJHcb"
const DAY = 86400

const fmtDate = (d: Date) =>
  `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`

export default function WannaCryScreen() {
  // Wana Decrypt0r 2.0 showed two timers: the price doubles after 3 days, files are lost after 7.
  const raise = useCountdown(3 * DAY - 14)
  const lost = useCountdown(7 * DAY - 14)
  const [dates, setDates] = useState<{ raise: string; lost: string } | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const now = Date.now()
    setDates({ raise: fmtDate(new Date(now + 3 * DAY * 1000)), lost: fmtDate(new Date(now + 7 * DAY * 1000)) })
  }, [])

  return (
    <FullscreenPrank exitMessage="FILES RESTORED - IT WAS A PRANK!" className="cursor-default bg-[#1a0505] font-win9x">
      {/* Desktop wallpaper (@WanaDecryptor@.bmp) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a0808] via-[#160303] to-black">
        <div className="absolute left-6 top-6 max-w-[520px] text-[15px] leading-snug text-[#ff4d4d]">
          <p className="mb-3 text-[20px] font-bold">Ooops, your important files are encrypted.</p>
          <p className="mb-3">
            If you see this text, but don&apos;t see the &quot;Wana Decrypt0r&quot; window, then your antivirus removed
            the decrypt software or you deleted it from your computer.
          </p>
          <p className="mb-3">If you need your files you have to run the decrypt software.</p>
          <p className="mb-3">
            Please find an application file named &quot;@WanaDecryptor@.exe&quot; in any folder or restore from the
            antivirus quarantine.
          </p>
          <p>Run and follow the instructions!</p>
        </div>
      </div>

      {/* Wana Decrypt0r 2.0 window */}
      <div className="absolute left-1/2 top-[46%] w-[min(900px,96vw)] -translate-x-1/2 -translate-y-1/2 border border-black bg-[#c9c9c9] shadow-[0_0_40px_rgba(0,0,0,.8)]">
        <div className="flex items-center justify-between bg-gradient-to-b from-[#6a92c4] to-[#3f6fae] px-2 py-1 text-[13px] text-white">
          <span>Wana Decrypt0r 2.0</span>
          <span className="flex gap-1">
            <i className="inline-block h-4 w-6 rounded-sm bg-white/25" />
            <i className="inline-block h-4 w-6 rounded-sm bg-white/25" />
            <i className="inline-block h-4 w-8 rounded-sm bg-[#c9473a]" />
          </span>
        </div>

        <div className="grid grid-cols-[270px_1fr] gap-0 bg-[#7d0f0f] p-3 text-white">
          {/* Left panel */}
          <div className="pr-3">
            <div className="mb-3 flex justify-center">
              <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="56" fill="#b81c1c" stroke="#f5d142" strokeWidth="3" />
                <rect x="36" y="54" width="48" height="38" rx="4" fill="#f5d142" />
                <path d="M44 54V44a16 16 0 0 1 32 0v10" fill="none" stroke="#f5d142" strokeWidth="8" />
                <circle cx="60" cy="72" r="5" fill="#7d0f0f" />
              </svg>
            </div>

            <div className="mb-3 border border-[#d9b13a] bg-[#5f0a0a] p-2 text-center">
              <div className="text-[13px] font-bold text-[#f5d142]">Payment will be raised on</div>
              <div className="text-[15px] font-bold">{dates?.raise ?? " "}</div>
              <div className="mt-1 text-[12px] text-[#f5d142]">Time Left</div>
              <div className="text-[26px] font-bold tabular-nums leading-tight">{formatDuration(raise, true)}</div>
              <div className="mt-1 h-2 bg-black/50"><div className="h-full bg-[#e8a020]" style={{ width: `${Math.max(2, (raise / (3 * DAY)) * 100)}%` }} /></div>
            </div>

            <div className="mb-3 border border-[#d9b13a] bg-[#5f0a0a] p-2 text-center">
              <div className="text-[13px] font-bold text-[#f5d142]">Your files will be lost on</div>
              <div className="text-[15px] font-bold">{dates?.lost ?? " "}</div>
              <div className="mt-1 text-[12px] text-[#f5d142]">Time Left</div>
              <div className="text-[26px] font-bold tabular-nums leading-tight">{formatDuration(lost, true)}</div>
              <div className="mt-1 h-2 bg-black/50"><div className="h-full bg-[#e8a020]" style={{ width: `${Math.max(2, (lost / (7 * DAY)) * 100)}%` }} /></div>
            </div>

            <ul className="space-y-1 pl-1 text-[13px] text-[#f5d142] underline">
              <li>About bitcoin</li>
              <li>How to buy bitcoins?</li>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* Right panel */}
          <div className="flex min-h-0 flex-col">
            <div className="mb-2 flex items-center justify-between">
              <h1 className="text-[20px] font-bold text-white">Ooops, your files have been encrypted!</h1>
              <span className="border border-[#808080] bg-white px-2 py-0.5 text-[12px] text-black">English ▾</span>
            </div>

            <div className="h-[300px] overflow-hidden border border-[#808080] bg-white p-3 text-[12.5px] leading-snug text-black">
              <p className="mb-2 text-[14px] font-bold">What Happened to My Computer?</p>
              <p className="mb-2">
                Your important files are encrypted. Many of your documents, photos, videos, databases and other files
                are no longer accessible because they have been encrypted. Maybe you are busy looking for a way to
                recover your files, but do not waste your time. Nobody can recover your files without our decryption
                service.
              </p>
              <p className="mb-1 text-[14px] font-bold">Can I Recover My Files?</p>
              <p className="mb-2">
                Sure. We guarantee that you can recover all your files safely and easily. But you have not so enough
                time. You can decrypt some of your files for free. Try now by clicking &lt;Decrypt&gt;. But if you want
                to decrypt all your files, you need to pay. You only have 3 days to submit the payment. After that the
                price will be doubled. Also, if you don&apos;t pay in 7 days, you won&apos;t be able to recover your
                files forever. We will have free events for users who are so poor that they couldn&apos;t pay in 6
                months.
              </p>
              <p className="mb-1 text-[14px] font-bold">How Do I Pay?</p>
              <p>
                Payment is accepted in Bitcoin only. For more information, click &lt;About bitcoin&gt;. Please check
                the current price of Bitcoin and buy some bitcoins. For more information, click &lt;How to buy
                bitcoins&gt;. And send the correct amount to the address specified in this window. After your payment,
                click &lt;Check Payment&gt;. Best time to check: 9:00am - 11:00am GMT from Monday to Friday.
              </p>
            </div>

            <div className="mt-3 flex items-center gap-3 border border-[#d9b13a] bg-[#5f0a0a] p-2">
              <div className="flex shrink-0 items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f7931a] text-[22px] font-bold text-white">₿</span>
                <span className="text-[11px] font-bold leading-tight text-white">bitcoin<br /><span className="text-[9px] font-normal">ACCEPTED HERE</span></span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-bold text-white">Send $300 worth of bitcoin to this address:</div>
                <div className="mt-1 flex gap-2">
                  <div className="min-w-0 flex-1 truncate border border-[#808080] bg-white px-2 py-1 font-term text-[13px] text-black">{BTC_ADDRESS}</div>
                  <button
                    onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500) }}
                    className="border-2 border-white border-b-[#555] border-r-[#555] bg-[#c9c9c9] px-3 text-[12px] text-black"
                  >{copied ? "Copied" : "Copy"}</button>
                </div>
              </div>
            </div>

            <div className="mt-3 flex justify-end gap-3">
              <button className="w-36 border-2 border-white border-b-[#555] border-r-[#555] bg-[#c9c9c9] py-1.5 text-[13px] text-black">Check Payment</button>
              <button className="w-36 border-2 border-white border-b-[#555] border-r-[#555] bg-[#c9c9c9] py-1.5 text-[13px] text-black">Decrypt</button>
            </div>
          </div>
        </div>
      </div>

      {/* Taskbar */}
      <div className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-between bg-gradient-to-b from-[#3a5f8f] to-[#1b3556] px-2 text-[12px] text-white">
        <span className="rounded bg-[#2f7d32] px-3 py-1 font-bold">Start</span>
        <span className="rounded border border-white/30 bg-white/10 px-3 py-1">Wana Decrypt0r 2.0</span>
        <Clock className="tabular-nums" />
      </div>
    </FullscreenPrank>
  )
}
