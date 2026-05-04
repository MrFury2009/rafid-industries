import { NextRequest, NextResponse } from 'next/server'
import { incrementPageViews } from '@/lib/kv'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const page = typeof body?.page === 'string' ? body.page : '/'
    await incrementPageViews(page)
  } catch {
    // non-critical — always return success
  }
  return NextResponse.json({ success: true })
}
