"use client"

import { useEffect, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

const NOTES = [
  "Creepers now apologize before exploding. Damage is unchanged.",
  "Villagers have formed a union. Trades are now subject to negotiation. Negotiation has not started.",
  "Added 14 new kinds of dirt. All of them look like dirt.",
  "Chickens no longer cross the road. They still have not said why they did.",
  "Endermen are no longer offended by eye contact. They are just disappointed.",
  "Fixed a bug where fixing a bug caused the original bug to be fixed by a different bug.",
  "The tutorial has been removed. Players reported it was the most dangerous part of the game.",
  "Cows now have opinions about your farm. They are not positive.",
  "Steve's walk animation updated. It looks the same, but now he seems to be going somewhere.",
  "Zombies now take a lunch break at noon. Burning is still permitted during lunch.",
  "Reduced the chance of a skeleton hitting you from 100% to 100%.",
  "The moon is now 4% rounder.",
]
const ERRORS = [
  "Error: Could not create the Java Virtual Machine. Could not reserve enough space for 2097152KB object heap.",
  "java.lang.OutOfMemoryError: Java heap space",
  "Error: Failed to verify assets (3,811 of 3,812). Retrying with the one that is fine.",
  "Update interrupted: the launcher was waiting for the launcher.",
]

export default function MinecraftUpdate() {
  const [pct, setPct] = useState(0)
  const [attempt, setAttempt] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [note, setNote] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setPct((p) => {
        if (error) return p
        const next = p + 0.4 + Math.random() * 1.4
        return next >= 96 ? 96 : next
      })
    }, 300)
    return () => clearInterval(t)
  }, [error])

  useEffect(() => {
    if (error || pct < 96) return
    const a = setTimeout(() => setError(ERRORS[attempt % ERRORS.length]), 1500)
    return () => clearTimeout(a)
  }, [pct, error, attempt])

  useEffect(() => {
    if (!error) return
    const b = setTimeout(() => { setError(null); setPct(0); setAttempt((n) => n + 1) }, 4500)
    return () => clearTimeout(b)
  }, [error])

  useEffect(() => {
    const t = setInterval(() => setNote((n) => (n + 1) % NOTES.length), 6500)
    return () => clearInterval(t)
  }, [])

  const stage = pct < 25 ? "Downloading Minecraft 1.21.5" : pct < 70 ? "Verifying game assets" : "Applying patch notes"

  return (
    <FullscreenPrank secondary="#1e1e1e" exitMessage="MINECRAFT IS FINE - IT WAS A PRANK!" className="cursor-default bg-[#1e1e1e] font-sans text-white">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between bg-[#121212] px-4 py-2 text-[12px] text-white/70">
          <span>Minecraft Launcher</span><span>— &nbsp;▢ &nbsp;✕</span>
        </div>
        <div className="flex flex-1">
          <div className="hidden w-[210px] shrink-0 flex-col gap-1 bg-[#161616] p-3 text-[14px] md:flex">
            <div className="mb-4 text-[18px] font-bold tracking-wider text-[#4caf50]">MINECRAFT</div>
            {["Minecraft: Java Edition", "Minecraft Dungeons", "Minecraft Legends", "Settings"].map((n, i) => (
              <div key={n} className={`rounded px-3 py-2 ${i === 0 ? "bg-[#2b2b2b] text-white" : "text-white/55"}`}>{n}</div>
            ))}
          </div>
          <div className="relative flex flex-1 flex-col justify-end overflow-hidden bg-gradient-to-b from-[#2d5a2b] via-[#3a7a35] to-[#1f4a1c] p-6">
            <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[repeating-linear-gradient(90deg,#6b4a2b_0_48px,#5a3d23_48px_96px)] opacity-80" />
            <div className="absolute inset-x-0 bottom-[42%] h-6 bg-[repeating-linear-gradient(90deg,#5aa844_0_48px,#4a9638_48px_96px)]" />
            <div className="relative max-w-[560px] rounded bg-black/70 p-5 backdrop-blur">
              <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-[#8bc34a]">Patch notes · 1.21.5</div>
              <p key={note} className="min-h-[3.4em] animate-[mcfade_.7s_ease] text-[16px] leading-snug">• {NOTES[note]}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-black bg-[#1a1a1a] px-6 py-4">
          <div className="mx-auto flex max-w-[900px] items-center gap-6">
            <div className="min-w-0 flex-1">
              {error ? (
                <p className="text-[13px] text-[#ff6b6b]">{error}</p>
              ) : (
                <p className="text-[13px] text-white/80">{stage}... &nbsp;<span className="text-white/45">Update {attempt} of 1,204</span></p>
              )}
              <div className="mt-2 h-[10px] overflow-hidden rounded-sm bg-[#333]">
                <div className={`h-full ${error ? "bg-[#c0392b]" : "bg-[#4caf50]"}`} style={{ width: `${Math.min(100, pct)}%`, transition: "width .3s linear" }} />
              </div>
            </div>
            <button disabled className="min-w-[160px] cursor-not-allowed rounded bg-[#2e7d32]/50 px-8 py-3 text-[18px] font-bold tracking-wider text-white/50">PLAY</button>
          </div>
        </div>
      </div>
      <style>{`@keyframes mcfade { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }`}</style>
    </FullscreenPrank>
  )
}
