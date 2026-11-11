import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CategoryIcon } from "@/components/category-icon"
import { ScreenCard } from "@/components/screen-card"
import { JsonLd } from "@/components/json-ld"
import { SiteHeader } from "@/components/site-header"
import { SupportButton } from "@/components/support-button"
import { categoryFaqJsonLd, categoryJsonLd } from "@/lib/jsonld"
import { CATEGORY_GUIDES } from "@/lib/guides"
import {
  CATEGORIES,
  categoryPath,
  getCategory,
  screensInCategory,
  COMEDY_SUBS,
  subScreens,
  type CategorySlug,
} from "@/lib/screens"

export function CategoryPage({ slug }: { slug: CategorySlug }) {
  const category = getCategory(slug)
  const screens = screensInCategory(slug)
  const guide = CATEGORY_GUIDES[slug]
  const others = CATEGORIES.filter((c) => c.slug !== slug)

  return (
    <div className="cy min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white">
      <SiteHeader />
      <JsonLd data={categoryJsonLd(slug)} />
      <JsonLd data={categoryFaqJsonLd(slug)} />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <nav aria-label="Breadcrumb">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-cyan-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 mb-5">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color}`}
            >
              <CategoryIcon name={category.icon} className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-[family-name:var(--font-orbitron)]">
                {category.name}
              </h1>
              <p className="text-zinc-400">{screens.length} prank screens</p>
            </div>
          </div>
          <p className="max-w-3xl text-zinc-400 leading-relaxed">{category.intro}</p>
        </header>

        {slug === "comedy" ? (
          <div className="space-y-12">
            <nav aria-label="Comedy sub-categories" className="flex flex-wrap gap-2">
              {COMEDY_SUBS.map((sub) => (
                <a key={sub.id} href={`#${sub.id}`} className={`rounded-full border px-4 py-1.5 text-sm hover:bg-zinc-800 ${sub.archive ? "border-zinc-700 text-zinc-400" : "border-yellow-400/50 text-yellow-100"}`}>{sub.name}</a>
              ))}
            </nav>
            {COMEDY_SUBS.map((sub) => {
              const grid = (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {subScreens(sub).map((screen, i) => (
                    <ScreenCard key={screen.slug} screen={{ slug: screen.slug, name: screen.name, blurb: screen.blurb }} priority={!sub.archive && i < 3} />
                  ))}
                </div>
              )
              return sub.archive ? (
                <details key={sub.id} id={sub.id} className="scroll-mt-24 rounded-2xl border border-zinc-700 bg-zinc-900/40 p-5 open:bg-zinc-900/60">
                  <summary className="cursor-pointer list-none">
                    <span className="text-xl font-semibold text-zinc-100">{sub.name}</span>
                    <span className="ml-3 text-sm text-zinc-400">{sub.slugs.length} screens · {sub.blurb}</span>
                  </summary>
                  <div className="mt-5">{grid}</div>
                </details>
              ) : (
                <section key={sub.id} id={sub.id} className="scroll-mt-24">
                  <h2 className="text-xl font-semibold text-white">{sub.name}</h2>
                  <p className="mb-4 mt-1 text-sm text-zinc-300">{sub.blurb}</p>
                  {grid}
                </section>
              )
            })}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {screens.map((screen, i) => (
              <ScreenCard key={screen.slug} screen={{ slug: screen.slug, name: screen.name, blurb: screen.blurb }} priority={i < 3} />
            ))}
          </div>
        )}

        <section className="mt-16 max-w-3xl space-y-10 text-zinc-300">
          <div>
            <h2 className="mb-3 text-xl font-semibold text-white">About {category.name.toLowerCase()} pranks</h2>
            <div className="space-y-4 leading-relaxed">
              {guide.about.map((p) => <p key={p}>{p}</p>)}
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-xl font-semibold text-white">Tips for a better prank</h2>
            <ul className="list-disc space-y-2 pl-6 leading-relaxed">
              {guide.tips.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-xl font-semibold text-white">Frequently asked questions</h2>
            <div className="space-y-5">
              {guide.faq.map((f) => (
                <div key={f.question}>
                  <h3 className="font-semibold text-zinc-100">{f.question}</h3>
                  <p className="mt-1 leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <nav aria-label="More categories" className="mt-16 border-t border-zinc-800/50 pt-8">
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">More prank categories</h2>
          <ul className="flex flex-wrap gap-3">
            {others.map((c) => (
              <li key={c.slug}>
                <Link
                  href={categoryPath(c.slug)}
                  className="inline-block rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-sm text-zinc-400 transition-colors hover:border-cyan-500/50 hover:text-cyan-400"
                >
                  {c.shortName}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-zinc-600">
            Press <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400 font-mono">ESC</kbd> or{" "}
            <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400 font-mono">Q</kbd> to exit any prank.
          </p>
        </nav>
        <SupportButton className="mb-2 mt-12" />
      </div>
    </div>
  )
}
