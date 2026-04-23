import { NextResponse, type NextRequest } from 'next/server'

/**
 * Pageview tracking middleware.
 *
 * Safety checks:
 * 1. Only runs on HTML navigation requests (not assets, API, _next)
 * 2. Does NOT block the response — fire-and-forget KV increment
 * 3. Skips bot User-Agents to avoid inflating counts
 * 4. No request loops (does not rewrite to self)
 */

const BOT_UA_PATTERN =
  /bot|crawl|spider|wget|curl|python|java|Go-http|axios|slurp|mediapartners/i

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Guard: only track HTML page navigations ──────────────────────────
  const isPageRequest =
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/favicon') &&
    !pathname.match(/\.(svg|png|jpg|jpeg|webp|ico|css|js|woff2?|ttf)$/)

  if (!isPageRequest) {
    return NextResponse.next()
  }

  // ── Guard: skip bots ─────────────────────────────────────────────────
  const ua = request.headers.get('user-agent') ?? ''
  if (BOT_UA_PATTERN.test(ua)) {
    return NextResponse.next()
  }

  // ── Fire-and-forget KV increment via API route ───────────────────────
  // We call our own internal API route so the middleware stays lightweight
  // and doesn't import KV (which requires Node.js runtime, not Edge).
  // Using request.nextUrl.origin ensures no external request.
  const trackUrl = new URL('/api/track', request.nextUrl.origin)
  trackUrl.searchParams.set('page', pathname)

  // Fire and forget — do not await, do not block the response
  fetch(trackUrl.toString(), {
    method: 'POST',
    headers: { 'x-internal-tracking': '1' },
  }).catch(() => {
    // Silently ignore — tracking is non-critical
  })

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
