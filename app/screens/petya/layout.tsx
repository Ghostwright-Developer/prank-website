import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fake Petya Ransomware Skull Prank",
  description:
    "Fake Petya ransomware boot screen with ASCII skull and countdown. Looks like your PC has been completely taken over. 100% safe prank.",
  keywords: ["fake petya", "petya prank", "ransomware skull prank", "fake boot sector virus", "petya ransomware joke"],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
