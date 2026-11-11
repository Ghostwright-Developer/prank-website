import "@/components/cyber.css"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CookieSettingsLink } from "@/components/analytics-consent"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Privacy",
  description: "What PrankSims measures and how to turn it off. No accounts, no ads, nothing you type on a prank screen is stored or sent.",
  path: "/privacy",
})

export default function PrivacyPage() {
  return (
    <main className="cy min-h-screen bg-[#0a0a0f] text-zinc-200">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-zinc-300 hover:text-cyan-300"><ArrowLeft className="h-4 w-4" /> Back to Home</Link>
        <h1 className="font-[family-name:var(--font-orbitron)] text-3xl font-bold text-white">Privacy</h1>
        <div className="mt-6 space-y-5 leading-relaxed">
          <p>PrankSims has no accounts, no ads and no sign-up. Prank screens run in your browser. We do not collect the text you type into prank screens, and the camera and microphone are never used. When analytics is enabled, we collect limited usage events, such as which pranks are opened, how long they are viewed, and whether sharing buttons are used.</p>
          <h2 className="pt-2 text-xl font-semibold text-white">What is measured</h2>
          <p><b>Vercel Web Analytics</b> (our host) counts page views, referring sites, country, device and browser in aggregate. It does not use cookies and does not follow you across sites.</p>
          <p><b>Google Analytics</b> counts visits and which prank screens are opened or shared, so we can see which ones people like. It uses cookies. In the EU, EEA, UK and Switzerland it only runs if you choose Yes. Elsewhere it runs unless you choose No. Advertising features and Google signals are switched off.</p>
          <p>You can change your choice at any time: <CookieSettingsLink className="text-cyan-300 underline underline-offset-2" />.</p>
          <h2 className="pt-2 text-xl font-semibold text-white">Stored in your browser only</h2>
          <p>Your analytics choice, the text you type for a custom link, and a note of which prank you just left (to offer you the share button). None of it is sent to us.</p>
          <h2 className="pt-2 text-xl font-semibold text-white">Email</h2>
          <p>If you email owen@ghostwrightweb.com, we use your address only to reply.</p>
        </div>
      </div>
    </main>
  )
}
