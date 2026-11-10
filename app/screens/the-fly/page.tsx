"use client"

import { useEffect, useRef, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { fx } from "@/lib/fx"

const MAX_FLIES = 4

interface Fly {
  x: number; y: number; h: number; z: number
  state: "walk" | "stop" | "rub" | "fly"; until: number
  fx0: number; fy0: number; fx1: number; fy1: number; ft0: number; fdur: number; amp: number; freq: number
  moving: boolean; el: HTMLDivElement | null; shadow: HTMLDivElement | null; sprite: HTMLDivElement | null
  born: number
}

/** A real house fly, shown at about real size (~7 mm: roughly 30 CSS pixels on a normal screen). */
function FlySvg() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/art/fly.webp" width={27} height={30} alt="" draggable={false} className="block h-[30px] w-[27px] select-none" />
}

const ease = (u: number) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2)

export default function TheFly() {
  const [count, setCount] = useState(1)
  const [scold, setScold] = useState("")
  const els = useRef<(HTMLDivElement | null)[]>([])
  const shadows = useRef<(HTMLDivElement | null)[]>([])
  const sprites = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let W = innerWidth, H = innerHeight
    const onResize = () => { W = innerWidth; H = innerHeight }
    addEventListener("resize", onResize)
    let mx = -999, my = -999, lastMove = 0, mSpeed = 0, lastClickNear = 0, nearClicks = 0, pmx = 0, pmy = 0
    const onMove = (e: PointerEvent) => {
      const t = performance.now()
      mSpeed = Math.hypot(e.clientX - pmx, e.clientY - pmy) / Math.max(1, t - lastMove) * 1000
      pmx = e.clientX; pmy = e.clientY
      mx = e.clientX; my = e.clientY; lastMove = t
    }
    const flies: Fly[] = Array.from({ length: MAX_FLIES }, (_, i) => ({
      x: W * (0.3 + 0.4 * Math.random()), y: H * (0.25 + 0.4 * Math.random()), h: Math.random() * 6.28, z: 0,
      state: "stop", until: 1.2 + i, fx0: 0, fy0: 0, fx1: 0, fy1: 0, ft0: 0, fdur: 1, amp: 40, freq: 3,
      moving: false, el: null, shadow: null, sprite: null, born: i === 0 ? 0 : i === 1 ? 55 : i === 2 ? 110 : 170,
    }))
    flies.forEach((f, i) => { f.el = els.current[i]; f.shadow = shadows.current[i]; f.sprite = sprites.current[i] })

    const takeoff = (f: Fly, T: number, tx?: number, ty?: number) => {
      f.state = "fly"; f.fx0 = f.x; f.fy0 = f.y
      if (tx === undefined || ty === undefined) {
        let a = 0
        do { tx = 40 + Math.random() * (W - 80); ty = 40 + Math.random() * (H - 80); a++ } while (Math.hypot(tx - f.x, ty - f.y) < 260 && a < 8)
      }
      f.fx1 = tx; f.fy1 = ty!
      const d = Math.hypot(f.fx1 - f.fx0, f.fy1 - f.fy0)
      f.fdur = Math.max(0.7, d / 520 + 0.3); f.ft0 = T; f.amp = 30 + Math.random() * 70; f.freq = 2 + Math.random() * 3
      fx.buzz(f.fdur)
    }
    const onDown = (e: PointerEvent) => {
      const T = performance.now() / 1000
      for (const f of flies) {
        if (f.born > T - startT) continue
        if (Math.hypot(f.x - e.clientX, f.y - e.clientY) < 34) {
          nearClicks++; lastClickNear = T
          takeoff(f, T)
          if (nearClicks === 3) { setScold("Please do not hit your monitor."); setTimeout(() => setScold(""), 3600) }
          if (nearClicks === 7) { setScold("The fly is fine. The monitor is not."); setTimeout(() => setScold(""), 3600) }
        }
      }
    }
    addEventListener("pointermove", onMove, { passive: true })
    addEventListener("pointerdown", onDown, { passive: true })

    const startT = performance.now() / 1000
    let last = performance.now(), raf = 0, shown = 1
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now
      const T = now / 1000
      const age = T - startT
      const want = flies.filter((f) => f.born <= age).length
      if (want !== shown) { shown = want; setCount(want) }
      flies.forEach((f, i) => {
        if (!f.el) return
        if (f.born > age) { f.el.style.opacity = "0"; return }
        f.el.style.opacity = "1"
        const idleMouse = now - lastMove > 5000
        const pd = Math.hypot(f.x - mx, f.y - my)
        if (f.state === "fly") {
          const u = Math.min(1, (T - f.ft0) / f.fdur)
          const e = ease(u)
          const dx = f.fx1 - f.fx0, dy = f.fy1 - f.fy0, len = Math.hypot(dx, dy) || 1
          const nx = -dy / len, ny = dx / len
          const wob = Math.sin(u * Math.PI * f.freq) * f.amp * Math.sin(u * Math.PI)
          const nx2 = f.fx0 + dx * e + nx * wob, ny2 = f.fy0 + dy * e + ny * wob
          const vx = nx2 - f.x, vy = ny2 - f.y
          if (Math.hypot(vx, vy) > 0.5) f.h = Math.atan2(vy, vx)
          f.x = nx2; f.y = ny2
          f.z = Math.sin(u * Math.PI)
          if (u >= 1) { f.state = "stop"; f.until = T + 0.5 + Math.random() * 2; f.z = 0 }
        } else if (f.state === "walk") {
          f.h += (Math.random() - 0.5) * 3.2 * dt
          const sp = 58 + Math.sin(T * 5 + i) * 10
          f.x += Math.cos(f.h) * sp * dt; f.y += Math.sin(f.h) * sp * dt
          if (f.x < 24 || f.x > W - 24 || f.y < 24 || f.y > H - 24) { f.h = Math.atan2(H / 2 - f.y, W / 2 - f.x) + (Math.random() - 0.5) * 0.8 }
          if (T > f.until) { f.state = "stop"; f.until = T + 0.4 + Math.random() * 2.4 }
          if (pd < 90 && mSpeed > 500 && now - lastMove < 300) takeoff(f, T)
        } else if (f.state === "stop") {
          if (T > f.until) {
            const r = Math.random()
            if (idleMouse && nearClicks >= 2 && r < 0.5) takeoff(f, T, mx, my) // returns to sit on the cursor
            else if (r < 0.34) { f.state = "rub"; f.until = T + 1.6 + Math.random() * 1.6 }
            else if (r < 0.46) takeoff(f, T)
            else { f.state = "walk"; f.until = T + 0.3 + Math.random() * 1.3 }
          }
          if (pd < 60 && mSpeed > 300 && now - lastMove < 300) takeoff(f, T)
        } else if (f.state === "rub") {
          if (T > f.until) { f.state = "stop"; f.until = T + 0.3 + Math.random() }
          if (pd < 70 && mSpeed > 300 && now - lastMove < 300) takeoff(f, T)
        }
        f.moving = f.state === "walk" || f.state === "fly"
        f.el.style.transform = `translate(${f.x - 15}px, ${f.y - 15}px)`
        if (f.sprite) {
          f.sprite.style.transform = `rotate(${f.h + Math.PI / 2}rad) scale(${1 + f.z * 0.55})`
          f.sprite.dataset.s = f.state
        }
        if (f.shadow) {
          f.shadow.style.transform = `translate(${6 + f.z * 26}px, ${8 + f.z * 30}px) rotate(${f.h + Math.PI / 2}rad) scale(${1 + f.z * 0.5})`
          f.shadow.style.opacity = String(0.22 - f.z * 0.12)
        }
      })
      void lastClickNear
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", onResize); removeEventListener("pointermove", onMove); removeEventListener("pointerdown", onDown) }
  }, [])

  return (
    <FullscreenPrank exitMessage="THE FLY HAS BEEN RELEASED INTO THE WILD - IT WAS A PRANK!" className="cursor-default overflow-hidden bg-[#f1f3f4] font-sans text-[#202124]">
      {/* a very boring document */}
      <div className="absolute inset-x-0 top-0 z-0 border-b border-[#dadce0] bg-white">
        <div className="flex items-center gap-3 px-4 py-2 text-[13px]">
          <span className="grid h-8 w-6 place-items-center rounded-sm bg-[#4285f4] text-[11px] font-bold text-white">≡</span>
          <span className="text-[16px]">Q3 Budget Review (Draft 4)</span>
          <span className="text-[#5f6368]">· Saved to Drive</span>
        </div>
        <div className="flex gap-5 px-4 pb-1.5 text-[13px] text-[#444]"><span>File</span><span>Edit</span><span>View</span><span>Insert</span><span>Format</span><span>Tools</span></div>
      </div>
      <div className="absolute inset-x-0 bottom-0 top-[78px] overflow-hidden">
        <article className="mx-auto mt-6 w-[min(820px,94vw)] bg-white px-[clamp(24px,6vw,80px)] py-[clamp(24px,5vw,64px)] shadow-[0_1px_4px_rgba(0,0,0,.25)]">
          <h1 className="text-[clamp(22px,3vw,32px)] font-semibold">Quarterly Budget Review</h1>
          <p className="mb-5 mt-1 text-[14px] text-[#5f6368]">Prepared for the Leadership Team · Draft 4 (supersedes Drafts 1 to 3 and, spiritually, Draft 2)</p>
          <p className="mb-4 text-[15px] leading-relaxed">Overall spend tracked three percent above forecast this quarter, driven primarily by software subscriptions, the temporary contractor who is no longer temporary, and a coffee machine that was described in the request as essential infrastructure.</p>
          <p className="mb-4 text-[15px] leading-relaxed">Headcount remained flat. Morale remained flat. The only figure that moved was the printing budget, which moved in a direction the finance team has chosen to describe as unexpected.</p>
          <table className="mb-4 w-full border-collapse text-[14px]">
            <thead><tr className="bg-[#f1f3f4] text-left"><th className="border border-[#dadce0] p-2">Category</th><th className="border border-[#dadce0] p-2">Q2</th><th className="border border-[#dadce0] p-2">Q3</th><th className="border border-[#dadce0] p-2">Variance</th></tr></thead>
            <tbody>
              {[["Software", "$41,200", "$44,900", "+9.0%"], ["Contractors", "$18,000", "$18,000", "0.0%"], ["Coffee", "$1,100", "$3,640", "+230.9%"], ["Printing", "$800", "$2,950", "+268.8%"], ["Miscellaneous", "$2,400", "$2,411", "Do not ask"]].map((r) => (
                <tr key={r[0]}>{r.map((c, i) => <td key={i} className="border border-[#dadce0] p-2">{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
          <p className="mb-4 text-[15px] leading-relaxed">Looking ahead to Q4, we recommend a cautious approach to new spending, a firm approach to the coffee machine, and an extremely gentle approach to anyone who has opinions about the printer.</p>
          <p className="text-[15px] leading-relaxed">Action items: review the contractor, review the review, and circle back on the circle back. Owner: TBD. Due: soon.</p>
        </article>
      </div>

      {Array.from({ length: MAX_FLIES }, (_, i) => (
        <div key={i} ref={(el) => { els.current[i] = el }} className="pointer-events-none absolute left-0 top-0 z-10 h-[30px] w-[30px] opacity-0 will-change-transform">
          <div ref={(el) => { shadows.current[i] = el }} className="absolute inset-0 origin-center"><div className="grid h-full w-full scale-90 place-items-center blur-[2px] [filter:brightness(0)_blur(2px)]"><FlySvg /></div></div>
          <div ref={(el) => { sprites.current[i] = el }} className="fl-sprite absolute inset-0 grid origin-center place-items-center"><FlySvg /></div>
        </div>
      ))}
      {scold && <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded bg-[#323232] px-4 py-2 text-[14px] text-white shadow-lg">{scold}</div>}
      <span className="sr-only">{count} fly</span>
      <style>{`
        .fl-sprite[data-s="fly"] img { animation: fl-buzz .035s linear infinite alternate; filter: blur(.6px); }
        .fl-sprite[data-s="walk"] img { animation: fl-step .16s linear infinite alternate; }
        .fl-sprite[data-s="rub"] img { animation: fl-rub .12s linear infinite alternate; transform-origin: 50% 25%; }
        @keyframes fl-buzz { from { transform: scale(1, 1) } to { transform: scale(1.07, .93) } }
        @keyframes fl-step { from { transform: translateX(-.5px) rotate(-1.5deg) } to { transform: translateX(.5px) rotate(1.5deg) } }
        @keyframes fl-rub { from { transform: rotate(-4deg) scale(1.01) } to { transform: rotate(4deg) scale(.99) } }
      `}</style>
    </FullscreenPrank>
  )
}
