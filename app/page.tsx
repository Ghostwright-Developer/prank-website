import type { Metadata } from "next"
import Link from "next/link"
import { Zap } from "lucide-react"
import { CategoryIcon } from "@/components/category-icon"
import { ScreenCard } from "@/components/screen-card"
import { SurpriseButton } from "@/components/surprise-button"
import { JsonLd } from "@/components/json-ld"
import { homeJsonLd } from "@/lib/jsonld"
import {
  CATEGORIES,
  TOTAL_SCREENS,
  categoryPath,
  SCREENS,
  popularScreens,
  screenPath,
  screensInCategory,
} from "@/lib/screens"
import { FAQ, OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, TWITTER_HANDLE, absoluteUrl } from "@/lib/site"

const HOME_TITLE = `${SITE_NAME} - Free Fake Update, BSOD & Ransomware Prank Screens`

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    url: absoluteUrl("/"),
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
  },
}

export default function Home() {
  const popular = popularScreens()

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-zinc-100 relative overflow-hidden">
      <JsonLd data={homeJsonLd()} />

      {/* Animated background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Glow effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400 mb-6">
            <Zap className="h-4 w-4" />
            <span>{TOTAL_SCREENS} Free Prank Screens</span>
          </div>

          <h1 className="mb-6 text-6xl md:text-7xl font-bold tracking-tight font-[family-name:var(--font-orbitron)]">
            <span className="sr-only">PrankSims: Free Fake Update, BSOD and Ransomware Prank Screens</span>
            <span aria-hidden="true">
              <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
                PRANK
              </span>
              <span className="text-white">SIMS</span>
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-zinc-400 leading-relaxed">
            The ultimate collection of fake update screens, blue screens of death,
            ransomware jokes, and hacker terminals. Send a link and watch the chaos unfold.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/screens" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3 font-semibold text-white transition-all hover:from-cyan-400 hover:to-blue-500">Browse all {TOTAL_SCREENS} screens</Link>
            <SurpriseButton slugs={SCREENS.map((s) => s.slug)} />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-400">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Instant fullscreen
            </span>
            <span className="text-zinc-700">|</span>
            <span>No downloads</span>
            <span className="text-zinc-700">|</span>
            <span>Works on all devices</span>
          </div>
        </header>

        {/* Category Cards */}
        <section className="mb-20" aria-labelledby="categories-heading">
          <h2
            id="categories-heading"
            className="text-center text-2xl font-semibold mb-10 font-[family-name:var(--font-orbitron)]"
          >
            Choose a <span className="text-cyan-400">Category</span>
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => {
              const count = screensInCategory(category.slug).length
              return (
                <Link
                  key={category.slug}
                  href={categoryPath(category.slug)}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm p-8 transition-all duration-500 hover:border-zinc-700 hover:scale-[1.02] hover:shadow-2xl"
                >
                  {/* Animated grid on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(${category.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${category.gridColor} 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Gradient glow on hover */}
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                  />

                  <div className="relative">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} mb-5 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <CategoryIcon name={category.icon} className="h-7 w-7 text-white" />
                    </div>

                    <h3 className="text-xl font-semibold text-zinc-100 group-hover:text-white mb-2 font-[family-name:var(--font-orbitron)]">
                      {category.name}
                    </h3>

                    <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors leading-relaxed">
                      {count} screens - {category.cardBlurb}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-sm text-zinc-600 group-hover:text-cyan-400 transition-colors">
                      <span>Browse screens</span>
                      <svg
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Popular */}
        <section className="mb-20" aria-labelledby="popular-heading">
          <h2
            id="popular-heading"
            className="text-center text-2xl font-semibold mb-10 font-[family-name:var(--font-orbitron)]"
          >
            Most Popular <span className="text-pink-400">Pranks</span>
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((screen, i) => (
              <ScreenCard key={screen.slug} screen={{ slug: screen.slug, name: screen.name, blurb: screen.blurb }} priority={i < 3} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/screens" className="text-cyan-300 underline-offset-4 hover:underline">See all {TOTAL_SCREENS} screens →</Link>
          </div>
        </section>

        {/* How it works section */}
        <section className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm p-8 md:p-12 mb-20">
          <h2 className="text-2xl font-semibold text-center mb-10 font-[family-name:var(--font-orbitron)]">
            How It <span className="text-cyan-400">Works</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Choose a Prank</h3>
              <p className="text-sm text-zinc-400">Pick from {TOTAL_SCREENS} authentic-looking fake screens. Tap Launch to try one right here.</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-red-600 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Set it up or send it</h3>
              <p className="text-sm text-zinc-400">Use Set up to arm it on any computer with a delay, or Copy link and send it. The screen goes fullscreen on the first click.</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Watch the Panic</h3>
              <p className="text-sm text-zinc-400">Press Esc or Q to bring everything back to normal at any time.</p>
            </div>
          </div>
        </section>

        {/* FAQ: visible on the page so the FAQPage JSON-LD matches real content */}
        <section className="mb-20" aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="text-2xl font-semibold text-center mb-10 font-[family-name:var(--font-orbitron)]"
          >
            Frequently Asked <span className="text-cyan-400">Questions</span>
          </h2>
          <div className="mx-auto max-w-3xl space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-sm p-5 open:border-cyan-500/30"
              >
                <summary className="cursor-pointer list-none font-semibold text-zinc-100 flex items-center justify-between gap-4">
                  {item.question}
                  <span className="text-cyan-400 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Info sections */}
        <section className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Disclaimer */}
            <div className="rounded-xl border border-red-900/30 bg-red-950/20 backdrop-blur-sm p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-3">Important Disclaimer</h3>
              <p className="text-sm text-zinc-400">
                We are not responsible for revenge actions. Keep pranks brief and harmless. Prank at your own risk!
              </p>
            </div>

            {/* Safety */}
            <div className="rounded-xl border border-green-900/30 bg-green-950/20 backdrop-blur-sm p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-3">100% Safe &amp; Harmless</h3>
              <p className="text-sm text-zinc-400">
                No downloads, no malware, no system damage. It&apos;s purely visual trickery in your browser.
              </p>
            </div>
          </div>

          {/* Have an idea */}
          <div className="rounded-xl border border-yellow-900/30 bg-yellow-950/20 backdrop-blur-sm p-6 text-center">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Got Ideas for New Pranks?</h3>
            <p className="text-sm text-zinc-400 mb-4">
              We love hearing new ideas! Share your prank concepts with us.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 px-5 py-2.5 font-semibold text-white transition-all hover:from-yellow-400 hover:to-orange-500"
            >
              Share Your Ideas
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>

        <footer className="mt-16 border-t border-zinc-800/50 pt-8 text-sm text-zinc-400">
          <nav aria-label="All prank screens" className="mb-10 grid gap-x-8 gap-y-6 text-left sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((category) => (
              <div key={category.slug}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  <Link href={categoryPath(category.slug)} className="hover:text-cyan-400 transition-colors">
                    {category.shortName}
                  </Link>
                </h3>
                <ul className="space-y-1">
                  {screensInCategory(category.slug).map((screen) => (
                    <li key={screen.slug}>
                      <Link href={screenPath(screen.slug)} className="text-zinc-400 hover:text-cyan-400 transition-colors">
                        {screen.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="text-center">
            <p className="mb-2">All screens are harmless pranks. No actual system damage occurs.</p>
            <p className="text-zinc-500">
              Press <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400 font-mono">ESC</kbd> or{" "}
              <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400 font-mono">Q</kbd> to exit any prank.
            </p>
            <p className="mt-4 text-zinc-500">
              <Link href="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link>
              {" · "}&copy; {new Date().getFullYear()} {SITE_NAME}
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
