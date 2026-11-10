/**
 * Keeps the computer from dimming the screen, starting the screensaver, going to
 * sleep or auto-locking while a prank is on screen.
 *
 * Why this works: operating systems decide "idle" from keyboard/mouse input, but
 * they also honour requests from apps that are "presenting" (a video player, a
 * slideshow). A browser tab can make that request in two ways, and we use both:
 *
 *  1. The Screen Wake Lock API (Chrome/Edge 84+, Safari 16.4+, Firefox 126+). This
 *     is exactly what a video site uses. The browser asks the OS to keep the
 *     display awake (Windows: ES_DISPLAY_REQUIRED, macOS: a "prevent display sleep"
 *     assertion). It is released automatically when the tab is hidden, so we ask
 *     again whenever the tab becomes visible.
 *  2. A silent, 1-pixel looping video (the old "NoSleep" trick) for browsers
 *     without the API. Playing video also holds the screen awake.
 *
 * What it can NOT beat: a lid being closed, the power button, a locked-down work
 * laptop whose administrator forces a lock timer, "battery saver" modes that
 * refuse wake locks, or another tab/app taking focus.
 */

type WakeSentinel = { release: () => Promise<void>; addEventListener: (t: "release", cb: () => void) => void }
type WakeNavigator = Navigator & { wakeLock?: { request: (type: "screen") => Promise<WakeSentinel> } }

export function keepAwake(): () => void {
  let active = true
  let sentinel: WakeSentinel | null = null
  let video: HTMLVideoElement | null = null
  let canvasTimer: number | undefined
  let stream: MediaStream | null = null

  const acquire = async () => {
    if (!active || document.visibilityState !== "visible") return
    const wl = (navigator as WakeNavigator).wakeLock
    if (!wl || sentinel) return
    try {
      const s = await wl.request("screen")
      if (!active) { void s.release().catch(() => {}); return }
      sentinel = s
      s.addEventListener("release", () => { if (sentinel === s) sentinel = null })
    } catch {
      /* refused (battery saver, no permission): the video fallback below still runs */
    }
  }

  // Video fallback: a tiny canvas stream that changes a pixel twice a second.
  const startVideo = () => {
    if (!active || video) return
    try {
      const canvas = document.createElement("canvas")
      canvas.width = 16
      canvas.height = 16
      const g = canvas.getContext("2d")
      const cap = (canvas as HTMLCanvasElement & { captureStream?: (fps?: number) => MediaStream }).captureStream
      if (!g || !cap) return
      let n = 0
      const paint = () => { g.fillStyle = n++ % 2 ? "#010101" : "#000000"; g.fillRect(0, 0, 16, 16) }
      paint()
      stream = cap.call(canvas, 4)
      canvasTimer = window.setInterval(paint, 500)
      const v = document.createElement("video")
      v.setAttribute("playsinline", "")
      v.setAttribute("aria-hidden", "true")
      v.muted = true
      v.loop = true
      v.srcObject = stream
      v.style.cssText = "position:fixed;left:0;top:0;width:2px;height:2px;opacity:0.01;pointer-events:none;z-index:-1"
      document.body.appendChild(v)
      video = v
      void v.play().catch(() => {})
    } catch {
      /* unsupported */
    }
  }

  const onVisible = () => {
    if (document.visibilityState === "visible") {
      void acquire()
      if (video && video.paused) void video.play().catch(() => {})
    }
  }
  const onGesture = () => {
    void acquire()
    if (!video) startVideo()
    else if (video.paused) void video.play().catch(() => {})
  }

  void acquire()
  // The video fallback is only needed when the real API is missing.
  if (!(navigator as WakeNavigator).wakeLock) startVideo()

  document.addEventListener("visibilitychange", onVisible)
  const evs = ["pointerdown", "keydown", "touchend"] as const
  evs.forEach((e) => document.addEventListener(e, onGesture, { capture: true, passive: true }))

  return () => {
    active = false
    document.removeEventListener("visibilitychange", onVisible)
    evs.forEach((e) => document.removeEventListener(e, onGesture, true))
    if (canvasTimer) window.clearInterval(canvasTimer)
    try { stream?.getTracks().forEach((t) => t.stop()) } catch { /* ignore */ }
    if (video) { try { video.pause() } catch { /* ignore */ } video.remove(); video = null }
    if (sentinel) { void sentinel.release().catch(() => {}); sentinel = null }
  }
}
