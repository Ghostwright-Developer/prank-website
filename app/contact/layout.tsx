import type { Metadata } from "next"
import { JsonLd } from "@/components/json-ld"
import { contactJsonLd } from "@/lib/jsonld"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Contact & Suggest a Prank Screen",
  description:
    "Have an idea for a new prank screen, found a bug, or want to share how you pranked a coworker? Send PrankSims a message. We read every one.",
  path: "/contact",
  keywords: ["contact pranksims", "suggest a prank", "prank screen ideas", "report a bug"],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={contactJsonLd()} />
      {children}
    </>
  )
}
