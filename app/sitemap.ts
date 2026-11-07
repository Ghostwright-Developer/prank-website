import type { MetadataRoute } from "next"
import { LAST_UPDATED, absoluteUrl } from "@/lib/site"
import { CATEGORIES, SCREENS, categoryPath, screenPath } from "@/lib/screens"

// Built from lib/screens.ts, so a new screen or category is picked up
// automatically and nothing can be left out of the sitemap by mistake.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(LAST_UPDATED)
  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/screens"), lastModified, changeFrequency: "weekly", priority: 0.95 },
    ...CATEGORIES.map((c) => ({
      url: absoluteUrl(categoryPath(c.slug)),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...SCREENS.map((s) => ({
      url: absoluteUrl(screenPath(s.slug)),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: s.popular ? 0.9 : 0.8,
    })),
    { url: absoluteUrl("/contact"), lastModified, changeFrequency: "yearly", priority: 0.4 },
  ]
}
