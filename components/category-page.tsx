import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CategoryIcon } from "@/components/category-icon"
import { ScreenCard } from "@/components/screen-card"
import { JsonLd } from "@/components/json-ld"
import { categoryJsonLd } from "@/lib/jsonld"
import {
  CATEGORIES,
  categoryPath,
  getCategory,
  screensInCategory,
  type CategorySlug,
} from "@/lib/screens"

export function CategoryPage({ slug }: { slug: CategorySlug }) {
  const category = getCategory(slug)
  const screens = screensInCategory(slug)
  const others = CATEGORIES.filter((c) => c.slug !== slug)

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white">
      <JsonLd data={categoryJsonLd(slug)} />
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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {screens.map((screen, i) => (
            <ScreenCard key={screen.slug} screen={{ slug: screen.slug, name: screen.name, blurb: screen.blurb }} priority={i < 3} />
          ))}
        </div>

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
      </div>
    </div>
  )
}
