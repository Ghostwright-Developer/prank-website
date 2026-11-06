import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fake Matrix Hacker Terminal Prank",
  description:
    "Fake matrix hacker terminal with falling green code and 'downloading your files' logs. Send as a link and watch the panic. 100% harmless.",
  keywords: ["matrix hacker prank", "fake hacker screen", "green matrix code", "hacking terminal prank", "fake hacking screen"],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
