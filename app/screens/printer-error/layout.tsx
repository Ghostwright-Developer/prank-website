import type { Metadata } from "next"
import { screenMetadata } from "@/lib/seo"

export const metadata: Metadata = screenMetadata("printer-error")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
