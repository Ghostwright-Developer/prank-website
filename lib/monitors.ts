/**
 * Multi-monitor support (Chromium only: Chrome, Edge, Brave, Opera).
 * Uses the Window Management API to put a black fullscreen page on every
 * display except the one showing the prank. The browser asks the viewer for
 * "manage windows on all your displays" permission once, and popups must be
 * allowed. Everything fails silently so single-monitor and other browsers are
 * unaffected.
 */
export const BLACKOUT_CHANNEL = "pranksims:blackout"

interface ScreenInfo {
  isPrimary?: boolean
  availLeft: number
  availTop: number
  availWidth: number
  availHeight: number
  left: number
  top: number
  width: number
  height: number
  label?: string
}
interface ScreenDetails {
  screens: ScreenInfo[]
  currentScreen: ScreenInfo
}
type WinWithDetails = Window & { getScreenDetails?: () => Promise<ScreenDetails> }

export function monitorsEnabled(): boolean {
  try {
    return new URLSearchParams(location.search).get("m") !== "0"
  } catch {
    return true
  }
}

export interface MonitorController {
  /** Call from a user-gesture handler; opens any blackout windows still missing. */
  arm(): void
  /** Close every blackout window. */
  close(): void
  dispose(): void
}

export function createMonitorController(opts: { color: string; onRemoteExit: () => void }): MonitorController {
  const w = window as WinWithDetails
  const noop: MonitorController = { arm() {}, close() {}, dispose() {} }
  if (!monitorsEnabled() || typeof w.getScreenDetails !== "function") return noop
  const extended = (screen as Screen & { isExtended?: boolean }).isExtended
  if (extended === false) return noop

  let channel: BroadcastChannel | null = null
  try {
    channel = new BroadcastChannel(BLACKOUT_CHANNEL)
    channel.onmessage = (e) => {
      if (e.data === "exit") opts.onRemoteExit()
    }
  } catch {
    channel = null
  }

  const popups = new Map<number, Window>()
  let details: ScreenDetails | null = null
  let asking = false
  let denied = false

  const openMissing = () => {
    if (!details) return
    const current = details.currentScreen
    details.screens.forEach((s, i) => {
      const same = s === current || (s.left === current.left && s.top === current.top)
      if (same) return
      const existing = popups.get(i)
      if (existing && !existing.closed) return
      const feats = `popup=yes,left=${s.availLeft},top=${s.availTop},width=${s.availWidth},height=${s.availHeight}`
      const url = `/blackout?c=${encodeURIComponent(opts.color)}&i=${i}`
      let win: Window | null = null
      try {
        win = window.open(url, `pranksims-blackout-${i}`, feats)
      } catch {
        win = null
      }
      if (win) {
        popups.set(i, win)
        try {
          // Hand our fullscreen permission to the popup where the browser supports it.
          ;(win as Window).postMessage({ type: "fs" }, { targetOrigin: location.origin, delegate: "fullscreen" } as WindowPostMessageOptions)
        } catch {
          /* popup will go fullscreen on its first click instead */
        }
        try {
          win.moveTo(s.availLeft, s.availTop)
          win.resizeTo(s.availWidth, s.availHeight)
        } catch {
          /* ignore */
        }
      }
    })
    // Refocus the prank so it stays the active window.
    try { window.focus() } catch { /* ignore */ }
  }

  return {
    arm() {
      if (denied) return
      if (details) {
        openMissing()
        return
      }
      if (asking) return
      asking = true
      w.getScreenDetails!()
        .then((d) => {
          details = d
          if (d.screens.length < 2) return
          openMissing()
        })
        .catch(() => {
          denied = true
        })
        .finally(() => {
          asking = false
        })
    },
    close() {
      try { channel?.postMessage("close") } catch { /* ignore */ }
      popups.forEach((p) => { try { p.close() } catch { /* ignore */ } })
      popups.clear()
    },
    dispose() {
      this.close()
      try { channel?.close() } catch { /* ignore */ }
    },
  }
}
