import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fake macOS Kernel Panic Prank",
  description:
    "Fake macOS kernel panic crash screen with authentic-looking panic log. Perfect for pranking Mac users. 100% harmless browser prank.",
  keywords: ["fake kernel panic", "macOS crash prank", "fake mac crash", "kernel panic prank", "mac error screen prank"],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
