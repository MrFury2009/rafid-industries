import { NextRequest, NextResponse } from 'next/server'
import { incrementPageview } from '@/lib/kv'

/**
 * Internal pageview tracking endpoint.
 * Only accepts requests from our own middleware (x-internal-tracking header).
 */
export async function POST(request: NextRequest) {
  try {
    // Verify this is an internal request
    const internalHeader = request.headers.get('x-internal-tracking')
    if (internalHeader !== '1') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const page = request.nextUrl.searchParams.get('page')
    if (!page || typeof page !== 'string') {
      return NextResponse.json({ error: 'Missing page param' }, { status: 400 })
    }

    // Sanitise page key — only alphanumeric, hyphens, slashes
    const safeKey = page.replace(/[^a-z0-9\-\/]/gi, '').slice(0, 100)

    await incrementPageview(safeKey)
    await incrementPageview('total')

    return NextResponse.json({ ok: true })
  } catch (err) {
    // Never throw — return typed error JSON
    console.error('[track] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
