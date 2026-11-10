"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Check, Copy, Link2, Mail, MessageCircle, MessageSquare, Send, Share2, X } from "lucide-react"
import { LinkCopier } from "@/components/link-copier"

interface Props {
  /** Prank to send. Omit to share PrankSims itself. */
  slug?: string
  name?: string
  onClose: () => void
}

async function copyText(text: string) {
  try { await navigator.clipboard.writeText(text); return true } catch { /* fall back */ }
  try {
    const ta = document.createElement("textarea")
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand("copy")
    ta.remove()
    return ok
  } catch { return false }
}

/**
 * One tap to send. Sends the prank link itself with a neutral message (it must
 * not give the prank away), or, with no slug, PrankSims for sharing the site.
 */
export function ShareSheet({ slug, name, onClose }: Props) {
  const site = !slug
  const [text, setText] = useState(site ? "Free fake screen pranks, this is great" : "Check this out")
  const [copied, setCopied] = useState(false)
  const [hyperlink, setHyperlink] = useState(false)
  const [url, setUrl] = useState("")
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function"

  useEffect(() => { setUrl(site ? location.origin : `${location.origin}/screens/${slug}`) }, [site, slug])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); onClose() } }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [onClose])

  const msg = `${text} ${url}`.trim()
  const enc = encodeURIComponent
  const links: { label: string; href: string; icon: React.ReactNode; color: string }[] = [
    { label: "WhatsApp", href: `https://wa.me/?text=${enc(msg)}`, icon: <MessageCircle className="h-5 w-5" />, color: "bg-emerald-500" },
    { label: "Messages", href: `sms:?&body=${enc(msg)}`, icon: <MessageSquare className="h-5 w-5" />, color: "bg-green-500" },
    { label: "Telegram", href: `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}`, icon: <Send className="h-5 w-5" />, color: "bg-sky-500" },
    { label: "Email", href: `mailto:?subject=${enc(text)}&body=${enc(msg)}`, icon: <Mail className="h-5 w-5" />, color: "bg-indigo-500" },
  ]
  if (site) {
    links.push(
      { label: "Reddit", href: `https://www.reddit.com/submit?url=${enc(url)}&title=${enc("PrankSims: free fullscreen prank screens")}`, icon: <Share2 className="h-5 w-5" />, color: "bg-orange-500" },
      { label: "X", href: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`, icon: <Share2 className="h-5 w-5" />, color: "bg-zinc-600" },
    )
  }

  const doCopy = async () => { if (await copyText(url)) { setCopied(true); setTimeout(() => setCopied(false), 2200) } }
  const nativeShare = async () => { try { await navigator.share({ text, url }) } catch { /* cancelled */ } }

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Send this prank" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl border border-zinc-600 bg-zinc-900 p-5 shadow-2xl sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">{site ? "Share PrankSims" : `Send “${name}”`}</h2>
            <p className="mt-0.5 text-sm text-zinc-300">{site ? "Tell a friend about the site." : "They open the link and it starts straight away. The message doesn't give it away."}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        {canShare && (
          <button onClick={nativeShare} className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-base font-bold text-zinc-950 hover:bg-cyan-300"><Share2 className="h-5 w-5" /> Share…</button>
        )}

        <div className="grid grid-cols-4 gap-2 sm:grid-cols-4">
          {links.map((l) => (
            <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-1 py-3 text-xs text-zinc-100 hover:border-zinc-400">
              <span className={`grid h-10 w-10 place-items-center rounded-full text-white ${l.color}`}>{l.icon}</span>{l.label}
            </a>
          ))}
        </div>

        <label className="mt-4 block text-xs font-medium text-zinc-300">Message <span className="text-zinc-500">(change it if you like)</span>
          <input value={text} onChange={(e) => setText(e.target.value)} maxLength={140} className="mt-1 h-10 w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 text-sm text-white outline-none focus:border-cyan-400" />
        </label>

        <div className="mt-3 flex gap-2">
          <button onClick={doCopy} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-500 bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white hover:border-zinc-300">{copied ? <><Check className="h-4 w-4 text-green-400" /> Link copied</> : <><Copy className="h-4 w-4" /> Copy link</>}</button>
          <button onClick={() => setHyperlink(true)} className="flex items-center justify-center gap-2 rounded-xl border border-zinc-500 bg-zinc-800 px-4 py-2.5 text-sm text-white hover:border-zinc-300"><Link2 className="h-4 w-4" /> Hidden link</button>
        </div>
        <p className="mt-2 text-center text-[11px] text-zinc-400">Hidden link: type your own words and paste them into email or a doc so the address never shows.</p>
      </div>
      {hyperlink && <LinkCopier getUrl={() => url} onClose={() => setHyperlink(false)} />}
    </div>,
    document.body,
  )
}

/** Small "Share PrankSims" button for the site header and footer. */
export function SiteShareButton({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className={className || "inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-500 bg-zinc-800 px-6 py-3 font-semibold text-white transition-colors hover:border-zinc-300 hover:bg-zinc-700"}><Share2 className="h-4 w-4" /> Share PrankSims</button>
      {open && <ShareSheet onClose={() => setOpen(false)} />}
    </>
  )
}
