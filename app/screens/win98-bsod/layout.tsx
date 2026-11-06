import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Windows 98 Blue Screen of Death Prank",
  description:
    "Send this fake Windows 98 BSOD blue screen of death to a friend. Looks exactly like the real thing. 100% harmless browser prank.",
  keywords: ["windows 98 BSOD", "fake blue screen of death", "BSOD prank", "windows 98 crash prank", "fake windows crash"],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
