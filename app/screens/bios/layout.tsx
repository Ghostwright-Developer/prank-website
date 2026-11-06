import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fake BIOS Corruption Prank Screen",
  description:
    "Fake BIOS corruption and POST failure prank screen. Looks like the motherboard firmware has been bricked. 100% harmless browser prank.",
  keywords: ["fake BIOS error", "BIOS corruption prank", "fake POST failure", "motherboard failure prank", "BIOS prank screen"],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
