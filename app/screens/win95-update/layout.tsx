import type { Metadata } from "next"
import { screenMetadata } from "@/lib/seo"

export const metadata: Metadata = screenMetadata("win95-update")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
