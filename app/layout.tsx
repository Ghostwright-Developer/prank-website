import type { Metadata } from "next"
import { Orbitron, Share_Tech_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" })
const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech",
})

const BASE_URL = "https://pranksims.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "PrankSims - Fake Update, BSOD & Ransomware Prank Screens",
    template: "%s | PrankSims",
  },
  description:
    "The #1 free prank screen website. Send a link to your friends and watch them panic with fake Windows updates, blue screens of death, ransomware warnings, hacker terminals, and more. 100% safe, 100% hilarious.",
  keywords: [
    // Core intent - High priority
    "prank screen",
    "fake screen prank",
    "prank website",
    "best prank website",
    "online prank",
    "computer prank",
    "office prank",
    "send prank link",
    "prank your friends",
    "prank your coworkers",
    "prank your boss",
    "prank link generator",
    "fake screen generator",
    "prank screen collection",
    // Fake update - Very popular
    "fake windows update",
    "fake update screen",
    "fakeupdate",
    "fakeupdate.net alternative",
    "fake update prank",
    "windows update prank",
    "fake software update",
    "fake windows 10 update",
    "fake windows 11 update",
    "fake macos update",
    "fake ios update",
    "fake android update",
    "fake chromeos update",
    "fake ubuntu update",
    // BSOD - Classic
    "fake BSOD",
    "blue screen of death prank",
    "fake blue screen",
    "fake crash screen",
    "fake windows crash",
    "windows BSOD prank",
    "fake BSOD generator",
    "BSOD prank link",
    // Ransomware - Scary
    "fake ransomware",
    "fake ransomware screen",
    "fake cryptolocker",
    "fake wannacry",
    "fake petya",
    "fake locky",
    "fake bad rabbit",
    "fake virus screen",
    "fake hack screen",
    "ransomware prank",
    "fake malware screen",
    "scary ransomware prank",
    // Hacker - Popular
    "fake hacker screen",
    "fake hacking screen",
    "matrix hacker prank",
    "terminal hacker screen",
    "hacker prank website",
    "fake webcam hacked",
    "fake keylogger",
    "fake data theft",
    "fake crypto miner",
    "fake remote access",
    "hollywood hacker screen",
    // Error screens
    "fake error screen",
    "fake kernel panic",
    "fake system error",
    "fake FBI warning",
    "fake format c drive",
    "fake system32 delete",
    "fake bios corruption",
    "fake hard drive format",
    // Scams - Educational
    "fake tech support scam",
    "fake antivirus",
    "fake virus warning",
    "browser hijack prank",
    "fake flash update",
    "tech support scam prank",
    // Retro
    "windows 95 prank",
    "windows 98 BSOD",
    "windows xp not genuine",
    "windows 3.1 error",
    "windows me crash",
    "windows 2000 update",
    "windows vista uac",
    "windows 7 update stuck",
    "windows 8 update",
    "retro windows prank",
    // General
    "fullscreen prank",
    "browser prank",
    "harmless prank",
    "fun prank",
    "free prank",
    "prank link to send",
    "funny computer prank",
    "scary computer prank",
    "best fake update site",
    "pranksims",
    "prank sims",
    "fake screen website",
    "send fake virus",
    "fake malware prank",
    "joke website",
    "april fools prank",
    "halloween computer prank",
  ],
  authors: [{ name: "PrankSims", url: BASE_URL }],
  creator: "PrankSims",
  publisher: "PrankSims",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "PrankSims",
    title: "PrankSims - Free Fake Update, BSOD & Ransomware Prank Screens",
    description:
      "Send a link and watch them panic. Fake Windows updates, BSODs, ransomware warnings, hacker terminals — 100% free, 100% harmless fun.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PrankSims - Fake computer error and update prank screens",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@pranksims",
    creator: "@pranksims",
    title: "PrankSims - Fake Update, BSOD & Hacker Prank Screens",
    description:
      "Send a link and watch them panic. Fake Windows updates, BSODs, ransomware warnings — 100% free, 100% harmless fun.",
    images: ["/og-image.jpg"],
  },
  category: "entertainment",
  classification: "Entertainment, Humor, Pranks",
  other: {
    "revisit-after": "7 days",
    language: "English",
    rating: "General",
    coverage: "Worldwide",
    distribution: "Global",
    target: "all",
    HandheldFriendly: "True",
    MobileOptimized: "320",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "PrankSims",
      description:
        "Free fake update, BSOD, ransomware, and hacker prank screens you can send as a link.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "PrankSims",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/og-image.jpg`,
      },
    },
    {
      "@type": "WebPage",
      "@id": `${BASE_URL}/#webpage`,
      url: BASE_URL,
      name: "PrankSims - Free Fake Update, BSOD & Ransomware Prank Screens",
      isPartOf: { "@id": `${BASE_URL}/#website` },
      about: { "@id": `${BASE_URL}/#organization` },
      description:
        "The #1 free prank screen website. Fake Windows updates, blue screens, ransomware warnings, hacker terminals, and more.",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: BASE_URL,
          },
        ],
      },
    },
    {
      "@type": "ItemList",
      name: "Prank Screens",
      description: "The world's largest collection of fake computer error and update prank screens - 39+ screens",
      numberOfItems: 39,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Windows 3.1 Crash", url: `${BASE_URL}/screens/win31` },
        { "@type": "ListItem", position: 2, name: "Windows 95/98 BSOD", url: `${BASE_URL}/screens/win98-bsod` },
        { "@type": "ListItem", position: 3, name: "Windows 95 Update", url: `${BASE_URL}/screens/win95-update` },
        { "@type": "ListItem", position: 4, name: "Windows ME Update", url: `${BASE_URL}/screens/winme-update` },
        { "@type": "ListItem", position: 5, name: "Windows 2000 Update", url: `${BASE_URL}/screens/win2000-update` },
        { "@type": "ListItem", position: 6, name: "Windows XP Not Genuine", url: `${BASE_URL}/screens/winxp` },
        { "@type": "ListItem", position: 7, name: "Windows Vista UAC", url: `${BASE_URL}/screens/vista-uac` },
        { "@type": "ListItem", position: 8, name: "Windows 7 Update", url: `${BASE_URL}/screens/win7-update` },
        { "@type": "ListItem", position: 9, name: "Windows 8 Update", url: `${BASE_URL}/screens/win8-update` },
        { "@type": "ListItem", position: 10, name: "Windows 10 Update", url: `${BASE_URL}/screens/win10-update` },
        { "@type": "ListItem", position: 11, name: "Windows 11 Update", url: `${BASE_URL}/screens/win11-update` },
        { "@type": "ListItem", position: 12, name: "Windows Update Forever", url: `${BASE_URL}/screens/windows-update` },
        { "@type": "ListItem", position: 13, name: "macOS Update", url: `${BASE_URL}/screens/macos-update` },
        { "@type": "ListItem", position: 14, name: "iOS Update", url: `${BASE_URL}/screens/ios-update` },
        { "@type": "ListItem", position: 15, name: "Android Update", url: `${BASE_URL}/screens/android-update` },
        { "@type": "ListItem", position: 16, name: "Ubuntu Update", url: `${BASE_URL}/screens/ubuntu-update` },
        { "@type": "ListItem", position: 17, name: "ChromeOS Update", url: `${BASE_URL}/screens/chromeos-update` },
        { "@type": "ListItem", position: 18, name: "Kernel Panic", url: `${BASE_URL}/screens/kernel-panic` },
        { "@type": "ListItem", position: 19, name: "CryptoLocker Ransomware", url: `${BASE_URL}/screens/cryptolocker` },
        { "@type": "ListItem", position: 20, name: "WannaCry Ransomware", url: `${BASE_URL}/screens/wannacry` },
        { "@type": "ListItem", position: 21, name: "Petya Ransomware", url: `${BASE_URL}/screens/petya` },
        { "@type": "ListItem", position: 22, name: "Locky Ransomware", url: `${BASE_URL}/screens/locky` },
        { "@type": "ListItem", position: 23, name: "Bad Rabbit Ransomware", url: `${BASE_URL}/screens/bad-rabbit` },
        { "@type": "ListItem", position: 24, name: "FBI Warning Scam", url: `${BASE_URL}/screens/fbi-warning` },
        { "@type": "ListItem", position: 25, name: "Malware Infection", url: `${BASE_URL}/screens/malware-infection` },
        { "@type": "ListItem", position: 26, name: "Matrix Terminal Hack", url: `${BASE_URL}/screens/matrix` },
        { "@type": "ListItem", position: 27, name: "Webcam Activated", url: `${BASE_URL}/screens/webcam` },
        { "@type": "ListItem", position: 28, name: "System32 Deleting", url: `${BASE_URL}/screens/system32` },
        { "@type": "ListItem", position: 29, name: "Data Theft", url: `${BASE_URL}/screens/data-theft` },
        { "@type": "ListItem", position: 30, name: "File Download Hack", url: `${BASE_URL}/screens/file-download-hack` },
        { "@type": "ListItem", position: 31, name: "Keylogger Active", url: `${BASE_URL}/screens/keylogger` },
        { "@type": "ListItem", position: 32, name: "Remote Access Trojan", url: `${BASE_URL}/screens/remote-access` },
        { "@type": "ListItem", position: 33, name: "Crypto Miner", url: `${BASE_URL}/screens/crypto-miner` },
        { "@type": "ListItem", position: 34, name: "Tech Support Scam", url: `${BASE_URL}/screens/tech-support-scam` },
        { "@type": "ListItem", position: 35, name: "Fake Antivirus", url: `${BASE_URL}/screens/fake-antivirus` },
        { "@type": "ListItem", position: 36, name: "Browser Hijack", url: `${BASE_URL}/screens/browser-hijack` },
        { "@type": "ListItem", position: 37, name: "Fake Flash Update", url: `${BASE_URL}/screens/fake-flash-update` },
        { "@type": "ListItem", position: 38, name: "Hard Drive Format", url: `${BASE_URL}/screens/format` },
        { "@type": "ListItem", position: 39, name: "BIOS Corruption", url: `${BASE_URL}/screens/bios` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is PrankScreen safe to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, completely. PrankScreen runs entirely in your browser and does nothing to your computer. No files are deleted, no malware is installed, and no system changes are made. It is 100% visual trickery.",
          },
        },
        {
          "@type": "Question",
          name: "How do I send a prank to a friend?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Simply choose a prank screen from the collection, copy the URL from your browser, and send it to your friend. When they open the link, the prank screen will load instantly in fullscreen.",
          },
        },
        {
          "@type": "Question",
          name: "How do I exit a prank screen?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Press the Escape key at any time to exit the prank and return to the home page.",
          },
        },
        {
          "@type": "Question",
          name: "Is PrankScreen free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, PrankScreen is completely free with no sign-up required. Just pick a prank and share the link.",
          },
        },
        {
          "@type": "Question",
          name: "What kind of prank screens does PrankScreen have?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "PrankScreen has fake Windows updates, BSOD blue screens, ransomware warnings like CryptoLocker and Petya, FBI warning screens, matrix hacker terminals, webcam activated screens, system32 deletion pranks, fake hard drive formats, BIOS corruption screens, macOS kernel panics, and more.",
          },
        },
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={BASE_URL} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${orbitron.variable} ${shareTechMono.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
