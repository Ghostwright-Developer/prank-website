import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BrowseGrid } from "@/components/browse-grid"
import { SurpriseButton } from "@/components/surprise-button"
import { CATEGORIES, SCREENS, TOTAL_SCREENS, getCategory } from "@/lib/screens"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: `All ${TOTAL_SCREENS} Prank Screens: Fake Updates, BSODs, Ransomware & Lock Screens`,
  description: `Browse all ${TOTAL_SCREENS} free fullscreen prank screens: fake Windows updates, blue screens, ransomware, hacker terminals, lock screens and more. Launch one, set it up on any device, or copy a link.`,
  path: "/screens",
  keywords: ["prank screens", "fake screen prank", "fake update screen", "prank website", "fake bsod", "fake lock screen"],
})

export default function AllScreensPage() {
  const items = SCREENS.map((s) => ({
    slug: s.slug, name: s.name, blurb: s.blurb, category: s.category, keywords: s.keywords, popular: s.popular,
    categoryName: getCategory(s.category).shortName,
  }))
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-zinc-300 hover:text-cyan-300"><ArrowLeft className="h-4 w-4" /> Back to Home</Link>
        <header className="mb-8">
          <h1 className="font-[family-name:var(--font-orbitron)] text-3xl font-bold md:text-4xl">All {TOTAL_SCREENS} Prank Screens</h1>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-zinc-300">
            Pick a screen, then press <b>Launch</b> to try it here, <b>Set up</b> to arm it on this computer with a delay, or <b>Link</b> to copy a link you can send. Not sure? Try a random one.
          </p>
          <div className="mt-5"><SurpriseButton slugs={SCREENS.map((s) => s.slug)} /></div>
        </header>
        <BrowseGrid items={items} categories={CATEGORIES.map((c) => ({ slug: c.slug, name: c.shortName }))} />
      </div>
    </main>
  )
}
