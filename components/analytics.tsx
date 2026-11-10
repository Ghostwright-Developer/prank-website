"use client"

import { Analytics as VercelAnalytics } from "@vercel/analytics/next"

/** Vercel Web Analytics. Needs Web Analytics enabled in the Vercel dashboard. */
export function Analytics() {
  return <VercelAnalytics />
}
