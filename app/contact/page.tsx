import "@/components/cyber.css"
import Link from "next/link"
import { ArrowLeft, Bug, Lightbulb, Mail, MessageSquare } from "lucide-react"
import { CopyButton } from "@/components/copy-button"

const EMAIL = "owen@ghostwrightweb.com"

const mailto = (subject: string, body: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

const TOPICS = [
  {
    icon: Lightbulb,
    title: "Suggest a prank screen",
    text: "A fake screen you wish existed, or a real one we got wrong.",
    href: mailto("[PrankSims] Screen idea", "Screen or OS I'd like to see:\n\nWhat it should look like and do:\n\nAnything I should know (version, era, device):\n"),
  },
  {
    icon: Bug,
    title: "Report a bug",
    text: "Something crashed, looks broken, or won't go fullscreen.",
    href: mailto("[PrankSims] Bug report", "Which screen or page:\n\nWhat happened:\n\nMy device and browser (e.g. Windows 11, Chrome):\n"),
  },
  {
    icon: MessageSquare,
    title: "Something else",
    text: "Feedback, press, partnerships, or just telling me how it went.",
    href: mailto("[PrankSims] Message", "What's on your mind:\n"),
  },
]

export default function ContactPage() {
  return (
    <main className="cy min-h-screen bg-[#0a0a0f] text-white">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-zinc-300 hover:text-cyan-300"><ArrowLeft className="h-4 w-4" /> Back to Home</Link>

        <header className="mb-8">
          <h1 className="font-[family-name:var(--font-orbitron)] text-3xl font-bold md:text-4xl">Contact &amp; Suggest a Screen</h1>
          <p className="mt-3 text-lg leading-relaxed text-zinc-300">
            Got an idea for a new prank screen, found a bug, or want to tell me how a prank went? Email me directly. I read everything.
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-cyan-500/40 bg-zinc-900 p-6">
          <div className="flex items-center gap-3 text-zinc-300"><Mail className="h-5 w-5 text-cyan-300" /> Email</div>
          <a href={`mailto:${EMAIL}?subject=${encodeURIComponent("[PrankSims] Message")}`} className="mt-2 block break-all text-2xl font-semibold text-cyan-300 hover:text-cyan-200 sm:text-3xl">{EMAIL}</a>
          <div className="mt-4 flex flex-wrap gap-3"><CopyButton text={EMAIL} /></div>
          <p className="mt-5 rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-4 text-[15px] leading-relaxed text-yellow-100">
            <b>Please put “PrankSims” in the subject line</b> (for example “PrankSims: new screen idea”), and mention which screen or page you were on. That way I know your email is about this site and can find it fast.
          </p>
        </section>

        <h2 className="mb-4 text-lg font-semibold text-zinc-100">Or pick a topic and your email app opens with the subject filled in:</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {TOPICS.map(({ icon: Icon, title, text, href }) => (
            <a key={title} href={href} className="group rounded-xl border border-zinc-600/70 bg-zinc-900 p-5 transition-colors hover:border-cyan-400/70">
              <Icon className="mb-3 h-6 w-6 text-cyan-300" />
              <div className="font-semibold text-white">{title}</div>
              <p className="mt-1 text-sm leading-snug text-zinc-300">{text}</p>
            </a>
          ))}
        </div>
        <p className="mt-6 text-sm text-zinc-400">If a button does nothing, your browser has no email app set up. Copy the address above and paste it into Gmail, Outlook or whatever you use.</p>
      </div>
    </main>
  )
}
