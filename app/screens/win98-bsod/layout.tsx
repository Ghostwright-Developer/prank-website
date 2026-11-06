import type { Metadata } from "next"
import { JsonLd } from "@/components/json-ld"
import { screenJsonLd } from "@/lib/jsonld"
import { screenMetadata } from "@/lib/seo"

export const metadata: Metadata = screenMetadata("win98-bsod")

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={screenJsonLd("win98-bsod")} />
      {children}
    </>
  )
}
