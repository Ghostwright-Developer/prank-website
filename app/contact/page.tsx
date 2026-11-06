"use client"

import { useState, useRef, FormEvent, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Send, Lightbulb, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

type FormStatus = "idle" | "sending" | "success" | "error"

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<FormStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [loadTime, setLoadTime] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const MAX_CHARS = 2000

  // Record when the form was loaded — sent to server for timing check
  useEffect(() => {
    setLoadTime(Date.now())
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return
    setStatus("sending")
    setErrorMessage("")

    const fd = new FormData(formRef.current)

    const payload = {
      from_name:    fd.get("from_name")    as string,
      reply_to:     fd.get("reply_to")     as string,
      message_body: fd.get("message_body") as string,
      signature:    fd.get("signature")    as string,
      _hp:          fd.get("_hp")          as string,  // honeypot
      _t:           String(loadTime),                  // load timestamp
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setStatus("success")
        formRef.current.reset()
        setCharCount(0)
      } else {
        const data = await res.json().catch(() => ({}))
        setStatus("error")
        setErrorMessage(
          data.error ?? "Failed to send message. Please try again later."
        )
      }
    } catch {
      setStatus("error")
      setErrorMessage("Failed to send message. Please try again later.")
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-zinc-100 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Glow effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-cyan-400 transition-colors mb-12 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Pranks
        </Link>

        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-sm text-yellow-400 mb-6">
            <Lightbulb className="h-4 w-4" />
            <span>Share Your Ideas</span>
          </div>

          <h1 className="mb-4 text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-orbitron)]">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Contact
            </span>
            <span className="text-white"> Us</span>
          </h1>

          <p className="mx-auto max-w-xl text-zinc-400 leading-relaxed">
            Got a brilliant idea for a new prank screen? Found a bug? Or just want to share how
            perfectly you pranked your coworker? We want to hear it all.
          </p>
        </header>

        {/* Success state */}
        {status === "success" && (
          <div className="mb-8 rounded-xl border border-green-500/30 bg-green-950/30 backdrop-blur-sm p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-400 mb-2">Message Sent!</h3>
            <p className="text-sm text-zinc-400">
              Thanks for reaching out! We&apos;ll get back to you if needed.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-sm text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Send another message
            </button>
          </div>
        )}

        {/* Contact form */}
        {status !== "success" && (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm p-8 space-y-6"
          >
            {/* Error banner */}
            {status === "error" && (
              <div className="rounded-lg border border-red-500/30 bg-red-950/30 p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                <p className="text-sm text-red-300">{errorMessage}</p>
              </div>
            )}

            {/* Honeypot — visually hidden, never filled by real users */}
            <div aria-hidden="true" className="absolute opacity-0 pointer-events-none h-0 overflow-hidden" tabIndex={-1}>
              <label htmlFor="_hp">Leave this empty</label>
              <input type="text" id="_hp" name="_hp" autoComplete="off" tabIndex={-1} />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="from_name" className="block text-sm font-medium text-zinc-300">
                Your Name
              </label>
              <input
                type="text"
                id="from_name"
                name="from_name"
                required
                maxLength={100}
                disabled={status === "sending"}
                placeholder="Anonymous Prankster"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors disabled:opacity-50"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="reply_to" className="block text-sm font-medium text-zinc-300">
                Email Address
              </label>
              <input
                type="email"
                id="reply_to"
                name="reply_to"
                required
                maxLength={254}
                disabled={status === "sending"}
                placeholder="prankmaster@example.com"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors disabled:opacity-50"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="message_body" className="block text-sm font-medium text-zinc-300">
                  Your Message
                </label>
                <span className={`text-xs ${charCount > MAX_CHARS * 0.9 ? "text-yellow-400" : "text-zinc-500"}`}>
                  {charCount}/{MAX_CHARS}
                </span>
              </div>
              <textarea
                id="message_body"
                name="message_body"
                required
                disabled={status === "sending"}
                rows={6}
                maxLength={MAX_CHARS}
                onChange={(e) => setCharCount(e.target.value.length)}
                placeholder="I have this amazing idea for a prank screen..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors resize-none disabled:opacity-50"
              />
            </div>

            {/* Signature */}
            <div className="space-y-2">
              <label htmlFor="signature" className="block text-sm font-medium text-zinc-300">
                Signature <span className="text-zinc-500">(optional)</span>
              </label>
              <input
                type="text"
                id="signature"
                name="signature"
                disabled={status === "sending"}
                maxLength={100}
                placeholder="- The Ultimate Prankster"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors disabled:opacity-50"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:from-cyan-400 hover:to-blue-500 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        )}

        {/* Ideas prompts */}
        <div className="mt-12 rounded-xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm p-6">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Need inspiration? Tell us about:</h3>
          <ul className="space-y-2 text-sm text-zinc-500">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">-</span>
              A retro OS you&apos;d love to see a fake crash screen for
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400">-</span>
              A funny fake error message or warning popup
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">-</span>
              Your epic prank stories (we love hearing these!)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">-</span>
              Bugs you&apos;ve found or improvements we could make
            </li>
          </ul>
        </div>

        <footer className="mt-12 text-center text-sm text-zinc-600">
          <p>We read every message and appreciate your feedback!</p>
        </footer>
      </div>
    </main>
  )
}
