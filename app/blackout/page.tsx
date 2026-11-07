"use client"

import { useEffect, useState } from "react"
import { BLACKOUT_CHANNEL } from "@/lib/monitors"

type Fs = HTMLElement & { webkitRequestFullscreen?: () => void }

/** Plain dark page shown on the other monitors while a prank runs on the main one. */
export default function BlackoutPage() {
  const [color, setColor] = useState("#000")

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const c = params.get("c")
    if (c && /^#[0-9a-fA-F]{3,8}$/.test(c)) setColor(c)
    document.title = ""

    let channel: BroadcastChannel | null = null
    try {
      channel = new BroadcastChannel(BLACKOUT_CHANNEL)
      channel.onmessage = (e) => {
        if (e.data === "close") window.close()
      }
    } catch {
      channel = null
    }

    const goFullscreen = async () => {
      if (document.fullscreenElement) return
      const el = document.documentElement as Fs
      try {
        let opts: FullscreenOptions | undefined
        const w = window as Window & { getScreenDetails?: () => Promise<{ currentScreen: unknown }> }
        if (w.getScreenDetails) {
          try {
            const d = await w.getScreenDetails()
            opts = { screen: d.currentScreen } as FullscreenOptions
          } catch {
            /* use the current screen */
          }
        }
        if (el.requestFullscreen) await el.requestFullscreen(opts)
        else el.webkitRequestFullscreen?.()
      } catch {
        /* needs a click; handled below */
      }
    }

    const onMessage = (e: MessageEvent) => {
      if (e.origin === location.origin && e.data?.type === "fs") goFullscreen()
    }
    const exitAll = () => {
      try { channel?.postMessage("exit") } catch { /* ignore */ }
      window.close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "q" || e.key === "Q") exitAll()
      else goFullscreen()
    }
    let wasFs = false
    const onFsChange = () => {
      if (document.fullscreenElement) wasFs = true
      else if (wasFs) exitAll()
    }

    window.addEventListener("message", onMessage)
    window.addEventListener("keydown", onKey, true)
    document.addEventListener("pointerdown", goFullscreen, true)
    document.addEventListener("fullscreenchange", onFsChange)
    goFullscreen()
    return () => {
      window.removeEventListener("message", onMessage)
      window.removeEventListener("keydown", onKey, true)
      document.removeEventListener("pointerdown", goFullscreen, true)
      document.removeEventListener("fullscreenchange", onFsChange)
      channel?.close()
    }
  }, [])

  return <div className="fixed inset-0 cursor-none" style={{ background: color }} onContextMenu={(e) => e.preventDefault()} />
}
