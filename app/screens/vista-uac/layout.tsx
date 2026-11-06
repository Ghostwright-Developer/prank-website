import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Windows Vista UAC Spam Prank",
  description:
    "Fake Windows Vista UAC permission dialogs that never stop appearing. The most annoying prank screen ever made. Send as a link.",
  keywords: ["windows vista prank", "fake UAC prompt", "windows vista UAC prank", "permission dialog prank", "windows vista spam"],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
