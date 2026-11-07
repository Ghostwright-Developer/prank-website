"use client"

import { Analytics as VercelAnalytics } from "@vercel/analytics/next"

/**
 * Vercel Web Analytics. The extra monitor pages (/blackout) are opened
 * automatically by the multi-monitor feature, so they are left out to keep
 * visitor and page-view counts honest.
 */
export function Analytics() {
  return <VercelAnalytics beforeSend={(event) => (event.url.includes("/blackout") ? null : event)} />
}
