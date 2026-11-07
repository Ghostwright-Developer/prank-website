import type { Metadata } from "next"
import { JsonLd } from "@/components/json-ld"
import { screenJsonLd } from "@/lib/jsonld"
import { screenMetadata } from "@/lib/seo"

export const metadata: Metadata = screenMetadata("macos-desktop")

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={screenJsonLd("macos-desktop")} />
      {children}
    </>
  )
}
