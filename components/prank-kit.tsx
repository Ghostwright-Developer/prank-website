"use client"

import { useEffect, useRef, useState } from "react"

export const pad2 = (n: number) => String(Math.max(0, Math.floor(n))).padStart(2, "0")

/**
 * Reveals `items` one at a time. `delay` is a fixed ms value or a function of the
 * item index / item. Safe by construction: it reads the item BEFORE calling
 * setState (the previous screens read a mutating index inside the state updater,
 * which ran after the index had moved past the end and crashed the page), and it
 * simply stops when the list is exhausted.
 */
export function useRevealedLines<T>(
  items: readonly T[],
  delay: number | ((index: number, item: T) => number) = 150,
  { start = true, startAfter = 0 }: { start?: boolean; startAfter?: number } = {},
): { visible: T[]; done: boolean } {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    const step = (i: number) => {
      if (cancelled || i >= items.length) return
      const wait = typeof delay === "function" ? delay(i, items[i]) : delay
      timer = setTimeout(() => {
        if (cancelled) return
        setCount(i + 1)
        step(i + 1)
      }, wait)
    }
    timer = setTimeout(() => step(0), startAfter)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start])
  return { visible: items.slice(0, count), done: count >= items.length }
}

/** Counts down from `seconds` to zero and stops at zero. */
export function useCountdown(seconds: number, tickMs = 1000): number {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    const id = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), tickMs)
    return () => clearInterval(id)
  }, [tickMs])
  return left
}

/** Formats seconds as DD:HH:MM:SS (days optional). */
export function formatDuration(totalSeconds: number, withDays = false): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return withDays ? `${pad2(d)}:${pad2(h)}:${pad2(m)}:${pad2(sec)}` : `${pad2(h + d * 24)}:${pad2(m)}:${pad2(sec)}`
}

interface ProgressOptions {
  /** Starting percent. */
  from?: number
  /** Percent the bar never passes (use 99 for "stuck at 99%"). */
  max?: number
  /** Average percent gained per second. */
  perSecond?: number
  /** Percentages where progress hesitates, like real installers. */
  stalls?: number[]
  tickMs?: number
}

/**
 * Believable progress: irregular steps, hesitation near "stall" percentages,
 * never exceeds `max`. Returns a float percent.
 */
export function useBelievableProgress({
  from = 0,
  max = 100,
  perSecond = 1.2,
  stalls = [],
  tickMs = 250,
}: ProgressOptions = {}): number {
  const [pct, setPct] = useState(from)
  const stallUntil = useRef(0)
  useEffect(() => {
    const id = setInterval(() => {
      setPct((p) => {
        if (p >= max) return max
        const now = Date.now()
        if (now < stallUntil.current) return p
        const next = Math.min(max, p + (perSecond * tickMs) / 1000 * (0.2 + Math.random() * 1.8))
        const hit = stalls.find((s) => p < s && next >= s)
        if (hit !== undefined) {
          stallUntil.current = now + 2500 + Math.random() * 5000
          return hit
        }
        return next
      })
    }, tickMs)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return pct
}

/** Blinking-cursor flag for terminal-style screens. */
export function useBlink(ms = 530): boolean {
  const [on, setOn] = useState(true)
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), ms)
    return () => clearInterval(id)
  }, [ms])
  return on
}

/** Windows-style orbiting dots spinner. */
export function WinSpinner({ size = 48, dot = 5, color = "#fff" }: { size?: number; dot?: number; color?: string }) {
  return (
    <div
      className="win-orbit"
      style={{ ["--s" as string]: `${size}px`, ["--d" as string]: `${dot}px`, ["--c" as string]: color }}
      aria-hidden="true"
    >
      <i /><i /><i /><i /><i />
    </div>
  )
}

/** Four-pane Windows 10/11 logo. */
export function Win10Logo({ size = 96, color = "#fff", gap = 4 }: { size?: number; color?: string; gap?: number }) {
  const half = (100 - gap) / 2
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <rect x="0" y="0" width={half} height={half} fill={color} />
      <rect x={half + gap} y="0" width={half} height={half} fill={color} />
      <rect x="0" y={half + gap} width={half} height={half} fill={color} />
      <rect x={half + gap} y={half + gap} width={half} height={half} fill={color} />
    </svg>
  )
}

/** Apple logo (simple-icons path, 24x24 viewBox). */
export function AppleLogo({ size = 80, color = "#000" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  )
}
