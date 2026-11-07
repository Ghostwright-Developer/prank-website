"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function CopyButton({ text, label = "Copy address" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand("copy") } catch { /* ignore */ }
      ta.remove()
    }
    setDone(true)
    setTimeout(() => setDone(false), 2000)
  }
  return (
    <button onClick={copy} className="inline-flex items-center gap-2 rounded-lg border border-zinc-500 bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-zinc-300 hover:bg-zinc-700">
      {done ? <><Check className="h-4 w-4 text-green-400" /> Copied</> : <><Copy className="h-4 w-4" /> {label}</>}
    </button>
  )
}
