import type { Metadata } from "next"
import { OG_IMAGE, SITE_NAME, TWITTER_HANDLE, absoluteUrl } from "@/lib/site"
import {
  categoryPath,
  getCategory,
  getScreen,
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

export function screenMetadata(slug: string): Metadata {
  const screen = getScreen(slug)
  const category = getCategory(screen.category)
  return pageMetadata({
    title: screen.title,
    description: screen.description,
    path: screenPath(slug),
    keywords: [
      ...screen.keywords,
      ...category.keywords.slice(0, 3),
      "prank screen",
      "send prank link",
      "pranksims",
    ],
  })
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
