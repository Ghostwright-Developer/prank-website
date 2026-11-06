import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  FAQ,
  absoluteUrl,
} from "@/lib/site"
import {
  CATEGORIES,
  SCREENS,
  TOTAL_SCREENS,
  categoryPath,
  getCategory,
  getScreen,
  screenPath,
  screensInCategory,
  type CategorySlug,
} from "@/lib/screens"

const WEBSITE_ID = `${SITE_URL}/#website`
const ORG_ID = `${SITE_URL}/#organization`

type Crumb = { name: string; path: string }

export const breadcrumbList = (crumbs: Crumb[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: absoluteUrl(c.path),
  })),
})

/** Site-wide entities (rendered once from the root layout). */
export const siteJsonLd = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en-US",
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.png"),
        width: 1024,
        height: 1024,
      },
    },
  ],
})

export const homeJsonLd = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: `${SITE_NAME} - Free Fake Update, BSOD & Ransomware Prank Screens`,
      description: SITE_DESCRIPTION,
      inLanguage: "en-US",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORG_ID },
      breadcrumb: breadcrumbList([{ name: "Home", path: "/" }]),
    },
    {
      "@type": "ItemList",
      name: "Prank Screens",
      description: `A collection of ${TOTAL_SCREENS} fake computer error, update, ransomware and hacker prank screens.`,
      numberOfItems: TOTAL_SCREENS,
      itemListElement: SCREENS.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.name,
        url: absoluteUrl(screenPath(s.slug)),
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ],
})

export const categoryJsonLd = (slug: CategorySlug) => {
  const category = getCategory(slug)
  const url = absoluteUrl(categoryPath(slug))
  const screens = screensInCategory(slug)
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: category.title,
        description: category.description,
        inLanguage: "en-US",
        isPartOf: { "@id": WEBSITE_ID },
        breadcrumb: breadcrumbList([
          { name: "Home", path: "/" },
          { name: category.shortName, path: categoryPath(slug) },
        ]),
      },
      {
        "@type": "ItemList",
        name: category.name,
        numberOfItems: screens.length,
        itemListElement: screens.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          url: absoluteUrl(screenPath(s.slug)),
        })),
      },
    ],
  }
}

export const screenJsonLd = (slug: string) => {
  const screen = getScreen(slug)
  const category = getCategory(screen.category)
  const url = absoluteUrl(screenPath(slug))
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: screen.title,
    description: screen.description,
    inLanguage: "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    primaryImageOfPage: absoluteUrl("/og-image.png"),
    breadcrumb: breadcrumbList([
      { name: "Home", path: "/" },
      { name: category.shortName, path: categoryPath(category.slug) },
      { name: screen.name, path: screenPath(slug) },
    ]),
  }
}

export const contactJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${SITE_URL}/contact#webpage`,
  url: absoluteUrl("/contact"),
  name: `Contact ${SITE_NAME}`,
  isPartOf: { "@id": WEBSITE_ID },
  breadcrumb: breadcrumbList([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]),
})

