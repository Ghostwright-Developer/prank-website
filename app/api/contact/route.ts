import { NextRequest, NextResponse } from "next/server"

// ---------------------------------------------------------------------------
// In-memory rate limiter (best-effort on Vercel serverless)
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  if (entry.count >= RATE_LIMIT_MAX) return true
  entry.count++
  return false
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
const silentSuccess = () =>
  NextResponse.json({ ok: true }, { status: 200 })

// ---------------------------------------------------------------------------
// POST /api/contact
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  // --- Origin check ---
  const allowedOrigin = process.env.ALLOWED_ORIGIN
  const origin = req.headers.get("origin") ?? ""
  const referer = req.headers.get("referer") ?? ""

  if (allowedOrigin) {
    const originOk =
      origin.startsWith(allowedOrigin) || referer.startsWith(allowedOrigin)
    if (!originOk) {
      return silentSuccess() // silent reject
    }
  }

  // --- Rate limit ---
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"

  if (isRateLimited(ip)) {
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
    _hp,        // honeypot field
    _t,         // load timestamp (ms)
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
  if (message.length > 2000) {
    return NextResponse.json({ error: "Message is too long (max 2000 characters)." }, { status: 422 })
  }
  if (hasExcessiveUrls(message)) {
    return silentSuccess()
  }
  if (hasRepeatedChars(message)) {
    return silentSuccess()
  }
  if (looksLikeGibberish(message)) {
    return silentSuccess()
  }

  // --- Sanitize optional signature ---
  const sig = stripHtml(String(signature ?? "")).slice(0, 100)

  // --- Send via EmailJS REST API (server-side) ---
  const serviceId  = process.env.EMAILJS_SERVICE_ID
  const templateId = process.env.EMAILJS_TEMPLATE_ID
  const privateKey = process.env.EMAILJS_PRIVATE_KEY

  if (!serviceId || !templateId || !privateKey) {
    // In development / missing config: log and silently succeed so the form is usable
    console.warn("[contact] EmailJS env vars not set — message NOT sent. From:", email, "| Message:", message)
    return NextResponse.json({ ok: true })
  }

  const emailjsRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
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
  })

  if (!emailjsRes.ok) {
    const text = await emailjsRes.text()
    console.error("[contact] EmailJS error:", text)
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
