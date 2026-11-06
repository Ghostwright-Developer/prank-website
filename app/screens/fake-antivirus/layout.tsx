import type { Metadata } from "next"
import { JsonLd } from "@/components/json-ld"
import { screenJsonLd } from "@/lib/jsonld"
import { screenMetadata } from "@/lib/seo"

export const metadata: Metadata = screenMetadata("fake-antivirus")

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={screenJsonLd("fake-antivirus")} />
      {children}
    </>
  )
}
