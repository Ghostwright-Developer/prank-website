import { createHash } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { SITE_URL } from "@/lib/site"

// ---------------------------------------------------------------------------
// Rate limiting
//
// Serverless instances don't share memory, so an in-memory counter alone only
// limits one warm instance at a time. When Upstash Redis credentials are
// configured (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN, free tier is
// plenty) limits are enforced globally. Without them the in-memory limiter is
// used as a best-effort fallback so local dev and first deploys still work.
// ---------------------------------------------------------------------------
const RATE_LIMIT_MAX = 3 // messages per IP per window
const RATE_LIMIT_WINDOW_S = 10 * 60
const DAILY_GLOBAL_CAP = 100 // protects the EmailJS quota from distributed abuse

const memoryLimits = new Map<string, { count: number; resetAt: number }>()

function memoryRateLimited(key: string): boolean {
  const now = Date.now()
  if (memoryLimits.size > 1000) {
    for (const [k, v] of memoryLimits) if (now > v.resetAt) memoryLimits.delete(k)
  }
  const entry = memoryLimits.get(key)
  if (!entry || now > entry.resetAt) {
    memoryLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_S * 1000 })
    return false
  }
  if (entry.count >= RATE_LIMIT_MAX) return true
  entry.count++
  return false
}

/** INCR a key and set its expiry on first use. Returns the new count. */
async function upstashIncr(
  baseUrl: string,
  token: string,
  key: string,
  ttlSeconds: number,
): Promise<number> {
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, String(ttlSeconds), "NX"],
    ]),
    signal: AbortSignal.timeout(3000),
  })
  if (!res.ok) throw new Error(`Upstash ${res.status}`)
  const data = (await res.json()) as { result?: number }[]
  const count = data?.[0]?.result
  if (typeof count !== "number") throw new Error("Upstash: unexpected response")
  return count
}

async function isRateLimited(ip: string): Promise<boolean> {
  const hashedIp = createHash("sha256").update(ip).digest("hex").slice(0, 32)
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (url && token) {
    try {
      const day = new Date().toISOString().slice(0, 10)
      const [perIp, daily] = await Promise.all([
        upstashIncr(url, token, `pranksims:contact:ip:${hashedIp}`, RATE_LIMIT_WINDOW_S),
        upstashIncr(url, token, `pranksims:contact:day:${day}`, 24 * 60 * 60),
      ])
      return perIp > RATE_LIMIT_MAX || daily > DAILY_GLOBAL_CAP
    } catch (err) {
      console.error("[contact] Upstash rate limit failed, using in-memory fallback:", err)
    }
  }
  return memoryRateLimited(hashedIp)
}

// ---------------------------------------------------------------------------
// Origin check (exact match, never a prefix match)
// ---------------------------------------------------------------------------
function allowedOrigins(): Set<string> {
  const origins = new Set<string>()
  const add = (value?: string) => {
    if (!value) return
    try {
      origins.add(new URL(value.trim()).origin)
    } catch {
      /* ignore malformed entries */
    }
  }
  add(SITE_URL)
  // Apex and www are both valid origins for the same site.
  const host = new URL(SITE_URL).hostname
  const bare = host.replace(/^www\./, "")
  add(`https://${bare}`)
  add(`https://www.${bare}`)
  // Extra origins, comma separated (staging, custom domains).
  process.env.ALLOWED_ORIGIN?.split(",").forEach(add)
  if (process.env.VERCEL_URL) add(`https://${process.env.VERCEL_URL}`)
  if (process.env.NODE_ENV !== "production") {
    add("http://localhost:3000")
    add("http://127.0.0.1:3000")
  }
  return origins
}

function requestOrigin(req: NextRequest): string | null {
  const origin = req.headers.get("origin")
  if (origin) return origin
  const referer = req.headers.get("referer")
  if (!referer) return null
  try {
    return new URL(referer).origin
  } catch {
    return null
  }
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim()
}

function hasExcessiveUrls(str: string): boolean {
  const matches = str.match(/https?:\/\//gi)
  return (matches?.length ?? 0) > 2
}

function hasRepeatedChars(str: string): boolean {
  // e.g. "aaaaaaa" or "!!!!!!!"
  return /(.)\1{6,}/.test(str)
}

function looksLikeGibberish(str: string): boolean {
  // Ratio of non-alpha characters is very high
  const alpha = (str.match(/[a-zA-Z]/g) ?? []).length
  const total = str.replace(/\s/g, "").length
  return total > 20 && alpha / total < 0.3
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

// Generic success so bots never learn the real rejection reason
const silentSuccess = () => NextResponse.json({ ok: true }, { status: 200 })

// ---------------------------------------------------------------------------
// POST /api/contact
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  // --- Origin check ---
  const origin = requestOrigin(req)
  if (!origin || !allowedOrigins().has(origin)) {
    return silentSuccess() // silent reject
  }

  // --- Rate limit ---
  if (await isRateLimited(clientIp(req))) {
    return silentSuccess()
  }

  // --- Parse body ---
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const {
    from_name,
    reply_to,
    message_body,
    signature,
    _hp, // honeypot field
    _t, // load timestamp (ms)
  } = body as Record<string, string>

  // --- Honeypot ---
  if (_hp && _hp.trim().length > 0) {
    return silentSuccess()
  }

  // --- Timing check (< 3 seconds = bot) ---
  const loadedAt = parseInt(_t ?? "0", 10)
  const elapsed = Date.now() - loadedAt
  if (!loadedAt || elapsed < 3000) {
    return silentSuccess()
  }

  // --- Validate & sanitize name ---
  const name = stripHtml(String(from_name ?? "")).slice(0, 100)
  if (name.length < 2) {
    return NextResponse.json({ error: "Name is too short." }, { status: 422 })
  }

  // --- Validate email ---
  const email = String(reply_to ?? "").trim().slice(0, 254)
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 422 })
  }

  // --- Validate & sanitize message ---
  const message = stripHtml(String(message_body ?? "")).slice(0, 2000)
  if (message.length < 10) {
    return NextResponse.json({ error: "Message is too short (min 10 characters)." }, { status: 422 })
  }
  if (hasExcessiveUrls(message) || hasRepeatedChars(message) || looksLikeGibberish(message)) {
    return silentSuccess()
  }

  // --- Sanitize optional signature ---
  const sig = stripHtml(String(signature ?? "")).slice(0, 100)

  // --- Send via EmailJS REST API (server-side) ---
  const serviceId = process.env.EMAILJS_SERVICE_ID
  const templateId = process.env.EMAILJS_TEMPLATE_ID
  const privateKey = process.env.EMAILJS_PRIVATE_KEY

  if (!serviceId || !templateId || !privateKey) {
    // In development / missing config: log and silently succeed so the form is usable
    console.warn("[contact] EmailJS env vars not set - message NOT sent. From:", email, "| Message:", message)
    return NextResponse.json({ ok: true })
  }

  let emailjsRes: Response
  try {
    emailjsRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: privateKey,
        template_params: {
          from_name: name,
          reply_to: email,
          message_body: message,
          signature: sig,
        },
      }),
      signal: AbortSignal.timeout(10000),
    })
  } catch (err) {
    console.error("[contact] EmailJS request failed:", err)
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 502 },
    )
  }

  if (!emailjsRes.ok) {
    const text = await emailjsRes.text()
    console.error("[contact] EmailJS error:", text)
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}
