import type { Metadata } from "next"
import Link from "next/link"
import { Zap } from "lucide-react"
import { CategoryIcon } from "@/components/category-icon"
import { ScreenCard } from "@/components/screen-card"
import { SiteHeader } from "@/components/site-header"
import { SurpriseButton } from "@/components/surprise-button"
import { JsonLd } from "@/components/json-ld"
import { CookieSettingsLink } from "@/components/analytics-consent"
import { homeJsonLd } from "@/lib/jsonld"
import {
  CATEGORIES,
  TOTAL_SCREENS,
  categoryPath,
  SCREENS,
  trendingScreens,
  guidePath,
  screensInCategory,
  FAMILIES,
  COMEDY_SUBS,
  COMEDY_ARCHIVE_SLUGS,
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
  const trending = trendingScreens()

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-zinc-100 relative overflow-x-clip">
      <JsonLd data={homeJsonLd()} />
      <SiteHeader />

      {/* Animated background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Glow effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12">
        <header className="mb-12 pt-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400">
            <Zap className="h-4 w-4" />
            <span>{TOTAL_SCREENS} Free Prank Screens</span>
          </div>

          <h1 className="mb-4 text-5xl md:text-7xl font-bold tracking-tight font-[family-name:var(--font-orbitron)]">
            <span className="sr-only">PrankSims: Free Fake Update, BSOD and Ransomware Prank Screens</span>
            <span aria-hidden="true">
              <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-500 bg-clip-text text-transparent">PRANK</span>
              <span className="text-white">SIMS</span>
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-zinc-300 leading-relaxed">
            Fake update screens, blue screens, ransomware jokes and funny takeovers. Pick one, press Launch, or send a link and watch the chaos unfold.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="#start" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3 font-semibold text-white transition-all hover:from-cyan-400 hover:to-blue-500">Start here</Link>
            <SurpriseButton slugs={SCREENS.map((s) => s.slug)} />
          </div>

          <nav aria-label="Jump to a section" className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm">
            {FAMILIES.map((f) => (
              <a key={f.id} href={`#${f.id}`} className="rounded-full border px-4 py-1.5 font-medium text-zinc-100 transition-colors hover:bg-zinc-800" style={{ borderColor: f.accent + "88" }}>{f.title}</a>
            ))}
          </nav>
        </header>

        {/* Start here: the most launched screens, for people who just arrived */}
        <section id="start" className="mb-16 scroll-mt-24" aria-labelledby="trending-heading">
          <h2 id="trending-heading" className="mb-2 text-2xl font-semibold font-[family-name:var(--font-orbitron)]">
            Start <span className="text-cyan-400">here</span>
          </h2>
          <p className="mb-6 max-w-2xl text-zinc-300">Six of the most launched screens. Press Launch to see one fullscreen, then Esc to come back.</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((screen, i) => (
              <ScreenCard key={screen.slug} screen={{ slug: screen.slug, name: screen.name, blurb: screen.blurb }} priority={i < 3} />
            ))}
          </div>
        </section>

        {/* Four families instead of ten look-alike cards */}
        {FAMILIES.map((family) => (
          <section key={family.id} id={family.id} className="mb-14 scroll-mt-24" aria-labelledby={`${family.id}-heading`}>
            <div className="mb-5 flex items-stretch gap-4">
              <div className="w-1.5 shrink-0 rounded-full" style={{ background: family.accent }} />
              <div>
                <h2 id={`${family.id}-heading`} className="text-2xl font-semibold font-[family-name:var(--font-orbitron)]">{family.title}</h2>
                <p className="mt-1 max-w-3xl text-zinc-300">{family.blurb}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {family.categories.map((slug) => {
                const category = CATEGORIES.find((c) => c.slug === slug)!
                const list = screensInCategory(slug).filter((x) => !COMEDY_ARCHIVE_SLUGS.has(x.slug) || slug !== "comedy")
                const featured = slug === "comedy"
                return (
                  <article
                    key={slug}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-zinc-900/60 p-5 transition-all hover:-translate-y-0.5 hover:bg-zinc-900 ${featured ? "sm:col-span-2 lg:col-span-3" : ""}`}
                    style={{ borderColor: family.accent + "55" }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${category.color}`}>
                        <CategoryIcon name={category.icon} className="h-6 w-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-orbitron)]">
                          <Link href={categoryPath(slug)} className="after:absolute after:inset-0">{category.name}</Link>
                        </h3>
                        <p className="text-xs text-zinc-400">{screensInCategory(slug).length} screens</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-300">{category.cardBlurb}</p>
                    {featured ? (
                      <ul className="relative z-10 mt-4 flex flex-wrap gap-2">
                        {COMEDY_SUBS.map((sub) => (
                          <li key={sub.id}>
                            <Link href={`${categoryPath("comedy")}#${sub.id}`} className={`inline-block rounded-full border px-3 py-1 text-xs font-medium hover:bg-zinc-800 ${sub.archive ? "border-zinc-700 text-zinc-400" : "border-yellow-400/40 text-yellow-100"}`}>
                              {sub.name} <span className="text-zinc-500">{sub.slugs.length}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-xs leading-relaxed text-zinc-500">{list.slice(0, 4).map((x) => x.name).join(" · ")}{list.length > 4 ? ` · +${list.length - 4} more` : ""}</p>
                    )}
                  </article>
                )
              })}
            </div>
          </section>
        ))}

        <div className="mb-20 text-center">
          <Link href="/screens" className="inline-flex items-center gap-2 rounded-xl border border-zinc-500 bg-zinc-800 px-6 py-3 font-semibold text-white hover:border-zinc-300 hover:bg-zinc-700">Search or browse all {TOTAL_SCREENS} screens →</Link>
        </div>

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
        <section id="faq" className="mb-20 scroll-mt-24" aria-labelledby="faq-heading">
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
          <details className="mb-10 rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-4"><summary className="cursor-pointer font-semibold text-zinc-200">All {TOTAL_SCREENS} screens, A to Z by category</summary><nav aria-label="All prank screens" className="mt-5 grid gap-x-8 gap-y-6 text-left sm:grid-cols-2 lg:grid-cols-4">
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
                      <Link href={guidePath(screen.slug)} className="text-zinc-400 hover:text-cyan-400 transition-colors">
                        {screen.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav></details>
          <div className="text-center">
            <p className="mb-2">All screens are harmless pranks. No actual system damage occurs.</p>
            <p className="text-zinc-500">
              Press <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400 font-mono">ESC</kbd> or{" "}
              <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400 font-mono">Q</kbd> to exit any prank.
            </p>
            <p className="mt-4 text-zinc-500">
              <Link href="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link>
              {" · "}<Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
              <CookieSettingsLink className="hover:text-cyan-400 transition-colors before:content-[' · ']" />
              {" · "}&copy; {new Date().getFullYear()} {SITE_NAME}
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
