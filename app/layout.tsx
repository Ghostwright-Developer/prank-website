import type { Metadata, Viewport } from "next"
import { Orbitron, Share_Tech_Mono, VT323 } from "next/font/google"
import { Analytics } from "@/components/analytics"
import { EarlyFullscreen } from "@/components/early-fullscreen"
import { ExitNotice } from "@/components/exit-notice"
import { JsonLd } from "@/components/json-ld"
import { siteJsonLd } from "@/lib/jsonld"
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  OG_IMAGE,
  TWITTER_HANDLE,
} from "@/lib/site"
import "./globals.css"

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
})
const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech",
  display: "swap",
})

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0f",
  colorScheme: "dark",
}

/**
 * Site-wide defaults. Every page sets its own title, description, canonical,
 * openGraph and twitter via `pageMetadata()` (lib/seo.ts), because Next.js
 * replaces those objects instead of merging them. No canonical is set here on
 * purpose: a root-level canonical would be inherited by every page and tell
 * Google they are all duplicates of the home page.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} - ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "prank screen",
    "fake screen prank",
    "prank website",
    "send prank link",
    "computer prank",
    "office prank",
    "fake windows update",
    "fake update screen",
    "fakeupdate alternative",
    "fake BSOD",
    "blue screen of death prank",
    "fake ransomware",
    "fake hacker screen",
    "fake virus screen",
    "fake crash screen",
    "pranksims",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "entertainment",
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} - ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: `${SITE_NAME} - ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${orbitron.variable} ${shareTechMono.variable} ${vt323.variable} font-sans antialiased`}
      >
        <EarlyFullscreen />
        <JsonLd data={siteJsonLd()} />
        {children}
        <ExitNotice />
        <Analytics />
      </body>
    </html>
  )
}
