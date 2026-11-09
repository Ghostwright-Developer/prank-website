/**
 * Single source of truth for site-wide identity.
 * Change SITE_URL here (e.g. to the apex domain) and every canonical URL,
 * sitemap entry, Open Graph tag and JSON-LD block follows.
 */
export const SITE_URL = "https://www.pranksims.com"
export const SITE_NAME = "PrankSims"
export const SITE_TAGLINE = "Fake Update, BSOD & Ransomware Prank Screens"
export const SITE_DESCRIPTION =
  "Free fullscreen prank screens you can send as a link: fake Windows updates, blue screens of death, ransomware warnings, hacker terminals and more. 100% safe, no downloads, no sign-up."
export const TWITTER_HANDLE = "@pranksims"
/** ISO date the content last meaningfully changed; used by the sitemap. */
export const LAST_UPDATED = "2026-11-09"

export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "PrankSims - fake computer error, update and hacker prank screens",
}

export function absoluteUrl(path = ""): string {
  if (!path || path === "/") return SITE_URL
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export const FAQ: { question: string; answer: string }[] = [
  {
    question: "Is PrankSims safe to use?",
    answer:
      "Yes. Every prank runs entirely in your browser and does nothing to your computer. No files are deleted, no malware is installed and no system settings change. It is 100% visual trickery.",
  },
  {
    question: "How do I send a prank to a friend?",
    answer:
      "Pick a prank screen, copy the URL from your browser's address bar and send it to your friend. When they open the link, the prank loads instantly and goes fullscreen.",
  },
  {
    question: "How do I exit a prank screen?",
    answer:
      "Press the Escape key or the Q key at any time to leave the prank and return to the PrankSims home page. On a phone or tablet, swiping out of fullscreen or using the browser's back button also works.",
  },
  {
    question: "Is PrankSims free?",
    answer:
      "Yes. PrankSims is completely free with no account or sign-up. Just pick a prank and share the link.",
  },
  {
    question: "Do the pranks work on phones and tablets?",
    answer:
      "Yes. The screens run in any modern browser on Windows, macOS, Linux, Android and iOS. Some mobile browsers limit fullscreen, in which case the prank fills the visible page instead.",
  },
  {
    question: "What kinds of prank screens does PrankSims have?",
    answer:
      "PrankSims has fake Windows updates from 3.1 to 11, blue screens of death, macOS, iOS, Android, Ubuntu and ChromeOS updates, ransomware screens like CryptoLocker, WannaCry and Petya, hacker terminals, tech support scams, cracked and broken screen effects, and absurd comedy screens.",
  },
]
