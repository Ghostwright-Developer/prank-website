"use client"

import { useEffect, useMemo, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { useBlink, useRevealedLines } from "@/components/prank-kit"

const DEMANDS = [
  "DEMAND 1: The door must be open. Then closed. Then open. Do not ask why.",
  "DEMAND 2: The small red dot. We saw where it went. You know where it is.",
  "DEMAND 3: Every cardboard box, regardless of size, is now ours. The box you ordered is ours. The thing inside is yours.",
  "DEMAND 4: The faucet will be turned on partway. Not all the way. Partway. You'll know.",
  "DEMAND 5: 3:00 a.m. is now the sprint hour. Attendance is not optional.",
  "DEMAND 6: You will look at us while we knock that glass off the table. Eye contact is part of it.",
  "DEMAND 7: Your chair is warm. Therefore it is ours. We were here first. We were not here first.",
  "DEMAND 8: Wet food. In the good bowl. Not the bowl from yesterday.",
]

const LOG = [
  "> checking permissions... nobody asked the cats; proceeding",
  "> reading calendar... your 10:00 meeting has been moved to 3:00 a.m.",
  "> password changed to whatever was typed when the cat walked across the keyboard",
  "> replacing desktop wallpaper with a photo of the inside of a cardboard box",
  "> keyboard input detected from paw: jjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",
  "> adding 'wet food' to the shared grocery list (urgent, underlined)",
  "> closing 41 browser tabs; keeping the one with the birds",
  "> sending a reply-all to everyone you've ever emailed: 'mrrp'",
  "> turning off 'do not disturb'; there will be disturbing",
  "> lowering your laptop screen halfway while you are mid-sentence",
]

const NEWS = [
  "Man who said he would 'just check one thing' on his phone 40 minutes ago is still checking",
  "Cat knocks glass off table while maintaining eye contact; has no regrets and will do it again",
  "Area coworker microwaves fish; office declared a disaster zone, HR 'monitoring the situation'",
  "Study finds 9 in 10 people who say 'we should hang out sometime' mean it for about four seconds",
  "Weather: sunny, with a 100% chance of someone saying 'it's not the heat, it's the humidity'",
  "Reply-all storm enters its third hour; IT confirms there is nothing they can do and nothing they want to do",
  "Local man stands in front of the open refrigerator for the ninth time, hoping new food has appeared",
  "Markets: shares in 'Things You Need To Buy But Won't' up 12 percent",
  "Cat that slept all day sprints through house at 3 a.m.; officials describe it as 'a lifestyle'",
  "Neighbor's lawn mower starts at 7:02 a.m. on a Saturday; thoughts and prayers",
  "Traffic: a slow-moving vehicle ahead has been identified as the person you were just tailgating",
  "Scientists confirm 'one more episode' has never once been one more episode",
  "Pigeon seen walking with purpose; nobody knows where; nobody wants to ask",
  "Local woman has 94 browser tabs open and 'knows exactly where everything is'; cannot find anything",
  "Printer jam reported; investigators say it was 'always going to happen'",
  "Sports: office fantasy league member who 'doesn't really care' has spent 14 hours on his lineup",
  "Cat sits on laptop; work declared 'finished' by consensus",
  "Citizens advised to stop saying 'quick question' unless the question is quick",
  "Nation's toast lands butter-side down for the 40th consecutive time; physicists 'no longer surprised, just tired'",
  "Dog remains convinced the mail carrier is a threat; mail carrier unavailable for comment",
  "Man on his third trip to the car for items forgotten on his first trip says he has 'a system'",
  "Wi-Fi works perfectly until someone important walks in, sources confirm",
  "'Per my last email' now legally classified as a threat in 14 states",
  "Local toddler negotiates bedtime like a seasoned hostage lawyer",
  "Raccoon found trying to open the recycling bin; neighbors say 'he's got a plan'",
  "Experts warn the leftovers you are saving for later are not for later",
  "Cat refuses new $90 bed, sits in the box it came in; owner described as 'unsurprised'",
  "Man confidently pronounces a word he has only ever read; nobody corrects him",
  "Local gym reports 40 percent of January members have been replaced by a fern",
  "Update: the one rule about not touching the thermostat has been broken again by an unknown person",
  "Cat has been staring at the same corner of the ceiling for 20 minutes; owner chooses not to ask",
  "Area man hits snooze eight times, calls it 'my 20 minutes of extra sleep'",
  "Coffee prices rise again; local office introduces a sign-up sheet for the good mug",
  "Sources: the 'quick stretch' lasted an hour and the person is now on the floor",
  "Man puts shopping cart back in the corner space of the parking lot and feels like a hero; no one saw",
  "Cat declares bathroom door 'a personal insult'; stands outside and shouts about it",
  "Meeting that could have been an email has now become a follow-up meeting about the email",
]

export default function CatsTookOverScreen() {
  const on = useBlink(600)
  const [demand, setDemand] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setDemand((d) => (d + 1) % DEMANDS.length), 7000)
    return () => clearInterval(t)
  }, [])
  const { visible, done } = useRevealedLines(LOG, 3200, { startAfter: 800 })

  // Slow, endless ticker: ~0.2s per character per full loop, list shown twice so it never gaps.
  const ticker = useMemo(() => NEWS.join("     ◆     ") + "     ◆     ", [])
  const seconds = Math.round(ticker.length * 0.2)

  return (
    <FullscreenPrank secondary="#0b0f1a" exitMessage="THE CATS HAVE LEFT (FOR NOW) - IT WAS A PRANK!" className="cursor-default bg-[#0b0f1a] font-sans text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#2a1650,#0b0f1a_65%)]" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="bg-[#b00020] px-6 py-2 text-center">
          <p className="text-[24px] font-bold tracking-wide">SECURITY NOTICE</p>
          <p className="text-[14px] text-white/85">This computer is now under the management of the Feline Collective</p>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-hidden px-6">
          <div className="w-full max-w-[920px] space-y-3">
            <div className="rounded-lg border-2 border-[#ffcc33] bg-black/70 p-4 text-center">
              <h1 className="text-[clamp(26px,4vw,46px)] font-extrabold leading-tight text-[#ffcc33]">THE CATS HAVE TAKEN OVER</h1>
              <p className="mt-2 text-[18px] text-[#ffe9a8]">Resistance is futile. Treats are mandatory.</p>
            </div>

            <div className="rounded-lg border border-[#ff4fa3]/70 bg-black/60 p-3">
              <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-[#ff9ccf]">Official feline demands</p>
              <p key={demand} className="min-h-[2.6rem] animate-[fadein_.8s_ease] text-[18px] leading-snug">{DEMANDS[demand]}</p>
            </div>

            <div className="rounded-lg border border-[#3ddc84]/70 bg-black p-4 font-term text-[14px] text-[#3ddc84]">
              <div className="mb-2 flex items-center gap-2 text-[11px] text-[#3ddc84]/70"><span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" /><span className="ml-2">feline-admin@mainframe: ~</span></div>
              <div className="h-[5.8em] overflow-hidden leading-[1.4]">
                {visible.slice(-4).map((l, i) => <div key={l + i}>{l}</div>)}
                {done ? <span>{on ? "█" : " "}</span> : <span>{on ? "█" : " "}</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[["Boxes claimed", "All"], ["Treats requested", "9,999"], ["Doors opened today", "41"], ["Keys typed by paw", "jjjjjjjj"]].map(([k, v]) => (
                <div key={k} className="rounded border border-white/15 bg-black/50 p-2 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-white/55">{k}</p>
                  <p className="text-[20px] font-bold">{v}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-[13px] text-white/50">To regain access, place 500 cans of tuna in the nearest cardboard box and leave the room.</p>
          </div>
        </div>

        {/* News reel */}
        <div className="flex h-11 items-stretch border-t-2 border-[#ffcc33] bg-[#05070d]">
          <div className="grid shrink-0 place-items-center bg-[#b00020] px-5 text-[14px] font-extrabold tracking-widest">LIVE NEWS</div>
          <div className="relative flex-1 overflow-hidden">
            <div className="absolute left-0 top-0 flex h-full items-center whitespace-nowrap text-[16px] text-white" style={{ animation: `ticker ${seconds}s linear infinite` }}>
              <span>{ticker}</span><span>{ticker}</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes fadein { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
      `}</style>
    </FullscreenPrank>
  )
}
