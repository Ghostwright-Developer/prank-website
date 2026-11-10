"use client"

import { useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { startLoop, unlockAudio, type LoopName } from "@/lib/sfx"

/** sessionStorage key read by <ExitNotice /> on the page we return to. */
export const EXIT_MESSAGE_KEY = "pranksims:exit-message"
/** Slug of the prank just left, so the page we return to can offer to send it. */
export const LAST_SCREEN_KEY = "pranksims:last-screen"
const DEFAULT_EXIT_MESSAGE = "PRANK OVER - IT WAS ONLY A JOKE!"

interface FullscreenPrankProps {
  children: React.ReactNode
  className?: string
  /** Shown briefly on the home page after the viewer exits (Esc, Q or leaving fullscreen). */
  exitMessage?: string
  /** Unused (kept so existing screens compile). */
  secondary?: string
  /** Optional ambient sound loop (synthesized, starts after the first click/tap/key). */
  sound?: LoopName
}

// Safari < 16.4 only ships the webkit-prefixed Fullscreen API.
type FsDocument = Document & {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
}
type FsElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void }

const getFullscreenElement = () => {
  const doc = document as FsDocument
  return document.fullscreenElement ?? doc.webkitFullscreenElement ?? null
}

const leaveFullscreen = () => {
  if (!getFullscreenElement()) return
  const doc = document as FsDocument
  try {
    const result = document.exitFullscreen
      ? document.exitFullscreen()
      : doc.webkitExitFullscreen?.()
    if (result && typeof (result as Promise<void>).catch === "function") {
      ;(result as Promise<void>).catch(() => {})
    }
  } catch {
    /* already out of fullscreen */
  }
}

export function FullscreenPrank({
  children,
  className = "",
  exitMessage,
  sound,
}: FullscreenPrankProps) {
  const router = useRouter()
  const exitingRef = useRef(false)
  const mountedRef = useRef(false)
  const exitMessageRef = useRef(exitMessage)
  exitMessageRef.current = exitMessage

  /**
   * Single exit path, used by Esc, Q and "viewer left fullscreen". Guarded so
   * overlapping triggers (e.g. exiting fullscreen fires `fullscreenchange`
   * after we already started leaving) only navigate once.
   */
  const exitPrank = useCallback(() => {
    if (exitingRef.current) return
    exitingRef.current = true
    try {
      sessionStorage.setItem(
        EXIT_MESSAGE_KEY,
        exitMessageRef.current ?? DEFAULT_EXIT_MESSAGE,
      )
      const slug = location.pathname.split("/")[2]
      if (slug) sessionStorage.setItem(LAST_SCREEN_KEY, slug)
    } catch {
      /* storage unavailable: the exit still works, only the toast is skipped */
    }
    leaveFullscreen()
    router.push("/")
  }, [router])

  useEffect(() => {
    mountedRef.current = true
    let wasFullscreen = !!getFullscreenElement()

    const requestFullscreen = () => {
      if (getFullscreenElement()) return
      const el = document.documentElement as FsElement
      try {
        const result = el.requestFullscreen
          ? el.requestFullscreen()
          : el.webkitRequestFullscreen?.()
        if (result && typeof (result as Promise<void>).catch === "function") {
          ;(result as Promise<void>).catch(() => {})
        }
      } catch {
        /* unsupported (e.g. iPhone Safari) or blocked: the prank still fills the page */
      }
    }

    // Browsers only allow fullscreen after a user gesture, so we try on load
    // (works when the viewer arrived by clicking a link) and again on the first
    // real gesture. mousemove / scroll / wheel never count as a gesture.
    const onGesture = (e: Event) => {
      if (e.type === "keydown" && isExitKey(e as KeyboardEvent)) return
      requestFullscreen()
      unlockAudio()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (isExitKey(e)) exitPrank()
    }

    // When fullscreen was active and is then left by any means (Esc, which many
    // browsers swallow before the page sees it, a swipe on mobile, the browser
    // UI, or F11) treat that as "exit the prank". That is what makes Esc feel
    // reliable even though the keydown never arrives in fullscreen.
    const onFullscreenChange = () => {
      if (getFullscreenElement()) {
        wasFullscreen = true
      } else if (wasFullscreen) {
        exitPrank()
      }
    }

    const gestureEvents = ["pointerdown", "mousedown", "click", "touchend", "keydown"] as const
    const removeGestureListeners = () =>
      gestureEvents.forEach((t) => document.removeEventListener(t, onGesture, true))

    gestureEvents.forEach((t) => document.addEventListener(t, onGesture, true))
    window.addEventListener("keydown", onKeyDown, true)
    document.addEventListener("fullscreenchange", onFullscreenChange)
    document.addEventListener("webkitfullscreenchange", onFullscreenChange)

    requestFullscreen()

    // ?d=SECONDS keeps the page black and silent for that long (set up a prank, walk away).
    let waitTimer: ReturnType<typeof setTimeout> | undefined
    let stopSound = () => {}
    const startSound = () => { if (sound) stopSound = startLoop(sound) }
    const waitSeconds = parseInt(new URLSearchParams(location.search).get("d") ?? "0", 10)
    if (waitSeconds > 0) {
      document.documentElement.classList.add("pk-wait")
      waitTimer = setTimeout(() => {
        document.documentElement.classList.remove("pk-wait")
        startSound()
      }, waitSeconds * 1000)
    } else {
      startSound()
    }

    return () => {
      if (waitTimer) clearTimeout(waitTimer)
      document.documentElement.classList.remove("pk-wait")
      stopSound()
      mountedRef.current = false
      removeGestureListeners()
      window.removeEventListener("keydown", onKeyDown, true)
      document.removeEventListener("fullscreenchange", onFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange)
      // If a screen navigates away by itself (its own button) never leave the
      // home page stuck in fullscreen. Deferred a tick so React Strict Mode's
      // simulated unmount/remount in development doesn't drop fullscreen.
      setTimeout(() => {
        if (!mountedRef.current) leaveFullscreen()
      }, 0)
    }
  }, [exitPrank, sound])

  return (
    <div
      className={`fixed inset-0 select-none overflow-hidden ${className}`}
      // A real OS error screen has no browser context menu.
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </div>
  )
}

function isExitKey(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey || e.altKey) return false
  if (e.key === "Escape") return true
  // While typing in a text field on the prank (e.g. a fake chat box), Q is just a letter.
  const t = e.target as HTMLElement | null
  if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return false
  return e.key === "q" || e.key === "Q"
}
