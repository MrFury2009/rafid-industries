import { NextResponse } from 'next/server'
import type { NextRequest, NextFetchEvent } from 'next/server'

export function middleware(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl

  // Only track GET requests; skip non-page paths
  if (req.method === 'GET') {
    const track = fetch(new URL('/api/track-view', req.url), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ page: pathname }),
    }).catch(() => {})

    if (typeof event.waitUntil === 'function') {
      event.waitUntil(track)
    }
    // else: fire-and-forget (track promise runs without waiting)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - /admin and sub-paths
     * - /api and sub-paths
     * - /_next (Next.js internals)
     * - files with an extension (favicon.svg, robots.txt, etc.)
     */
    '/((?!admin|api|_next|[^/]+\\.[^/]+$).*)',
  ],
}
