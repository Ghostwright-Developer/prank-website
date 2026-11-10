/**
 * PrankSims event tracking (GA4, sent with gtag, no Tag Manager needed).
 *
 * trackPrank() is safe to call from anywhere: it does nothing unless analytics
 * is allowed, and it never sends anything typed by the visitor.
 *
 * Events:
 *   prank_start          a prank screen opened
 *   prank_engaged        still on the same prank 10 seconds later
 *   prank_exit           viewer left with Esc/Q/exiting fullscreen (duration_s). Closing the tab is NOT seen.
 *   prank_next           picked "Try another" after a prank (exploring, not a replay)
 *   prank_share_attempt  opened a share route such as WhatsApp (share_method). A click is not proof it was sent.
 *   prank_link_copy      link or hidden link copied (share_method)
 *   prank_error          a screen crashed (error_code = error name only)
 * prank_name is the screen slug exactly as in the URL (e.g. minecraft-update).
 */

export type PrankAction =
  | "prank_start" | "prank_engaged" | "prank_exit" | "prank_next"
  | "prank_share_attempt" | "prank_link_copy" | "prank_error"

export interface PrankDetails {
  prank_name: string
  prank_category?: string
  share_method?: string
  duration_s?: number
  error_code?: string
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    __pkGA?: boolean
  }
}

let ready = false
let blocked = false
const pending: { action: PrankAction; d: PrankDetails }[] = []

/** Called by <AnalyticsConsent /> once GA is initialised. */
export function gaReady() {
  ready = true
  blocked = false
  // Events queued while waiting for the region check / script are kept until analytics
  // is definitely on (sent here) or definitely off (dropped in gaBlocked).
  while (pending.length) {
    const e = pending.shift()!
    void send(e.action, e.d)
  }
}

/** Called when analytics is not allowed. Drops anything waiting. */
export function gaBlocked() {
  ready = false
  blocked = true
  pending.length = 0
}

async function send(action: PrankAction, d: PrankDetails) {
  let category = d.prank_category
  if (!category && d.prank_name && d.prank_name !== "pranksims_site" && d.prank_name !== "unknown") {
    try {
      // Loaded only when an event is actually sent, so prank pages stay small.
      const { SCREENS } = await import("@/lib/screens")
      category = SCREENS.find((s) => s.slug === d.prank_name)?.category
    } catch { /* category is optional */ }
  }
  if (!ready) return // analytics was switched off while the category was loading
  window.gtag?.("event", action, { ...d, ...(category ? { prank_category: category } : {}) })
}

export function trackPrank(action: PrankAction, d: PrankDetails) {
  if (typeof window === "undefined" || !d.prank_name?.trim()) return
  if (ready) void send(action, d)
  else if (!blocked) {
    pending.push({ action, d })
    if (pending.length > 20) pending.shift()
  }
}

/** Slug of the prank page we are on (/screens/<slug>), or "" elsewhere. */
export const currentPrankSlug = () => (typeof location === "undefined" ? "" : location.pathname.split("/")[2] ?? "")
