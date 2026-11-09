import type { Metadata } from "next"
import { OG_IMAGE, SITE_NAME, TWITTER_HANDLE, absoluteUrl } from "@/lib/site"
import {
  categoryPath,
  getCategory,
  getScreen,
  guidePath,
  screenPath,
  type CategorySlug,
} from "@/lib/screens"

interface PageMetaInput {
  /** Page title WITHOUT the site suffix; the root template appends " | PrankSims". */
  title: string
  description: string
  /** Path starting with "/", used for the canonical URL and og:url. */
  path: string
  keywords?: string[]
}

/**
 * Next.js replaces (does not deep-merge) `openGraph` and `twitter` objects from
 * parent layouts, so every page must supply the full set. This helper does that
 * and also sets a per-page canonical (the root layout deliberately sets none).
 */
export function pageMetadata({ title, description, path, keywords }: PageMetaInput): Metadata {
  const url = absoluteUrl(path)
  const socialTitle = `${title} | ${SITE_NAME}`
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      url,
      title: socialTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: socialTitle,
      description,
      images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
    },
  }
}

/**
 * The prank page itself (/screens/x). Its canonical points at the guide page
 * (/guide/x), which holds the readable content, so search engines rank the
 * guide and people who search land on a page with a Launch button.
 */
export function screenMetadata(slug: string): Metadata {
  const m = guideMetadata(slug)
  return { ...m, alternates: { canonical: absoluteUrl(guidePath(slug)) } }
}

export function guideMetadata(slug: string): Metadata {
  const screen = getScreen(slug)
  const category = getCategory(screen.category)
  return pageMetadata({
    title: screen.title,
    description: screen.description,
    path: guidePath(slug),
    keywords: [
      ...screen.keywords,
      ...category.keywords.slice(0, 3),
      "prank screen",
      "send prank link",
      "pranksims",
    ],
  })
}

export function guideFaq(slug: string): { question: string; answer: string }[] {
  const screen = getScreen(slug)
  const n = screen.name
  return [
    { question: `Is the ${n} prank safe?`, answer: `Yes. It is a web page that runs in your browser. It does not install anything, read files or change settings, and pressing Esc or closing the tab ends it.` },
    { question: `How do I send the ${n} prank to someone?`, answer: `Press Copy prank link on this page and send the link. When they open it, the screen starts straight away and fills the display.` },
    { question: `How do I exit the ${n} screen?`, answer: `Press Esc or Q, or close the tab. Esc returns to the PrankSims home page.` },
    { question: `Can I start it later, after I leave the room?`, answer: `Yes. Choose Set up with a delay, pick anything from 10 seconds to 10 minutes, and the screen stays black until the time is up.` },
    { question: `Why does it need a click to go fullscreen?`, answer: `Browsers only allow fullscreen after a click or key press. Pressing Launch on this page counts, so the prank starts fullscreen. If you open a prank link directly, it goes fullscreen as soon as the browser allows, or on the first click.` },
  ]
}

export function categoryMetadata(slug: CategorySlug): Metadata {
  const category = getCategory(slug)
  return pageMetadata({
    title: category.title,
    description: category.description,
    path: categoryPath(slug),
    keywords: [...category.keywords, "prank screens", "fake screen prank", "pranksims"],
  })
}
