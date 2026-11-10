"use client"

import { useEffect, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { fx, speak, stopSpeaking, preloadSpeech } from "@/lib/fx"
import { sfx } from "@/lib/sfx"

/** A = Jimmy "The Jet" Jenkins (play-by-play), B = Marv Mulligan (colour). The generator pre-renders every A()/B() line. */
interface Line { who: 0 | 1; text: string; cue?: string; wait?: number }
type Exchange = Line[]
const A = (text: string, o: { cue?: string; wait?: number } = {}): Line => ({ who: 0, text, ...o })
const B = (text: string, o: { cue?: string; wait?: number } = {}): Line => ({ who: 1, text, ...o })
const NAMES = ["JIMMY “THE JET” JENKINS", "MARV MULLIGAN"]
const COLORS_CAP = ["#ff3d71", "#00e5ff"]

const LOGO_W = 280
const LOGO_H = 96
const COLORS = ["#ff3d71", "#00e5ff", "#ffd400", "#7cff4d", "#c77dff", "#ff8a00", "#ffffff"]

const OPENING: Exchange = [
  A("Good evening, everybody, and welcome to the Screensaver Sports Network! I'm Jimmy The Jet Jenkins, and WOW, what a night for it!"),
  B("And I'm Marv Mulligan. Jimmy has had four coffees. I'd like that on the record."),
  A("Five, Marv! Five! And I regret nothing! Tonight, one logo, four corners, and a whole lot of hope!"),
  B("Mostly hope. The odds of a corner are, historically, not great."),
]
const ANTHEM: Exchange = [
  A("Ladies and gentlemen, please rise for the national anthem of the screensaver."),
  B("Remove your hats. Remove your tabs. Remove that cat video, Dennis, we can see you.", { cue: "anthem", wait: 12500 }),
  A("Beautiful. Just beautiful. I'm not crying, you're crying!"),
  B("I'm crying. It's a very good anthem."),
]

const WALL: Exchange[] = [
  [A("Left wall! And that's the third wall in a row, folks!"), B("Strong wall performance. I'd say the wall is having a career year.")],
  [A("Right wall! A clean, crisp bounce!"), B("A bounce is a bounce, Jimmy. Let's not hand out medals.")],
  [A("It hits the top, and the top has NEVER looked better!"), B("The top is the same top it was ten minutes ago. But I'll allow the enthusiasm.")],
  [B("Floor contact. Textbook."), A("Textbook! You could teach a class on that bounce!"), B("I have. Nobody came.")],
  [A("Changing color! Bold choice!"), B("Risky. But it pays off. Purple on black. Confident.")],
  [A("Look at it go! Just look at it go!"), B("I am looking at it, Jimmy. It's all there is to look at.")],
  [B("It's just bouncing out there."), A("Beautiful, isn't it?"), B("It's... beautiful, yes. Not going anywhere, but beautiful.")],
  [A("No corner yet. But you can feel it, Marv! You can feel it in the air!"), B("That's the air conditioning, Jimmy.")],
  [A("The fans in this arena have not looked away for forty minutes!"), B("They can't. They're mostly pixels.")],
  [B("Top wall, nice little ricochet."), A("Oh, he's thinking about it! He's THINKING!"), B("The logo does not think, Jimmy. It travels.")],
  [A("Folks, this logo has been bouncing for decades!"), B("Since the nineties. Hasn't missed a night. Well, it's missed a lot of corners.")],
  [A("Right side again! He loves the right side!"), B("Some days the logo just likes the right side. Nobody asks why.")],
  [B("Smooth. Steady. Professional."), A("That is a PROFESSIONAL bounce!"), B("Pay the man.")],
  [A("Marv, tell me what you're seeing out there!"), B("I'm seeing a logo. In motion. Doing logo things.")],
  [A("Down to the floor, and back up! That is how you stay in shape!"), B("I haven't stayed in shape since the Clinton administration.")],
  [A("Oh, a crisp turn off the left wall! Look at that angle!"), B("It's the same angle as the last one. Geometry is consistent.")],
  [B("Quiet moment here in the arena."), A("Just the hum of the monitor, Marv."), B("A lovely hum. Fifty hertz. Chef's kiss.")],
  [A("It's a beautiful night for a bounce, ladies and gentlemen!"), B("It's a beautiful night for anything with a roof, Jimmy.")],
  [A("Folks, we are into the fortieth minute and nothing but wall!"), B("Honest, hard-working wall. The backbone of this sport.")],
  [A("The color just shifted again! Pink to blue!"), B("A subtle change, but I noticed. I notice things. It's why I'm here.")],
  [B("Jimmy, do you ever think about the logo's feelings?"), A("EVERY DAY, Marv!"), B("I figured. You look tired.")],
  [A("Eyes on the corners, everybody! Corner Watch continues!"), B("Eyes on the corners. And a sandwich, if somebody's going.")],
  [A("A little slower now! Taking its time!"), B("Knows how to pace itself. Which is more than I can say for you.")],
  [A("Bounce, bounce, bounce! Somebody get this logo a trophy!"), B("We tried. It bounced off.")],
  [B("You know what I love about this sport?"), A("What, Marv?"), B("Nothing. I was hoping you'd have something.")],
  [A("Ladies and gentlemen, we are LIVE, we are LOUD, we are in the building!"), B("We are in a browser tab, Jimmy. But sure.")],
  [A("There it goes, off the wall! Just like that!"), B("Just like the last one. And the one before that. And the one before that.")],
  [B("I'll tell you what, Jimmy. In forty years, I've never seen a logo so committed."), A("Forty years?! You don't look a day over fifty!"), B("I'm forty-one.")],
  [A("It's lining up for a run at the top left!"), B("It's lining up for the top left every time it's in the middle.")],
  [A("Folks, the atmosphere in here is ELECTRIC!"), B("It's the monitor, Jimmy. It runs on electricity.")],
]
const MISS: Exchange[] = [
  [A("SO CLOSE! A hair off the corner! Somebody's crying in section twelve!"), B("It's me. I'm in section twelve."), A("It was ELEVEN PIXELS, Marv!"), B("I know how many pixels it was, Jimmy. I counted. Twice.")],
  [A("OH! DID YOU SEE THAT?! NO! NO! NO NO NO NO!"), B("Take a breath, Jimmy."), A("I can't breathe, Marv! I CAN'T BREATHE!"), B("That's the coffee talking.")],
  [A("ABSOLUTELY ROBBED! Somebody call the referee!"), B("There's no referee, Jimmy."), A("THEN SOMEBODY BE THE REFEREE!"), B("...Fine. Ruling on the field: not a corner.")],
  [B("Oh dear. Oh, that one hurts."), A("It was RIGHT THERE, Marv!"), B("It was. It was right there. And then it wasn't.")],
  [A("The crowd gasps! It ALMOST happened!"), B("Almost is a hard word, Jimmy."), A("It's the hardest word, Marv."), B("Second hardest. First is 'refund.'")],
  [A("Missed it by a whisker! A tiny, cruel whisker!"), B("Cruel is the right word. The logo grazed the corner and just... walked away.")],
  [B("That's going to haunt me."), A("It's going to haunt ALL of us!"), B("No, I mean literally. I'm going to dream about that corner. Look at it. It's still just sitting there.")],
  [A("Oh, so near and yet so far!"), B("Like a bus, Jimmy. You wait forty minutes, and it drives straight past.")],
  [A("I cannot BELIEVE it! That was perfect! That was PERFECT!"), B("It wasn't, though. That's what makes it so painful.")],
  [A("NOOOO! The logo grazed the edge and bounced away!"), B("I'm going to sit down."), A("You're already sitting down!"), B("Then I'm going to sit down harder.")],
  [B("Let's go to the replay on that one."), A("Slow it down! Slower! SLOWER! There!"), B("Look at that. Eleven pixels off the corner. You could fit a small sandwich in there."), A("It's the closest we've been all night!")],
  [A("That one will be in my dreams tonight, Marv!"), B("Mine too. We'll compare notes in the morning.")],
  [A("The corner was RIGHT THERE and the logo said no!"), B("Cold-blooded. Pure cold-blooded.")],
  [A("Folks, that was a heartbreaker!"), B("Folks, we need a minute. Please. Stay seated. We'll be right back.")],
  [A("Right there! Gone! Just like that!"), B("Like my dreams. Like my knees. Like the rest of this sentence.")],
]
const TENSE: Exchange[] = [
  [A("Hold on... hold on... the angle is... it's lining up..."), B("Nobody breathe. Nobody breathe.")],
  [B("Jimmy. Jimmy, look at the angle."), A("I'm looking, Marv! I'm looking!"), B("It's lined up. It is lined up.")],
  [A("Everyone in the building is standing! Nobody is breathing!"), B("Please, please, please. I'll never ask for anything again.")],
  [A("This could be it! This could be THE ONE!"), B("Don't say that. Don't jinx it.")],
  [B("It's heading for the corner. Slowly. Steadily. Dramatically."), A("I have goosebumps, Marv!"), B("That's the air conditioning.")],
  [A("Wait a second. WAIT A SECOND! Is this the one?!"), B("Hush, everyone. Absolute silence. This is delicate.")],
  [B("I have a feeling about this one."), A("A good feeling?"), B("A feeling. That's all I'll say. A feeling.")],
  [A("Both walls are coming up fast! HERE IT COMES!"), B("Steady now. Steady. Don't do anything silly.")],
  [A("The logo's coming back across the screen, Marv!"), B("With a look in its eye. A determined look.")],
  [B("The human's back, Jimmy. Look at the cursor."), A("It's the human! They've returned to the stadium!"), B("And the logo can feel it. Watch the angle. Watch the angle.")],
]
const HIT: Exchange[] = [
  [A("CORNER! CORNER! CORNER! CORNER!"), B("Is this real? Jimmy, is this real life?!"), A("IT'S REAL, MARV! IT'S REAL! I HAVE WAITED MY WHOLE LIFE FOR THIS!"), B("Let's go to the replay!"), A("Slow it down! Slow it down!"), B("Look at that angle. Look at the lead-up. Look at that CORNER."), A("That's the money shot, Marv!"), B("That is the money shot, folks. Frame it.")],
  [A("IT HAPPENED! THE LOGO HIT THE CORNER! SOMEBODY HOLD ME!"), B("I'm holding you, Jimmy. I'm holding you. I'm also crying."), A("Put it in the museum! Put it in the museum RIGHT NOW!"), B("Let's see that again. Slow motion, please."), A("Look at the form!"), B("Look at the corner. It's sitting there like it's been waiting for him. That's the money shot."), A("The MONEY SHOT, Marv!")],
  [B("It's in the corner."), A("DIRECT HIT! A PERFECT CORNER! THE CROWD GOES WILD!"), B("My grandmother waited forty years for this, and she missed it by one week."), A("She's watching from somewhere, Marv!"), B("She is. And she's saying 'told you so.'"), A("Replay! Replay! Slow it down!"), B("There it is. Kiss the corner. Kiss it. That's the money shot of the decade.")],
  [A("UNBELIEVABLE! I will remember this day forever!"), B("I'll remember it until about Thursday."), A("MARV! YOU'RE WITNESSING HISTORY!"), B("I'm witnessing a logo. But it's the best logo I've ever witnessed. Slow it down, let's see it again."), A("There it is. Look at that. Money shot."), B("Money shot.")],
  [A("THE LOGO! THE CORNER! THE LOGO IN THE CORNER!"), B("I knew it. I knew it all along. Well, no, I didn't. But I'm thrilled."), A("Put it on a poster!"), B("I'm putting it on a mug. Replay, please. There. See the angle? Look at that. That's the money shot, and I'll hear no argument.")],
]
const REPLAY_EXTRA: Exchange[] = [
  [B("Let's take another look at that, shall we?"), A("Slow it down! Slower! Even slower!"), B("There. That's the money shot. That's the moment the logo became a legend.")],
  [A("Here's the replay in glorious slow motion!"), B("Look at that. Look at the edge of the logo. Kissing the corner."), A("That's the MONEY SHOT, Marv!"), B("It's the money shot, Jimmy. It's the money shot.")],
]
const PRESENCE: Exchange[] = [
  [A("Folks, we've got a visitor in the building!"), B("A human. Sitting there. Watching us watch a logo."), A("Say hi to the fans, human!"), B("Don't encourage them.")],
  [B("We've got eyes on the screen, Jimmy."), A("Real, living, breathing eyes!"), B("Please don't scare them off. They're hard to get.")],
]
const BANTER: Exchange[] = [
  [A("Marv, I have a theory. What if the logo WANTS the corner?"), B("What if the logo just goes where physics sends it?"), A("Physics is just the logo's way of dreaming, Marv."), B("I'm going to need you to stop talking for a while.")],
  [B("Jimmy, where's your head at?"), A("Right here, Marv! On my shoulders! Where it's always been!"), B("That's good to know.")],
  [A("Marv, what's your prediction for the next hour?"), B("More bouncing."), A("Bold!"), B("I've been wrong before.")],
  [A("Marv, you ever want to be the logo?"), B("Every day. No worries. No taxes. Just bouncing. Beautiful bouncing.")],
  [B("You know, Jimmy, they say a watched logo never hits the corner."), A("Who says that?!"), B("Me. Just now. It's a saying now.")],
  [A("Marv, do you think the logo has a family?"), B("I think the logo has a lot of cousins on other screens. They don't talk.")],
  [A("Folks, we want to thank our sponsors tonight!"), B("Tonight's coverage is brought to you by Nothing. And Nothing says hello.")],
  [A("Quick stat, Marv! The logo has covered over eleven thousand pixels this quarter!"), B("Who counts these things?"), A("I do, Marv! In my spare time!"), B("You need hobbies.")],
]

interface Plan { sx: number; sy: number }

/** Choose speeds so the logo reaches a corner exactly T seconds from now (it bounces around in between). */
function planHit(x: number, y: number, dx: number, dy: number, W: number, H: number, T: number): Plan {
  const reach = (p: number, d: number, size: number, target: 0 | 1, j: number) => {
    const toWall = d > 0 ? size - p : p
    const farSide = d > 0 ? 1 : 0 // wall we meet first: 1 = max side, 0 = min side
    return toWall + (target === farSide ? 0 : size) + 2 * j * size
  }
  let best: Plan | null = null
  let bestScore = Infinity
  for (const tx of [0, 1] as const) for (const ty of [0, 1] as const) {
    for (let jx = 0; jx < 120; jx++) {
      const sx = reach(x, dx, W, tx, jx) / T
      if (sx < 120) continue
      if (sx > 420) break
      for (let jy = 0; jy < 120; jy++) {
        const sy = reach(y, dy, H, ty, jy) / T
        if (sy < 120) continue
        if (sy > 420) break
        const score = Math.abs(sx - 230) + Math.abs(sy - 190) + Math.random() * 40
        if (score < bestScore) { bestScore = score; best = { sx, sy } }
      }
    }
  }
  return best ?? { sx: 230, sy: 190 }
}

interface Spark { x: number; y: number; vx: number; vy: number; r: number; c: string; rot: number; vr: number; life: number }

export default function CornerWatch() {
  const logo = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const cornerGlow = useRef<(HTMLDivElement | null)[]>([])
  const [hud, setHud] = useState({ hits: 0, miss: 0, walls: 0, secs: 0, prox: 999, viewers: 412938 })
  const [color, setColor] = useState(COLORS[0])
  const [cap, setCap] = useState<{ who: 0 | 1; text: string; k: number } | null>(null)
  const [flash, setFlash] = useState<null | { text: string; kind: "miss" | "hit" | "tense" }>(null)
  const [alert, setAlert] = useState(false)

  useEffect(() => {
    let W = innerWidth - LOGO_W
    let H = innerHeight - LOGO_H
    let x = Math.random() * W * 0.6 + 40
    let y = Math.random() * H * 0.6 + 40
    let dx = Math.random() < 0.5 ? 1 : -1
    let dy = Math.random() < 0.5 ? 1 : -1
    let plan = planHit(x, y, dx, dy, W, H, 70 + Math.random() * 50)
    let last = performance.now()
    let walls = 0, miss = 0, hits = 0
    let paused = 0 // seconds left of celebration freeze
    let lastLine = 0
    let colorIdx = 0
    let interacted = false
    let startedAt = performance.now()
    let tenseUntil = 0
    const sparks: Spark[] = []
    let raf = 0

    let busy = false, curPrio = 0, token = 0, kk = 0
    let lastEx = performance.now()
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
    const bagOf = <T,>(a: T[]) => { let q: T[] = []; return () => { if (!q.length) q = [...a].sort(() => Math.random() - 0.5); return q.pop() as T } }
    const nextWall = bagOf(WALL), nextMiss = bagOf(MISS), nextTense = bagOf(TENSE), nextHit = bagOf(HIT), nextBanter = bagOf([...WALL, ...BANTER]), nextPresence = bagOf(PRESENCE)
    async function play(ex: Exchange, prio: number) {
      if (busy && prio <= curPrio) return
      const mine = ++token
      busy = true; curPrio = prio; lastEx = performance.now()
      stopSpeaking()
      for (const line of ex) {
        if (mine !== token) return
        setCap({ who: line.who, text: line.text, k: ++kk })
        await Promise.all([speak(line.text, { voice: line.who ? "marv" : "jet" }), sleep(Math.max(1700, line.text.length * 45))])
        if (line.cue === "anthem") { fx.anthem(); }
        if (line.wait) await sleep(line.wait)
        await sleep(200)
      }
      if (mine === token) { busy = false; curPrio = 0; lastEx = performance.now() }
    }
    preloadSpeech("jet", OPENING.filter((l) => !l.who).map((l) => l.text))
    const openTimer = setTimeout(() => play([...OPENING, ...ANTHEM], 2), 1200)
    const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]
    const bounceColor = () => { colorIdx = (colorIdx + 1 + Math.floor(Math.random() * 5)) % COLORS.length; setColor(COLORS[colorIdx]) }

    const burst = () => {
      const c = canvas.current
      if (!c) return
      const cx = x + LOGO_W / 2, cy = y + LOGO_H / 2
      for (let i = 0; i < 260; i++) {
        const a = Math.random() * Math.PI * 2
        const v = 120 + Math.random() * 720
        sparks.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 200, r: 3 + Math.random() * 5, c: pick(COLORS), rot: Math.random() * 6, vr: (Math.random() - 0.5) * 14, life: 3 + Math.random() * 3 })
      }
    }

    const corner = () => {
      x = x < W / 2 ? 0 : W; y = y < H / 2 ? 0 : H // snap exactly into the corner
      dx = x === 0 ? 1 : -1; dy = y === 0 ? 1 : -1
      hits++
      paused = 5.5
      bounceColor()
      burst()
      fx.airhorn(3); fx.roar(); setTimeout(() => fx.applause(true), 4200); fx.confetti()
      setFlash({ text: "CORNER!!!", kind: "hit" })
      play(nextHit(), 9)
      setAlert(false)
      setTimeout(() => setFlash(null), 5200)
      plan = planHit(x, y, dx, dy, W, H, 85 + Math.random() * 50)
    }

    const wallHit = (axis: "x" | "y") => {
      walls++
      bounceColor()
      sfx.click()
      const other = axis === "x" ? Math.min(y, H - y) : Math.min(x, W - x)
      if (other < 14) { corner(); return }
      if (other < 80) {
        miss++
        fx.gasp(); setTimeout(() => (Math.random() < 0.35 ? fx.boo() : fx.groan(Math.random() < 0.5)), 700)
        setFlash({ text: `SO CLOSE  (${Math.round(other)}px)`, kind: "miss" })
        play(nextMiss(), 6)
        setTimeout(() => setFlash((f) => (f?.kind === "miss" ? null : f)), 1700)
      } else if (!busy && performance.now() - lastEx > 6000) { play(nextWall(), 1); if (Math.random() < 0.3) (Math.random() < 0.5 ? fx.cheer(2) : fx.murmur(2)) }
    }

    let lastInput = performance.now()
    const onFirstInput = () => {
      const nowT = performance.now()
      const idle = nowT - lastInput
      lastInput = nowT
      if (interacted && idle < 45000) return
      interacted = true
      if (nowT - startedAt < 6000) return
      // Someone just came back to the screen: the corner is coming. Right now.
      plan = planHit(x, y, dx, dy, W, H, 9)
      tenseUntil = performance.now() + 9000
      setAlert(true)
      play(Math.random() < 0.3 ? nextPresence() : nextTense(), 8)
      fx.ooh(); fx.murmur(8)
    }
    const evs = ["mousemove", "pointerdown", "keydown", "touchstart"] as const
    evs.forEach((e) => window.addEventListener(e, onFirstInput, { once: false, passive: true }))

    const onResize = () => {
      W = innerWidth - LOGO_W; H = innerHeight - LOGO_H
      x = Math.min(x, W); y = Math.min(y, H)
      if (canvas.current) { canvas.current.width = innerWidth; canvas.current.height = innerHeight }
      plan = planHit(x, y, dx, dy, W, H, 80)
    }
    window.addEventListener("resize", onResize)
    if (canvas.current) { canvas.current.width = innerWidth; canvas.current.height = innerHeight }

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (paused > 0) paused -= dt
      else {
        x += dx * plan.sx * dt
        y += dy * plan.sy * dt
        if (x <= 0) { x = 0; dx = 1; wallHit("x") } else if (x >= W) { x = W; dx = -1; wallHit("x") }
        if (paused <= 0) {
          if (y <= 0) { y = 0; dy = 1; wallHit("y") } else if (y >= H) { y = H; dy = -1; wallHit("y") }
        }
      }
      if (logo.current) logo.current.style.transform = `translate(${x}px, ${y}px) scale(${paused > 0 ? 1.12 + Math.sin(now / 90) * 0.04 : 1})`

      // corner glows
      const cs = [[0, 0], [W, 0], [0, H], [W, H]]
      cs.forEach(([cx, cy], i) => {
        const d = Math.hypot(x - cx, y - cy)
        const v = Math.max(0, 1 - d / 320)
        const el = cornerGlow.current[i]
        if (el) { el.style.opacity = String(Math.min(1, v * 1.4)); el.style.transform = `scale(${0.7 + v * 0.8})` }
      })

      // confetti
      const c = canvas.current
      if (c) {
        const g = c.getContext("2d")!
        g.clearRect(0, 0, c.width, c.height)
        for (let i = sparks.length - 1; i >= 0; i--) {
          const p = sparks[i]
          p.vy += 520 * dt; p.vx *= 0.992; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.life -= dt
          if (p.life <= 0 || p.y > c.height + 20) { sparks.splice(i, 1); continue }
          g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.globalAlpha = Math.min(1, p.life); g.fillStyle = p.c; g.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); g.restore()
        }
      }

      if (tenseUntil && now > tenseUntil + 12000) { tenseUntil = 0; setAlert(false) }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    const hudTimer = setInterval(() => {
      const prox = Math.hypot(Math.min(x, W - x), Math.min(y, H - y))
      setHud((h) => ({ hits, miss, walls, secs: Math.floor((performance.now() - startedAt) / 1000), prox: Math.round(prox), viewers: Math.max(1000, h.viewers + Math.round((Math.random() - 0.45) * 90)) }))
    }, 250)
    const idleTalk = setInterval(() => { if (!busy && performance.now() - lastEx > 11000 && paused <= 0) play(nextBanter(), 1) }, 4000)

    return () => {
      cancelAnimationFrame(raf); clearTimeout(openTimer); stopSpeaking()
      clearInterval(hudTimer); clearInterval(idleTalk)
      evs.forEach((e) => window.removeEventListener(e, onFirstInput))
      window.removeEventListener("resize", onResize)
    }
  }, [])

  const mm = String(Math.floor(hud.secs / 60)).padStart(2, "0")
  const ss = String(hud.secs % 60).padStart(2, "0")
  const hot = hud.prox < 200

  return (
    <FullscreenPrank exitMessage="THE CORNER WAS NEVER IN DANGER - IT WAS A PRANK!" className="cursor-none bg-[#04050b] font-sans text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#0e1230,#04050b_70%)]" />
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {[["left-0 top-0", "0% 0%"], ["right-0 top-0", "100% 0%"], ["bottom-0 left-0", "0% 100%"], ["bottom-0 right-0", "100% 100%"]].map(([pos, origin], i) => (
        <div key={i} ref={(el) => { cornerGlow.current[i] = el }} className={`pointer-events-none absolute ${pos} h-[34vmin] w-[34vmin] opacity-0`} style={{ transformOrigin: origin, background: `radial-gradient(circle at ${origin}, rgba(255,40,70,.85), rgba(255,40,70,0) 65%)` }} />
      ))}

      {/* HUD */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between px-5 py-3">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-bold tracking-[0.25em]"><span className="rounded bg-[#e11d48] px-2 py-0.5 text-[11px]">LIVE</span> SCREENSAVER SPORTS NETWORK</div>
          <p className="mt-1 text-[12px] text-white/55">{hud.viewers.toLocaleString()} watching</p>
        </div>
        <div className="flex gap-2 text-center">
          {[["CORNERS", hud.hits], ["NEAR MISSES", hud.miss], ["WALLS", hud.walls], ["TIME", `${mm}:${ss}`]].map(([k, v], i) => (
            <div key={k as string} className={`min-w-[72px] ${i === 1 || i === 2 ? "max-sm:hidden" : ""} rounded border border-white/15 bg-black/60 px-3 py-1.5`}>
              <p className="text-[9px] tracking-widest text-white/55">{k}</p>
              <p className="font-mono text-[22px] font-bold leading-none">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* The star of the show */}
      <div ref={logo} className="absolute left-0 top-0 z-[25] will-change-transform" style={{ width: LOGO_W, height: LOGO_H }}>
        <div className="grid h-full w-full place-items-center rounded-[48px] border-[5px] whitespace-nowrap text-[36px] font-black italic tracking-tight transition-colors duration-150" style={{ color, borderColor: color, boxShadow: `0 0 26px ${color}88, inset 0 0 18px ${color}44`, textShadow: `0 0 14px ${color}` }}>
          SCREENSAVER
        </div>
      </div>

      <canvas ref={canvas} className="pointer-events-none absolute inset-0 z-30" />

      {flash && (
        <div className="pointer-events-none absolute inset-x-0 top-[34%] z-40 text-center">
          <p key={flash.text} className={`inline-block font-black italic [animation:cw-pop_.35s_cubic-bezier(.2,1.6,.4,1)] ${flash.kind === "hit" ? "text-[clamp(60px,14vw,190px)] text-[#ffd400] [text-shadow:0_0_40px_#ff8a00,0_6px_0_#b45309]" : "text-[clamp(34px,6vw,80px)] text-[#ff3d71] [text-shadow:0_0_24px_#ff3d71]"}`}>{flash.text}</p>
        </div>
      )}

      {/* Proximity meter + lower third */}
      <div className="absolute bottom-0 inset-x-0 z-20">
        <div className="mx-5 mb-2 flex items-center justify-end gap-3 text-[11px] tracking-widest">
          {alert && <span className="animate-pulse font-bold text-[#ffd400]">CORNER ALERT</span>}
          <span className="text-white/55">CORNER PROXIMITY</span>
          <div className="h-2 w-44 overflow-hidden rounded bg-white/10"><div className="h-full transition-all duration-200" style={{ width: `${Math.max(3, 100 - Math.min(100, hud.prox / 6))}%`, background: hot ? "#ff3d71" : "#00e5ff" }} /></div>
          <span className={`w-14 text-right font-mono ${hot ? "font-bold text-[#ff3d71]" : "text-white/70"}`}>{hud.prox}px</span>
        </div>
        <div className="flex items-stretch border-t-2 border-[#e11d48] bg-[#0a0c18]">
          <div className="grid w-[150px] shrink-0 place-items-center px-3 text-center text-[11px] font-extrabold leading-tight tracking-widest text-black sm:w-[190px] sm:text-[12px]" style={{ background: cap ? COLORS_CAP[cap.who] : "#e11d48" }}>{cap ? NAMES[cap.who] : "LIVE"}</div>
          <p key={cap?.k ?? 0} className="flex-1 px-5 py-3 text-[clamp(14px,1.7vw,20px)] leading-snug [animation:cw-in_.4s_ease]">{cap?.text ?? "We are LIVE from the screensaver."}</p>
        </div>
      </div>

      <style>{`
        @keyframes cw-pop { from { transform: scale(.3); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes cw-in { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
      `}</style>
    </FullscreenPrank>
  )
}
