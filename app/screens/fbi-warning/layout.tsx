import type { Metadata } from "next"
import { screenMetadata } from "@/lib/seo"

export const metadata: Metadata = screenMetadata("fbi-warning")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
