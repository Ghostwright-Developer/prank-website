"use client"

import { useEffect, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { useBlink } from "@/components/prank-kit"

// Classic "poison" skull, drawn like Petya's boot-screen ASCII art.
const SKULL = String.raw`
                 uuuuuuuuuuuuuuuuuuuu
              uu$$$$$$$$$$$$$$$$$$$$$$uu
           u$$$$$$$$$$$$$$$$$$$$$$$$$$$$$u
         u$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$u
        u$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$u
       u$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$u
       u$$$$$$"   "$$$"   "$$$$$$$$"   "$$$$$$u
        "$$$$"      u$u       $$$$"      "$$$$"
         $$$u       u$u       u$$$       u$$$
         $$$u      u$$$u      u$$$      u$$$
          "$$$$uu$$$   $$$uu$$$$"
           "$$$$$$$"   "$$$$$$$"
             u$$$$$$$u$$$$$$$u
              u$"$"$"$"$"$"$u
   uuu        $$u$ $ $ $ $u$$       uuu
  u$$$$        $$$$$u$u$u$$$       u$$$$
   $$$$$uu      "$$$$$$$$$"     uu$$$$$$
 u$$$$$$$$$$$uu    """""    uuuu$$$$$$$$$$
 $$$$"""$$$$$$$$$$uuu   uu$$$$$$$$$"""$$$"
  """      ""$$$$$$$$$$$uu ""$"""
            uuuu ""$$$$$$$$$$uuu
   u$$$uuu$$$$$$$$$uu ""$$$$$$$$$$$uuu$$$
   $$$$$$$$$$""""           ""$$$$$$$$$$$"
    "$$$$$"                      ""$$$$""
      $$$"                         $$$$"
`

type Phase = "chkdsk" | "skull" | "lock"

const TOTAL_SECTORS = 976_773_168

export default function PetyaScreen() {
  const [phase, setPhase] = useState<Phase>("chkdsk")
  const [sector, setSector] = useState(0)
  const [flash, setFlash] = useState(false)
  const caret = useBlink(500)

  // Phase 1: fake CHKDSK while the "MFT" is being encrypted. Phase 2: skull. Phase 3: lock screen.
  useEffect(() => {
    if (phase !== "chkdsk") return
    const id = setInterval(() => {
      setSector((s) => {
        const next = s + Math.floor(TOTAL_SECTORS * (0.0025 + Math.random() * 0.006))
        return Math.min(next, TOTAL_SECTORS)
      })
    }, 320)
    const toSkull = setTimeout(() => setPhase("skull"), 13000)
    return () => { clearInterval(id); clearTimeout(toSkull) }
  }, [phase])

  useEffect(() => {
    if (phase !== "skull") return
    const flashId = setInterval(() => setFlash((f) => !f), 450)
    const toLock = setTimeout(() => setPhase("lock"), 6500)
    return () => { clearInterval(flashId); clearTimeout(toLock) }
  }, [phase])

  const pct = Math.min(99, Math.floor((sector / TOTAL_SECTORS) * 100))

  return (
    <FullscreenPrank exitMessage="DISK RESTORED - IT WAS A PRANK!" className="cursor-none bg-black font-dos text-[22px] leading-[1.15]">
      {phase === "chkdsk" && (
        <div className="h-full w-full bg-black p-8 text-[#c0c0c0]">
          <p>Repairing file system on C:</p>
          <p className="mt-4">The type of the file system is NTFS.</p>
          <p>One of your disks contains errors and needs to be repaired. This process</p>
          <p>may take several hours to complete. It is strongly recommended to let it</p>
          <p>complete.</p>
          <p className="mt-4">WARNING: DO NOT TURN OFF YOUR PC! IF YOU ABORT THIS PROCESS, YOU COULD</p>
          <p>DESTROY ALL OF YOUR DATA! PLEASE ENSURE THAT YOUR POWER CABLE IS PLUGGED IN!</p>
          <p className="mt-4">
            CHKDSK is repairing sector {sector.toLocaleString("en-US").replace(/,/g, "")} of {TOTAL_SECTORS} ({pct}%){caret ? "_" : " "}
          </p>
        </div>
      )}

      {phase === "skull" && (
        <div className={`flex h-full w-full items-center justify-center ${flash ? "bg-white" : "bg-black"}`}>
          <pre className={`text-[13px] leading-[13px] ${flash ? "text-black" : "text-[#ff1a1a]"}`}>{SKULL}</pre>
        </div>
      )}

      {phase === "lock" && (
        <div className="h-full w-full overflow-hidden bg-black p-8 text-[#ff2a2a]">
          <p className="mb-5 text-[28px] font-bold">You became victim of the PETYA RANSOMWARE!</p>
          <p className="mb-1">The harddisks of your computer have been encrypted with an military grade</p>
          <p className="mb-1">encryption algorithm. There is no way to restore your data without a special</p>
          <p className="mb-1">key. You can purchase this key on the darknet page shown in step 2.</p>
          <p className="mb-5 mt-4">To purchase your key and restore your data, please follow these three easy steps:</p>
          <p className="mb-1">1. Download the Tor Browser at &quot;https://www.torproject.org&quot;. If you need help,</p>
          <p className="mb-4">   please google for &quot;access onion page&quot;.</p>
          <p className="mb-1">2. Visit one of the following pages with the Tor Browser:</p>
          <p className="mb-1">   http://petya37h5tbhyvki.onion/LqPmoG</p>
          <p className="mb-4">   http://petya5koahtsf7sv.onion/LqPmoG</p>
          <p className="mb-1">3. Enter your personal decryption code there:</p>
          <p className="mb-1 break-all text-[#ff6a6a]">
            QWmz4T-Pq9eXf-3JdRvA-nK7uYc-H2sL8b-Zx5gFt-oM1wEi-Ur6CyN-9hVaD3-kSjP0q
          </p>
          <p className="mb-4 break-all text-[#ff6a6a]">vB4nXe-L8yTcR-5fGhJm-2WzQsA-D7pKuE-1oIbN6-xM3rZt</p>
          <p className="mt-6">If you already purchased your key, please enter it below.</p>
          <p className="mt-2">Key: {caret ? "█" : " "}</p>
        </div>
      )}
    </FullscreenPrank>
  )
}
