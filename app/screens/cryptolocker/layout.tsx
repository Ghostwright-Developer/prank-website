import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fake CryptoLocker Ransomware Prank",
  description:
    "Send this fake CryptoLocker ransomware screen to a friend. Scary countdown timer, file encryption animation, and a punchline reveal. 100% harmless.",
  keywords: ["fake cryptolocker", "ransomware prank", "fake ransomware screen", "cryptolocker joke", "fake virus prank"],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
