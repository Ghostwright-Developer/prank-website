"use client"

import { Coffee } from "lucide-react"

/** Where donations go (Ko-fi). */
export const SUPPORT_URL = "https://ko-fi.com/pranksims"

const LABEL = "Buy me a prank"

/** Opens Ko-fi in a new tab. Same pink button everywhere; `size` only changes how big it is. */
export function SupportLink({ size = "md", label = LABEL, className = "", onClick }: { size?: "sm" | "md"; label?: string; className?: string; onClick?: () => void }) {
  return (
    <a
      href={SUPPORT_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-pink-500 font-semibold text-white transition-colors hover:bg-pink-600 ${size === "sm" ? "px-3 py-2 text-sm" : "px-5 py-2"} ${className}`}
    >
      <Coffee className={size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]"} aria-hidden="true" />
      <span>{label}</span>
    </a>
  )
}

/** The full call-to-action block: a line of text and the button. Used in the footer and at the end of pages. */
export function SupportButton({ className = "my-8" }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <p className="mb-3 text-sm opacity-80">Enjoyed the chaos? Help keep PrankSims free and ad-free.</p>
      <SupportLink />
    </div>
  )
}
