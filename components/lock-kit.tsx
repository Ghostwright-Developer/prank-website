"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/** Generic user silhouette (no real person). */
export function Avatar({ size = 96, bg = "#8a94a6", fg = "#fff", className = "" }: { size?: number; bg?: string; fg?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="50" fill={bg} />
      <circle cx="50" cy="38" r="18" fill={fg} />
      <path d="M14 90c4-22 20-30 36-30s32 8 36 30a50 50 0 01-72 0z" fill={fg} />
    </svg>
  )
}

interface LoginOptions {
  /** Message after a wrong attempt. */
  wrong: string
  /** Lock out after this many wrong attempts (default 5). */
  lockAfter?: number
  /** Message while locked out. */
  locked?: (secondsLeft: number) => string
  lockSeconds?: number
}

/** Password/PIN state that never accepts: wrong message, shake, then a lockout. */
export function useLogin({ wrong, lockAfter = 5, locked, lockSeconds = 60 }: LoginOptions) {
  const [value, setValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [shake, setShake] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [lockLeft, setLockLeft] = useState(0)

  useEffect(() => {
    if (lockLeft <= 0) return
    const t = setTimeout(() => setLockLeft((n) => n - 1), 1000)
    return () => clearTimeout(t)
  }, [lockLeft])

  const submit = useCallback(
    (v?: string) => {
      const entered = v ?? value
      if (lockLeft > 0 || !entered) return
      const n = attempts + 1
      setAttempts(n)
      setValue("")
      setShake((s) => s + 1)
      if (n % lockAfter === 0) {
        setLockLeft(lockSeconds)
        setError(null)
      } else {
        setError(wrong)
      }
    },
    [value, lockLeft, attempts, lockAfter, lockSeconds, wrong],
  )

  const message = lockLeft > 0 ? (locked ? locked(lockLeft) : `Try again in ${lockLeft}s`) : error
  return { value, setValue, submit, message, shake, locked: lockLeft > 0, lockLeft, attempts }
}

/** True after the first click, tap or key press (Esc/Q excluded so exit still works). */
export function useWake(): [boolean, () => void] {
  const [awake, setAwake] = useState(false)
  const awakeRef = useRef(false)
  useEffect(() => {
    const wake = (e: Event) => {
      if (e.type === "keydown") {
        const k = (e as KeyboardEvent).key
        if (k === "Escape" || k === "q" || k === "Q") return
      }
      if (!awakeRef.current) { awakeRef.current = true; setAwake(true) }
    }
    const ev = ["pointerdown", "keydown"] as const
    ev.forEach((t) => window.addEventListener(t, wake))
    return () => ev.forEach((t) => window.removeEventListener(t, wake))
  }, [])
  return [awake, () => { awakeRef.current = false; setAwake(false) }]
}

/** Simple keypad used by phone lock screens. */
export function Keypad({ onDigit, onDelete, light = true, size = 76 }: { onDigit: (d: string) => void; onDelete: () => void; light?: boolean; size?: number }) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"]
  const sub: Record<string, string> = { "2": "ABC", "3": "DEF", "4": "GHI", "5": "JKL", "6": "MNO", "7": "PQRS", "8": "TUV", "9": "WXYZ" }
  return (
    <div className="grid grid-cols-3 gap-x-5 gap-y-4">
      {keys.map((k, i) =>
        k === "" ? <span key={i} /> : (
          <button
            key={i}
            onClick={() => (k === "⌫" ? onDelete() : onDigit(k))}
            className={`grid place-items-center rounded-full text-center transition-colors ${k === "⌫" ? "text-[22px]" : light ? "bg-white/20 hover:bg-white/35 active:bg-white/50" : "bg-black/10 hover:bg-black/20"} text-white`}
            style={{ width: size, height: size }}
          >
            <span className="text-[30px] font-light leading-none">{k}</span>
            {sub[k] && <span className="-mt-3 text-[9px] font-semibold tracking-[0.18em]">{sub[k]}</span>}
          </button>
        ),
      )}
    </div>
  )
}

/** macOS Sonoma-style wallpaper. */
export function MacWallpaper() {
  return (
    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1600 900" aria-hidden="true">
      <defs>
        <linearGradient id="mw-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b2a7a" /><stop offset="0.45" stopColor="#c0507a" /><stop offset="0.75" stopColor="#f0985a" /><stop offset="1" stopColor="#f7c27a" />
        </linearGradient>
        <linearGradient id="mw-h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a5a9a" /><stop offset="1" stopColor="#3d2a68" /></linearGradient>
        <linearGradient id="mw-h2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a3f86" /><stop offset="1" stopColor="#241848" /></linearGradient>
        <linearGradient id="mw-h3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#35255f" /><stop offset="1" stopColor="#120c2a" /></linearGradient>
        <filter id="mw-b"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <rect width="1600" height="900" fill="url(#mw-sky)" />
      <circle cx="1200" cy="470" r="150" fill="#ffd9a0" opacity="0.55" filter="url(#mw-b)" />
      <path d="M0 520C200 440 420 470 640 520S1040 500 1600 430V900H0z" fill="url(#mw-h1)" />
      <path d="M0 620C260 540 520 600 800 640S1280 600 1600 560V900H0z" fill="url(#mw-h2)" />
      <path d="M0 740C300 680 600 740 900 760S1350 720 1600 700V900H0z" fill="url(#mw-h3)" />
    </svg>
  )
}

/** iOS-style flowing wallpaper. */
export function PhoneWallpaper({ variant = "ios" }: { variant?: "ios" | "android" }) {
  const stops = variant === "ios" ? ["#1b1f5e", "#6a3ac0", "#e85aa0"] : ["#07211f", "#0d5b52", "#2fa98c"]
  return (
    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 900 1600" aria-hidden="true">
      <defs>
        <linearGradient id={`pw-${variant}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={stops[0]} /><stop offset="0.55" stopColor={stops[1]} /><stop offset="1" stopColor={stops[2]} /></linearGradient>
        <filter id={`pb-${variant}`}><feGaussianBlur stdDeviation="40" /></filter>
      </defs>
      <rect width="900" height="1600" fill={`url(#pw-${variant})`} />
      <g filter={`url(#pb-${variant})`} opacity="0.8">
        <ellipse cx="200" cy="500" rx="300" ry="150" fill={stops[2]} transform="rotate(-30 200 500)" />
        <ellipse cx="700" cy="1000" rx="360" ry="170" fill={stops[1]} transform="rotate(25 700 1000)" />
        <ellipse cx="400" cy="1350" rx="320" ry="120" fill={stops[2]} opacity="0.7" />
      </g>
    </svg>
  )
}
