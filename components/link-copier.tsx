"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Check, Link2, X } from "lucide-react"

const KEY = "pranksims:link-text"
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

async function writeClipboard(html: string | null, plain: string) {
  try {
    if (html && typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" }),
        }),
      ])
      return true
    }
    await navigator.clipboard.writeText(plain)
    return true
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const onCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      if (html) e.clipboardData?.setData("text/html", html)
      e.clipboardData?.setData("text/plain", plain)
    }
    document.addEventListener("copy", onCopy, { once: true })
    const ok = document.execCommand("copy")
    document.removeEventListener("copy", onCopy)
    return ok
  } catch {
    return false
  }
}

/**
 * A small bar: type the words people should see, and the prank link is copied
 * as a hyperlink on those words. Paste into email, Google Docs, Word, Slack,
 * Notion, LinkedIn and similar and only the words show; the address stays
 * hidden behind them. Places that only take plain text (texts, Discord)
 * receive the plain link, so there is a second button for that.
 */
export function LinkCopier({ getUrl, onClose, onCopied }: { getUrl: () => string; onClose: () => void; onCopied?: (kind: "rich" | "plain" | "md") => void }) {
  const [text, setText] = useState("")
  const [done, setDone] = useState<"rich" | "plain" | "md" | null>(null)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try { setText(localStorage.getItem(KEY) ?? "") } catch { /* ignore */ }
    input.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); onClose() } }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [onClose])

  const label = () => text.trim() || "Click here"
  const remember = () => { try { localStorage.setItem(KEY, text.trim()) } catch { /* ignore */ } }

  const finish = (kind: "rich" | "plain" | "md", ok: boolean) => {
    if (!ok) return
    onCopied?.(kind)
    remember()
    setDone(kind)
    setTimeout(onClose, 1400)
  }
  const rich = async () => { const url = getUrl(); finish("rich", await writeClipboard(`<a href="${esc(url)}">${esc(label())}</a>`, url)) }
  const plain = async () => finish("plain", await writeClipboard(null, getUrl()))
  const md = async () => finish("md", await writeClipboard(null, `[${label()}](${getUrl()})`))

  const bar = (
    <div className="fixed inset-x-0 bottom-6 z-[400] flex justify-center px-4" role="dialog" aria-label="Copy link as a hyperlink" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
      <div className="w-full max-w-xl rounded-2xl border border-zinc-500 bg-zinc-900 p-4 shadow-2xl shadow-black/60">
        <div className="mb-2 flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold text-white"><Link2 className="h-4 w-4 text-cyan-300" /> What should the link say?</p>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        {done ? (
          <p className="flex items-center gap-2 py-2 text-sm text-green-300"><Check className="h-4 w-4" /> {done === "rich" ? "Copied. Paste it into your email, doc or message: only your words show." : done === "md" ? "Copied as Markdown." : "Plain link copied."}</p>
        ) : (
          <>
            <input
              ref={input}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") void rich() }}
              maxLength={120}
              placeholder="e.g. Check out the photos from last weekend"
              className="h-11 w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 text-base text-white outline-none placeholder:text-zinc-500 focus:border-cyan-400"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={rich} className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-cyan-300">Copy hyperlink</button>
              <button onClick={plain} className="rounded-lg border border-zinc-500 bg-zinc-800 px-3 py-2 text-sm text-white hover:border-zinc-300">Copy plain link</button>
              <button onClick={md} className="rounded-lg border border-zinc-500 bg-zinc-800 px-3 py-2 text-sm text-white hover:border-zinc-300">Copy as Markdown</button>
            </div>
            <p className="mt-2 text-xs text-zinc-400">The hyperlink works in email, Google Docs, Word, Slack and Notion: they see your words, not the address. Texts and Discord only take a plain link.</p>
          </>
        )}
      </div>
    </div>
  )
  return createPortal(bar, document.body)
}
