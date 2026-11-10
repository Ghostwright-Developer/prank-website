/**
 * Analytics consent for PrankSims.
 *
 * - Vercel Web Analytics (already on the site) is cookie-less and is NOT governed by this.
 * - Google Analytics (GA4) is only loaded when allowed:
 *     * visitors from the EU/EEA, UK, Switzerland, or an unknown country must opt in
 *     * everyone else is counted by default and can opt out via "Analytics settings"
 */

export type Consent = "granted" | "denied" | "unknown"

const KEY = "pranksims:analytics-consent"
const REGION_KEY = "pranksims:region"
const MAX_AGE_MS = 365 * 24 * 3600 * 1000 // ask again after a year

/** Declared here (not in the API route) so the client never needs the full list. */
export const CONSENT_REGIONS = new Set([
  // EU
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  // EEA + UK + Switzerland
  "IS", "LI", "NO", "GB", "CH",
])

export function readConsent(): Consent {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return "unknown"
    const { v, t } = JSON.parse(raw) as { v: Consent; t: number }
    if (Date.now() - t > MAX_AGE_MS) return "unknown"
    return v === "granted" || v === "denied" ? v : "unknown"
  } catch {
    return "unknown"
  }
}

export function writeConsent(v: "granted" | "denied") {
  try { localStorage.setItem(KEY, JSON.stringify({ v, t: Date.now() })) } catch { /* private mode: choice lasts this page only */ }
}

/** Does this visitor have to opt in first? Cached for the tab; fails safe (true) when unsure. */
export async function needsConsent(): Promise<boolean> {
  try {
    const cached = sessionStorage.getItem(REGION_KEY)
    if (cached) return cached === "1"
  } catch { /* ignore */ }
  let needs = true
  try {
    const res = await fetch("/api/region", { cache: "no-store" })
    if (res.ok) {
      const { country } = (await res.json()) as { country: string | null }
      needs = !country || CONSENT_REGIONS.has(country.toUpperCase())
    }
  } catch { /* offline or blocked: keep the safe default */ }
  try { sessionStorage.setItem(REGION_KEY, needs ? "1" : "0") } catch { /* ignore */ }
  return needs
}
