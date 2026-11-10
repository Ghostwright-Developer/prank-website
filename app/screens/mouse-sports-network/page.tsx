"use client"

import { useEffect, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { fx, speak, stopSpeaking } from "@/lib/fx"

interface Line { who: 0 | 1; text: string }
type Exchange = Line[]
const A = (text: string): Line => ({ who: 0, text })
const B = (text: string): Line => ({ who: 1, text })
const NAMES = ["RICKY RAMPAGE", "TONY THUNDER"]
const COLORS = ["#38bdf8", "#f472b6"]

const PREGAME: Exchange[] = [
  [A("Good evening, sports fans, and welcome to the Mouse Sports Network! I'm Ricky Rampage!"), B("And I'm Tony Thunder! Tonight: one human, one desktop, and absolutely NO rules!")],
  [A("The cursor is on the field, Tony. It has not moved in nine minutes."), B("Classic rope-a-dope, Ricky! He's letting the screen come to HIM!")],
  [A("We're hearing the human may have stepped away from the arena."), B("Or he's resting. Conserving energy. Sources say he had a big lunch.")],
  [A("Still nothing out there. Let's go to the replay of nothing."), B("Here's nothing again, in slow motion! Look at that form!")],
  [B("Ricky, twenty years in this business, and I have never seen a cursor sit this still!"), A("It's a gift, Tony. Some are born still.")],
  [A("Fun fact: the average person moves a mouse several hundred miles in a lifetime!"), B("And this one is clearly saving his.")],
  [A("The desktop looks nervous, Tony."), B("Those icons have held their positions since twenty nineteen. Tremendous discipline!")],
  [A("Reports of movement out there!"), B("Could be wind, Ricky. Keep your eyes peeled!")],
  [A("We are into hour two of the stare-off."), B("Nobody blinks! Well. Except the cursor. It blinks in text boxes.")],
  [B("I want to remind the fans: no cursor has ever left the building."), A("Not yet, Tony. Not yet!")],
  [A("Folks, the atmosphere in here tonight is ELECTRIC!"), B("It's the monitor, Ricky. It runs on electricity.")],
  [A("Welcome back to the greatest rivalry in computing history! Human versus Desktop!"), B("It's been going since the first mouse, Ricky! Nineteen sixty-four, baby!")],
  [B("Look at the crowd, Ricky! They came here to see a mouse move!"), A("And I promise you, Tony, they are going to SEE one!")],
  [A("Pre-game odds have the human at three to one to move the mouse in the next minute."), B("I like those odds. I like them a LOT.")],
  [A("The desktop has the home field advantage tonight."), B("Of course it does, Ricky. It's literally the field.")],
  [B("The wallpaper is looking sharp tonight, Ricky!"), A("Fresh coat of pixels! The grounds crew has been working overtime!")],
  [A("Any word on the human's warm-up routine?"), B("Sources say stretching. Maybe a sip of coffee. Maybe a snack. We just don't know!")],
  [A("Ladies and gentlemen, please rise for the national anthem of the desktop."), B("It's the Windows startup sound. Brings a tear to my eye every time.")],
  [B("Ricky, I've got a feeling about tonight."), A("What kind of feeling, Tony?"), B("A feeling that somebody is about to touch that mouse!")],
  [A("Let's check in with the cursor. How are you feeling, buddy?"), B("No comment. Cursors never talk to the press. It's a professional thing.")],
  [A("The taskbar is down there, just waiting."), B("Patient. Quiet. Dangerous. The taskbar has seen things, Ricky.")],
  [B("You know what they say, Ricky. Ninety percent of this game is half mental."), A("And the other half is waiting for the human to come back!")],
  [A("We're going to a quick word from our sponsors."), B("Tonight's game is brought to you by Nothing. Nothing is on at the moment.")],
  [A("Ladies and gentlemen, this is a quiet moment in the arena."), B("A moment of silence, Ricky, for all the tabs that were left open.")],
  [B("Ricky, the cursor just twitched. Did you see it?"), A("I did not, Tony. But I felt it. I felt it in my soul!")],
  [A("Folks, there is a rumor going around the press box."), B("Tell us, Ricky!"), A("The human is thinking about maybe possibly clicking something!")],
  [B("Whatever happens next, Ricky, we will be here, live, watching the screen."), A("Because that's what we DO, Tony!")],
  [A("You can feel the tension in this stadium!"), B("You can't actually feel it, Ricky. It's a screen. But the vibe is there!")],
]
const BACK: Exchange[] = [
  [A("WAIT! WAIT! IS THAT MOVEMENT?!"), B("HE'S BACK! THE HUMAN HAS RETURNED TO THE ARENA!"), A("The crowd is on its FEET, Tony!")],
  [B("OH MY GOODNESS, THE MOUSE JUST MOVED!"), A("WE HAVE ACTION! WE HAVE ACTION, FOLKS!"), B("I told you he'd be back! I TOLD you!")],
  [A("AND THERE HE IS! THE HUMAN IS BACK IN THE GAME!"), B("What a comeback! What a story! I'm getting goosebumps!")],
  [B("HE'S ALIVE! THE MOUSE IS ALIVE!"), A("Somebody cue the music! Hit the lights! We are LIVE again!")],
  [A("Ladies and gentlemen, the wait is over!"), B("THE MOUSE IS MOVING! GIVE IT UP FOR THE HUMAN!")],
]
const FAST: Exchange[] = [
  [A("Look at that speed! He's FLYING!"), B("Zero to the taskbar in one point two seconds! That's a RECORD!")],
  [B("Did you SEE that flick?!"), A("I saw a blur, Tony! I saw a BEAUTIFUL blur!")],
  [A("He is moving like a man with somewhere to be!"), B("Somebody get a speed gun on this guy!")],
  [B("OH, that's a rocket! That's a ROCKET, Ricky!"), A("The cursor left a trail of smoke! Let's call the fire department!")],
  [A("Where did it go?! Where did it go?!"), B("Over there! No, over there! He's everywhere!")],
  [A("That is blazing fast, Tony!"), B("The cursor is going so fast it's going back in time!")],
  [B("The wrist on this guy! The WRIST!"), A("That's a championship wrist, folks!")],
  [A("He's swinging that mouse like a lightsaber!"), B("Easy, champ! Think of the desk!")],
]
const CORNER: Exchange[] = [
  [A("He's heading for the corner... he's IN THE CORNER!"), B("Nobody goes to the corner anymore, Ricky! This guy has HEART!")],
  [B("Top left corner! Is he looking for the Start button?"), A("The Start button is not there, Tony! That's a different sport!")],
  [A("Corner shot! He pinned it right into the corner!"), B("That's a hot-corner special! Unbelievable!")],
  [B("Oh, he's in the corner, Ricky! Nowhere to go!"), A("Or is that EXACTLY where he wants to be? Mind games!")],
  [A("He's testing the corner! He wants to know what's in there!"), B("Spoiler alert: pixels! Just a whole lot of pixels!")],
  [B("That is as far as the cursor can go, folks!"), A("The edge of the world! Hope you packed a lunch!")],
  [A("Into the pocket! Into the pocket! Beautiful!"), B("That's why they pay him the big money! Well. Actually they don't pay him anything.")],
]
const EDGE: Exchange[] = [
  [A("He's up at the very top of the screen! That's the address bar zone!"), B("Dangerous territory, Ricky!")],
  [A("Down to the bottom edge. That's the taskbar."), B("The taskbar! Where dreams go to be minimized!")],
  [B("He's riding the edge, folks! One wrong move and he's off the screen!"), A("Walking the line! A tightrope walker with a mouse pad!")],
  [A("He's right on the border!"), B("The border is a suggestion, Ricky. The mouse cannot cross it. But what a try!")],
  [B("Look at him hugging the wall!"), A("That's a defensive mouse. Cautious. Calculated.")],
  [A("Along the bottom now! Is he going for the system tray?"), B("The tiny icons! The tiny, tiny icons! Nobody knows what half of them do!")],
]
const CLICK: Exchange[] = [
  [A("He clicks!"), B("...and nothing happens! A bold strategy!")],
  [B("Click! Absolutely nothing!"), A("Questions for the desktop, Tony. Serious questions!")],
  [A("A click! Right on the wallpaper!"), B("The wallpaper did not react. Cold. Very cold.")],
  [A("And he clicks again! Nothing!"), B("You have to respect the commitment!")],
  [B("Another click! He is not giving up, Ricky!"), A("That's what makes him a champion!")],
  [A("Click! A beautiful, crisp click!"), B("You could hear that one in the cheap seats!")],
  [B("Oh, he clicked a little too hard on that one."), A("Easy on the equipment, pal! Those switches are rated for millions of clicks, but still!")],
  [A("He clicked! Did anything happen?"), B("No. No it did not. Moving on.")],
  [B("That click had purpose, Ricky!"), A("That click had DESTINY!")],
  [A("Click! He's testing the desktop's defenses!"), B("The desktop isn't talking!")],
  [B("And he clicks on nothing again!"), A("Nothing is a worthy opponent, Tony.")],
  [A("Click, click, thinking about it..."), B("I can't tell if he's attacking or just checking if it works!")],
  [B("Pow! Right on the pixel!"), A("Right in the middle of nowhere! That's a prime click!")],
]
const DOUBLE: Exchange[] = [
  [A("DOUBLE CLICK! He's going for the open!"), B("...and it's not opening anything! This is a mouse sport, not a miracle!")],
  [B("DOUBLE CLICK! That's how you do it, folks!"), A("Two clicks! Twice the fun! Twice the nothing!")],
  [A("A double click! Quick hands!"), B("Fast fingers! He could play piano! He could play the stock market!")],
]
const RAGE: Exchange[] = [
  [A("He's spamming it! RAGE-CLICKING!"), B("The desktop is definitely ignoring him, Ricky! Definitely!")],
  [B("OH, here we go! He's lost it! He's absolutely lost it!"), A("Click click click click click! He's going for the record!")],
  [A("Somebody tell this man the mouse button is not a drum!"), B("It's a drum solo, Ricky! It's a mouse drum solo!")],
  [B("Seven clicks in two seconds! That's a personal best!"), A("And not one of them did anything! That is dedication!")],
]
const RIGHT: Exchange[] = [
  [B("RIGHT CLICK! The risky play!"), A("Haven't seen one of those since twenty twelve!")],
  [A("A right click! Is he looking for the secret menu?!"), B("There is no menu, Ricky! There never was! But he KEEPS TRYING!")],
  [B("The classic right-click! A move older than most of the fans!"), A("And just as useless on a wallpaper!")],
]
const JIGGLE: Exchange[] = [
  [A("He's shaking it! Is he looking for the cursor?!"), B("Rookie move! It's right there, big man! It's the thing you're moving!")],
  [B("Oh he's WIGGLING it. That's the international signal for 'where did I put it'."), A("It never leaves, Tony. It never leaves!")],
  [A("Shake, shake, shake! He's going for the shake!"), B("He's doing the mouse shuffle! Somebody get this man a dance floor!")],
  [B("He's wiggling like a fish on a hook!"), A("That cursor is going to make a break for it!")],
  [A("A jiggle! A classic jiggle!"), B("That's a move to find the cursor! The oldest trick in the book!")],
]
const HOVER: Exchange[] = [
  [A("He's stopped. Just hovering."), B("That's hovering with intent, Ricky! You can see him think!")],
  [B("The cursor is just sitting on that spot."), A("Staring. Contemplating. Unclear if he's about to click or about to retire.")],
  [A("He's hovering, folks! Can he hold the position?"), B("This is mental toughness at its finest!")],
  [B("Hovering over a pixel like a hawk!"), A("A very patient hawk!")],
  [A("What's he waiting for?"), B("Maybe a tooltip! Maybe a miracle! Maybe lunch!")],
  [B("The tension! The TENSION!"), A("You could cut it with a knife! Well. A butter knife. It's a soft tension.")],
  [A("There's a standoff happening right now!"), B("Man versus pixel! This is the stuff legends are made of!")],
]
const SCROLL: Exchange[] = [
  [A("SCROLLING! In a stadium!"), B("There is nothing to scroll, Ricky! It's a bold, BOLD decision!")],
  [B("He's spinning that wheel!"), A("Wheel of fortune! Wheel of nothing! Same wheel!")],
  [A("Up! Down! Up! Down!"), B("He's looking for the rest of the page! There is no rest of the page!")],
]
const KEY: Exchange[] = [
  [A("A KEYBOARD?! This is a MOUSE sport!"), B("Somebody check his registration!")],
  [B("Keyboard use detected."), A("Disqualification talk is already happening in the booth!")],
  [A("Fingers on the keys! That is a technical foul!"), B("Throw the flag! Somebody throw a flag!")],
  [B("OH, he typed something! Ricky, we've got a typist!"), A("A rule-breaker! A rebel with a keyboard!")],
]
const MILESTONE: Exchange[] = [
  [A("He's covered another ten thousand pixels!"), B("A personal best, Ricky! Somebody get this man a sandwich!")],
  [B("And that is ANOTHER ten thousand pixels in the books!"), A("This man is a marathon runner with a mouse pad!")],
  [A("Ten thousand more pixels! Do you know how many that is?"), B("No, Ricky. Nobody does. But it's A LOT!")],
]
const REPLAY: Exchange[] = [
  [A("And here's the replay, in slow motion!"), B("Look at the technique! Look at the wrist! That's twenty years of practice!")],
  [B("Let's take another look at that play!"), A("Slow it down! Slower! Slower! There it is! That's the money shot!")],
  [A("Replay time, folks! Watch the cursor!"), B("Watch the cursor! Watch the cursor! He's gone in a blink!")],
]
const IDLE_LONG: Exchange[] = [
  [A("Folks, we are in a long delay here at the desktop."), B("Time for a stretch, everybody! Stand up! Touch your toes! Don't touch the mouse!")],
  [B("Still no movement, Ricky."), A("The silence is deafening, Tony. It's the sound of a laptop fan.")],
  [A("This is the longest stoppage of play I have ever seen."), B("The human might have gone to get a snack. A very long snack.")],
]

const pickOne = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)]

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

interface Pt { t: number; x: number; y: number }

export default function MouseSportsNetwork() {
  const trail = useRef<HTMLCanvasElement>(null)
  const label = useRef<HTMLDivElement>(null)
  const [cap, setCap] = useState<(Line & { k: number }) | null>(null)
  const [replay, setReplay] = useState(false)
  const [stats, setStats] = useState({ dist: 0, top: 0, clicks: 0, idle: 0, energy: 8 })
  const [flash, setFlash] = useState("")

  useEffect(() => {
    const cv = trail.current!
    const g = cv.getContext("2d")!
    const fit = () => { cv.width = innerWidth; cv.height = innerHeight }
    fit(); addEventListener("resize", fit)

    let busy = false, curPrio = 0, token = 0, k = 0
    const lastAt: Record<string, number> = {}
    const start = performance.now()
    let lastInput = start
    let everInput = false
    let pre = 0
    const order = [...PREGAME].sort(() => Math.random() - 0.5)
    let lastEx = performance.now()
    let dist = 0, top = 0, clicks = 0, energy = 8, nextMilestone = 10000
    let last: Pt | null = null
    const hist: Pt[] = []
    let lastVx = 0, flips: number[] = []
    let stillTimer: ReturnType<typeof setTimeout> | undefined
    let moveStreak = 0
    let clickTimes: number[] = []
    let lastReplay = 0
    let replayRaf = 0
    let mx = innerWidth / 2, my = innerHeight / 2

    const cool = (key: string, ms: number) => { const n = performance.now(); if (n - (lastAt[key] ?? -1e9) < ms) return false; lastAt[key] = n; return true }
    const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]

    async function play(ex: Exchange, prio: number) {
      if (busy && prio <= curPrio) return
      const my = ++token
      busy = true; curPrio = prio; lastEx = performance.now()
      stopSpeaking()
      for (const line of ex) {
        if (my !== token) return
        setCap({ ...line, k: ++k })
        await Promise.all([speak(line.text, { voice: line.who ? "tony" : "rex" }), sleep(Math.max(1800, line.text.length * 50))])
        await sleep(220)
      }
      if (my === token) { busy = false; curPrio = 0; lastEx = performance.now() }
    }

    const hype = (n: number) => { energy = Math.min(100, energy + n) }
    const touchInput = () => {
      const now = performance.now()
      const away = now - lastInput
      if ((!everInput && now - start > 5000) || (everInput && away > 9000)) {
        play(pickOne(BACK), 9); fx.roar(); fx.airhorn(); hype(40); setFlash("HE'S BACK"); setTimeout(() => setFlash(""), 2600)
      }
      everInput = true
      lastInput = now
    }

    const onMove = (e: PointerEvent) => {
      touchInput()
      const t = performance.now()
      mx = e.clientX; my = e.clientY
      if (label.current) { label.current.style.display = "block"; label.current.style.transform = `translate(${mx + 18}px, ${my + 22}px)` }
      if (last) {
        const dt = Math.max(1, t - last.t)
        const d = Math.hypot(mx - last.x, my - last.y)
        dist += d
        const v = (d / dt) * 1000
        if (v > top && v < 20000) top = v
        // trail
        g.strokeStyle = "rgba(74,222,128,.9)"; g.lineWidth = 5; g.lineCap = "round"; g.shadowColor = "#4ade80"; g.shadowBlur = 14
        g.beginPath(); g.moveTo(last.x, last.y); g.lineTo(mx, my); g.stroke()
        // fast
        if (v > 3200 && cool("fast", 16000)) { play(pick(FAST), 4); fx.cheer(2); hype(10) }
        // jiggle: count horizontal direction flips in 1s
        const vx = mx - last.x
        if (Math.abs(vx) > 3 && Math.sign(vx) !== Math.sign(lastVx) && lastVx !== 0) { flips.push(t); flips = flips.filter((f) => t - f < 1000); if (flips.length >= 7 && cool("jiggle", 14000)) { play(pick(JIGGLE), 6); hype(15) } }
        if (Math.abs(vx) > 3) lastVx = vx
        if (dist > nextMilestone) { nextMilestone += 10000; if (cool("mile", 20000)) { play(pickOne(MILESTONE), 3); fx.applause(); hype(10) } }
      }
      last = { t, x: mx, y: my }
      hist.push(last); while (hist.length && t - hist[0].t > 4500) hist.shift()
      moveStreak++
      // corners / edges
      const nearX = Math.min(mx, innerWidth - mx), nearY = Math.min(my, innerHeight - my)
      if (nearX < 50 && nearY < 50 && cool("corner", 18000)) { play(pick(CORNER), 7); fx.cheer(4); hype(25) }
      else if ((nearY < 6 || nearY > innerHeight - 8) && cool("edge", 20000)) { play(pick(EDGE), 2); fx.gasp(); hype(5) }
      // stopped moving -> hover talk + replay
      clearTimeout(stillTimer)
      stillTimer = setTimeout(() => {
        const streak = moveStreak; moveStreak = 0
        if (streak > 25 && performance.now() - lastReplay > 40000 && hist.length > 20) { lastReplay = performance.now(); doReplay() }
        else if (cool("hover", 22000)) { play(pick(HOVER), 2); fx.ooh() }
      }, 3000)
    }

    function doReplay() {
      const pts = hist.slice()
      if (pts.length < 10) return
      play(pickOne(REPLAY), 5)
      setReplay(true)
      const t0 = performance.now()
      const dur = (pts[pts.length - 1].t - pts[0].t) / 0.35
      const overlay = trail.current!.getContext("2d")!
      const step = () => {
        const p = Math.min(1, (performance.now() - t0) / dur)
        const idx = Math.floor(p * (pts.length - 1))
        overlay.clearRect(0, 0, cv.width, cv.height)
        overlay.strokeStyle = "rgba(250,204,21,.95)"; overlay.lineWidth = 6; overlay.shadowColor = "#facc15"; overlay.shadowBlur = 16
        overlay.beginPath(); overlay.moveTo(pts[0].x, pts[0].y)
        for (let i = 1; i <= idx; i++) overlay.lineTo(pts[i].x, pts[i].y)
        overlay.stroke()
        overlay.fillStyle = "#fff"; overlay.beginPath(); overlay.arc(pts[idx].x, pts[idx].y, 10, 0, 7); overlay.fill()
        if (p < 1) replayRaf = requestAnimationFrame(step)
        else setTimeout(() => { overlay.clearRect(0, 0, cv.width, cv.height); setReplay(false) }, 900)
      }
      step()
    }

    const onDown = (e: PointerEvent) => {
      touchInput()
      clicks++; hype(4)
      const t = performance.now()
      clickTimes.push(t); clickTimes = clickTimes.filter((c) => t - c < 2200)
      g.fillStyle = "rgba(250,204,21,.9)"; g.beginPath(); g.arc(e.clientX, e.clientY, 18, 0, 7); g.fill()
      if (clickTimes.length >= 5 && cool("rage", 25000)) { play(pickOne(RAGE), 6); fx.boo() }
      else if (clickTimes.length === 2 && t - clickTimes[0] < 420 && cool("dbl", 14000)) { play(pickOne(DOUBLE), 5); fx.cheer(2) }
      else if (cool("click", 7000)) { play(pick(CLICK), 3); if (Math.random() < 0.4) fx.murmur(2) }
    }
    const onCtx = (e: MouseEvent) => { e.preventDefault(); touchInput(); if (cool("right", 14000)) { play(pickOne(RIGHT), 5); fx.gasp() }; hype(6) }
    const onWheel = () => { touchInput(); if (cool("scroll", 20000)) { play(pickOne(SCROLL), 3); fx.groan() } }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key.toLowerCase() === "q") return; touchInput(); if (cool("key", 20000)) { play(pickOne(KEY), 4); fx.boo(true) } }

    addEventListener("pointermove", onMove, { passive: true })
    addEventListener("pointerdown", onDown, { passive: true })
    addEventListener("contextmenu", onCtx)
    addEventListener("wheel", onWheel, { passive: true })
    addEventListener("keydown", onKey)

    // fade the trail
    const fade = setInterval(() => {
      g.save(); g.globalCompositeOperation = "destination-out"; g.shadowBlur = 0; g.fillStyle = "rgba(0,0,0,.14)"; g.fillRect(0, 0, cv.width, cv.height); g.restore()
    }, 60)

    // pregame chatter while nobody is touching anything
    const chatter = setInterval(() => {
      const now = performance.now()
      if (!busy && now - lastInput > 5000 && now - lastEx > 4500) { play(now - lastInput > 45000 && Math.random() < 0.3 ? pickOne(IDLE_LONG) : order[pre % order.length], 1); pre++ }
    }, 2000)
    // first line right away
    fx.murmur(8); play(order[pre++], 1)

    const hud = setInterval(() => {
      energy = Math.max(6, energy - 1.2)
      setStats({ dist, top, clicks, idle: Math.floor((performance.now() - lastInput) / 1000), energy })
    }, 500)

    return () => {
      removeEventListener("resize", fit)
      removeEventListener("pointermove", onMove); removeEventListener("pointerdown", onDown); removeEventListener("contextmenu", onCtx)
      removeEventListener("wheel", onWheel); removeEventListener("keydown", onKey)
      clearInterval(fade); clearInterval(chatter); clearInterval(hud); clearTimeout(stillTimer); cancelAnimationFrame(replayRaf)
      token++; stopSpeaking()
    }
  }, [])

  const metres = (stats.dist * 0.000264583).toFixed(2)
  return (
    <FullscreenPrank exitMessage="THE MOUSE SPORTS NETWORK HAS GONE OFF THE AIR - IT WAS A PRANK!" className="cursor-default bg-[#04140d] font-sans text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#0d3b25,#04140d_75%)]" />
      {/* field markings */}
      <div className="absolute inset-[7%] rounded-md border-2 border-white/10" />
      <div className="absolute left-1/2 top-[7%] bottom-[7%] w-0.5 -translate-x-1/2 bg-white/10" />
      <div className="absolute left-1/2 top-1/2 h-[28vmin] w-[28vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/10" />
      <div className="pointer-events-none absolute inset-0 [background:repeating-linear-gradient(90deg,rgba(255,255,255,.02)_0_80px,transparent_80px_160px)]" />

      <canvas ref={trail} className="pointer-events-none absolute inset-0 z-10" />
      <div ref={label} className="pointer-events-none absolute left-0 top-0 z-20 hidden rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-bold tracking-wider text-[#facc15]">HUMAN #1</div>

      {/* scoreboard */}
      <div className="absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 px-5 py-3">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-bold tracking-[0.25em]"><span className="rounded bg-[#dc2626] px-2 py-0.5 text-[11px]">LIVE</span> MOUSE SPORTS NETWORK</div>
          <p className="mt-1 text-[13px] font-semibold text-white/80">HUMAN <span className="text-white/40">vs</span> DESKTOP</p>
        </div>
        <div className="flex gap-2 text-center">
          {[["DISTANCE", `${metres} m`], ["TOP SPEED", `${Math.round(stats.top)} px/s`], ["CLICKS", `${stats.clicks} (0 effective)`], ["IDLE", `${stats.idle}s`]].map(([k, v], i) => (
            <div key={k} className={`${i > 1 ? "max-sm:hidden" : ""} min-w-[78px] rounded border border-white/15 bg-black/60 px-3 py-1.5`}>
              <p className="text-[9px] tracking-widest text-white/55">{k}</p>
              <p className="whitespace-nowrap font-mono text-[15px] font-bold leading-tight">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {flash && <p className="pointer-events-none absolute inset-x-0 top-[28%] z-30 text-center text-[clamp(50px,11vw,150px)] font-black italic text-[#facc15] [text-shadow:0_0_40px_#f59e0b,0_6px_0_#92400e] [animation:ms-pop_.35s_cubic-bezier(.2,1.6,.4,1)]">{flash}!</p>}
      {replay && <div className="absolute right-6 top-[96px] z-30 rounded bg-[#facc15] px-3 py-1 text-[14px] font-black tracking-widest text-black">▶ INSTANT REPLAY · 0.35x</div>}

      {/* crowd energy + captions */}
      <div className="absolute inset-x-0 bottom-0 z-30">
        <div className="mx-5 mb-2 flex items-center justify-end gap-3 text-[11px] tracking-widest text-white/60">
          CROWD ENERGY
          <div className="h-2 w-44 overflow-hidden rounded bg-white/10"><div className="h-full bg-[#4ade80] transition-all duration-500" style={{ width: `${stats.energy}%` }} /></div>
        </div>
        <div className="flex items-stretch border-t-2 border-[#dc2626] bg-[#07110d]/95">
          <div className="grid w-[170px] shrink-0 place-items-center px-3 text-center text-[12px] font-extrabold tracking-widest" style={{ background: cap ? COLORS[cap.who] : "#dc2626", color: "#04140d" }}>{cap ? NAMES[cap.who] : "STAND BY"}</div>
          <p key={cap?.k ?? 0} className="min-h-[3.4rem] flex-1 px-5 py-3.5 text-[clamp(15px,1.9vw,24px)] leading-snug [animation:ms-in_.35s_ease]">{cap?.text ?? "We are LIVE from the desktop."}</p>
        </div>
      </div>
      <style>{`
        @keyframes ms-pop { from { transform: scale(.3); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes ms-in { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
      `}</style>
    </FullscreenPrank>
  )
}
