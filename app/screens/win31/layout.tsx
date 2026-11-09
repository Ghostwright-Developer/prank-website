import type { Metadata } from "next"
import { screenMetadata } from "@/lib/seo"

export const metadata: Metadata = screenMetadata("win31")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
