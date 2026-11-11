import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { GuideActions } from "@/components/guide-actions"
import { JsonLd } from "@/components/json-ld"
import { ScreenCard } from "@/components/screen-card"
import { SupportButton } from "@/components/support-button"
import { GUIDES } from "@/lib/guides"
import { guideJsonLd } from "@/lib/jsonld"
import { guideFaq, guideMetadata } from "@/lib/seo"
import { SCREENS, categoryPath, getCategory, guidePath, screensInCategory } from "@/lib/screens"

export const dynamicParams = false
export function generateStaticParams() {
  return SCREENS.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!SCREENS.some((s) => s.slug === slug)) return {}
  return guideMetadata(slug)
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const screen = SCREENS.find((s) => s.slug === slug)
  const guide = GUIDES[slug]
  if (!screen || !guide) notFound()
  const category = getCategory(screen.category)
  const faq = guideFaq(slug)
  const related = screensInCategory(screen.category).filter((s) => s.slug !== slug).slice(0, 3)

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <JsonLd data={guideJsonLd(slug)} />
      <div className="mx-auto max-w-4xl px-5 py-10">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-cyan-300"><ArrowLeft className="h-4 w-4" /> Home</Link>
          <span>/</span>
          <Link href={categoryPath(category.slug)} className="hover:text-cyan-300">{category.shortName}</Link>
          <span>/</span>
          <span className="text-zinc-200">{screen.name}</span>
        </nav>

        <header>
          <h1 className="font-[family-name:var(--font-orbitron)] text-3xl font-bold leading-tight md:text-4xl">{screen.name} Prank Screen</h1>
          <p className="mt-3 text-lg leading-relaxed text-zinc-300">{screen.description}</p>
        </header>

        <Link href={`/screens/${slug}`} aria-label={`Launch ${screen.name}`} className="mt-6 block max-w-xl overflow-hidden rounded-xl border border-zinc-600/70 bg-zinc-900 transition-colors hover:border-cyan-400/70">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/thumbs/${slug}.jpg`} alt={`Preview of the ${screen.name} prank screen`} width={640} height={360} className="aspect-video w-full object-cover" />
        </Link>

        <div className="mt-6"><GuideActions slug={slug} name={screen.name} blurb={screen.blurb} /></div>
        <p className="mt-3 text-sm text-zinc-400">
          Press <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-zinc-200">Esc</kbd> or <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-zinc-200">Q</kbd> at any time to exit. Free, no download, nothing on the computer changes.
        </p>

        <section className="mt-12 space-y-8 text-zinc-300">
          <div>
            <h2 className="mb-2 text-xl font-semibold text-white">What the {screen.name} prank looks like</h2>
            <p className="leading-relaxed">{guide.looks}</p>
          </div>
          <div>
            <h2 className="mb-2 text-xl font-semibold text-white">Why it works</h2>
            <p className="leading-relaxed">{guide.story}</p>
          </div>
          <div>
            <h2 className="mb-2 text-xl font-semibold text-white">Who to send it to</h2>
            <p className="leading-relaxed">{guide.bestFor}</p>
          </div>
          <div>
            <h2 className="mb-2 text-xl font-semibold text-white">How to run the {screen.name} prank</h2>
            <ol className="list-decimal space-y-2 pl-6 leading-relaxed">
              <li>Open this page on the computer you want to prank, or press <b>Copy prank link</b> and send the link to someone else.</li>
              <li>Press <b>Launch</b>. The screen fills the whole display straight away. Use <b>Set up with a delay</b> to start it after 10 seconds up to 10 minutes, so you can leave the room first.</li>
              <li>For the most believable prank, unplug any extra monitors first. A second screen showing the normal desktop gives it away.</li>
              <li>When you are ready to reveal it, press Esc or Q. You return to PrankSims and a short note explains it was a prank.</li>
            </ol>
            <p className="mt-3 leading-relaxed"><b>Tip:</b> {guide.tip}</p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold text-white">Frequently asked questions</h2>
          <div className="space-y-5">
            {faq.map((f) => (
              <div key={f.question}>
                <h3 className="font-semibold text-zinc-100">{f.question}</h3>
                <p className="mt-1 leading-relaxed text-zinc-300">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-4 text-xl font-semibold text-white">More {category.shortName.toLowerCase()} pranks</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {related.map((s) => <ScreenCard key={s.slug} screen={{ slug: s.slug, name: s.name, blurb: s.blurb }} />)}
            </div>
            <p className="mt-5"><Link href={categoryPath(category.slug)} className="text-cyan-300 hover:underline">See all {category.name}</Link> · <Link href="/screens" className="text-cyan-300 hover:underline">Browse every screen</Link></p>
          </section>
        )}

        <SupportButton className="mb-4 mt-14 border-t border-zinc-800/50 pt-10" />
      </div>
    </main>
  )
}
