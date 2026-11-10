import { headers } from "next/headers"

export const dynamic = "force-dynamic"

/**
 * Tells the browser which country it is in so only visitors who need a consent
 * prompt see one. Vercel adds x-vercel-ip-country on deployments; locally it is
 * absent, so local testing behaves like an unknown country (prompt shown).
 *
 * This is a tiny dynamic route on purpose: reading headers in layout.tsx would
 * make every page dynamic and slow the whole site down.
 */
export async function GET() {
  const h = await headers()
  const country = h.get("x-vercel-ip-country")
  return Response.json({ country }, { headers: { "Cache-Control": "private, no-store" } })
}
