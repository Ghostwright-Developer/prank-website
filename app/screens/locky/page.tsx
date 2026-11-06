"use client"

import { useEffect, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { Clock } from "@/components/clock"
import { useRevealedLines } from "@/components/prank-kit"

const VICTIM_ID = "F61242A1A24B711E"

// Locky renamed every file to <16-char ID><16 hex chars>.locky
const ENCRYPTED = [
  "A65091F1B14A911F0DD0E81ED3029F08.locky",
  "A65091F1B14A911F3C77B2E90D4F1A6B.locky",
  "A65091F1B14A911F98E4D05C7712BB3A.locky",
  "A65091F1B14A911F5D2C8B16E0A9F471.locky",
  "A65091F1B14A911F0B6E3F7A42D8C915.locky",
  "A65091F1B14A911FE19A7C3D58B40F26.locky",
  "A65091F1B14A911F72D0A94B6C15E3F8.locky",
  "A65091F1B14A911F4F8B2D19A760C3E5.locky",
]

const NOTE = `!!! IMPORTANT INFORMATION !!!!

All of your files are encrypted with RSA-2048 and AES-128 ciphers.
More information about the RSA and AES can be found here:
http://en.wikipedia.org/wiki/RSA_(cryptosystem)
http://en.wikipedia.org/wiki/Advanced_Encryption_Standard

Decrypting of your files is only possible with the private key and decrypt program, which is on our secret server.
To receive your private key follow one of the links:

1. http://6dtxgqam4crv6rr6.onion/${VICTIM_ID}
2. http://ssfs4k5b3btpsqwf.onion/${VICTIM_ID}
3. http://xdev33gwfbxfwkvs.onion/${VICTIM_ID}

If all of this addresses are not available, follow these steps:
1. Download and install Tor Browser: https://www.torproject.org/download/download-easy.html
2. After a successful installation, run the browser and wait for initialization.
3. Type in the address bar: 6dtxgqam4crv6rr6.onion/${VICTIM_ID}
4. Follow the instructions on the site.

!!! IMPORTANT INFORMATION !!!!

Your personal identification ID: ${VICTIM_ID}
`

export default function LockyScreen() {
  const [noteOpen, setNoteOpen] = useState(false)
  const { visible } = useRevealedLines(ENCRYPTED, 450, { startAfter: 600 })

  // The wallpaper appears first, then the note pops open, like the real infection.
  useEffect(() => {
    const t = setTimeout(() => setNoteOpen(true), 4200)
    return () => clearTimeout(t)
  }, [])

  return (
    <FullscreenPrank exitMessage="FILES SAVED - IT WAS A PRANK!" className="cursor-default bg-[#0b2a4a] font-segoe">
      {/* Wallpaper (_Locky_recover_instructions.bmp) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0e3a63] via-[#0a2748] to-[#07182e]">
        <div className="absolute right-10 top-16 max-w-[520px] text-right text-[17px] font-semibold leading-snug text-white drop-shadow">
          <p className="text-[22px]">!!! IMPORTANT INFORMATION !!!</p>
          <p className="mt-2">All of your files are encrypted with RSA-2048 and AES-128 ciphers.</p>
          <p>Follow the instructions in _Locky_recover_instructions.txt</p>
          <p className="mt-2 text-[14px] font-normal text-white/80">Your personal identification ID: {VICTIM_ID}</p>
        </div>
      </div>

      {/* Desktop icons */}
      <div className="absolute left-3 top-3 flex w-[110px] flex-col gap-3">
        {[["Recycle Bin", "🗑"], ["Computer", "🖥"]].map(([n, i]) => (
          <div key={n} className="text-center text-[11px] text-white drop-shadow">
            <div className="text-[34px] leading-none">{i}</div>{n}
          </div>
        ))}
        <div className="text-center text-[11px] text-white drop-shadow">
          <div className="mx-auto mb-1 h-9 w-7 border border-gray-400 bg-white" />_Locky_recover_instructions.txt
        </div>
        {visible.slice(0, 4).map((f) => (
          <div key={f} className="text-center text-[10px] leading-tight text-white drop-shadow">
            <div className="mx-auto mb-1 h-9 w-7 border border-gray-500 bg-gray-300" />
            <span className="break-all">{f}</span>
          </div>
        ))}
      </div>
      <div className="absolute left-[130px] top-3 flex w-[110px] flex-col gap-3">
        {visible.slice(4).map((f) => (
          <div key={f} className="text-center text-[10px] leading-tight text-white drop-shadow">
            <div className="mx-auto mb-1 h-9 w-7 border border-gray-500 bg-gray-300" />
            <span className="break-all">{f}</span>
          </div>
        ))}
      </div>

      {/* Notepad with the ransom note */}
      {noteOpen && (
        <div className="absolute left-1/2 top-[48%] h-[min(560px,80vh)] w-[min(860px,94vw)] -translate-x-1/2 -translate-y-1/2 border border-[#4a6fa5] bg-white shadow-[0_8px_40px_rgba(0,0,0,.6)]">
          <div className="flex items-center justify-between bg-gradient-to-b from-[#dbe7f5] to-[#bcd1ea] px-2 py-1 text-[12px] text-black">
            <span>_Locky_recover_instructions.txt - Notepad</span>
            <span className="flex gap-1"><i className="h-4 w-6 bg-white/70" /><i className="h-4 w-6 bg-white/70" /><i className="h-4 w-8 bg-[#c9473a]" /></span>
          </div>
          <div className="flex gap-4 border-b border-gray-300 bg-[#f0f0f0] px-2 py-0.5 text-[12px] text-black"><span>File</span><span>Edit</span><span>Format</span><span>View</span><span>Help</span></div>
          <pre className="h-[calc(100%-52px)] overflow-hidden whitespace-pre-wrap p-2 font-term text-[13px] leading-[1.35] text-black">{NOTE}</pre>
        </div>
      )}

      {/* Taskbar */}
      <div className="absolute inset-x-0 bottom-0 flex h-10 items-center gap-2 bg-[#0c1c33]/95 px-2 text-[12px] text-white">
        <span className="grid h-8 w-10 place-items-center bg-[#1e5aa8] text-[16px]">⊞</span>
        {noteOpen && <span className="border-b-2 border-[#76b9ed] bg-white/10 px-3 py-1.5">_Locky_recover_instructions.txt</span>}
        <span className="ml-auto"><Clock className="tabular-nums" /></span>
      </div>
    </FullscreenPrank>
  )
}
