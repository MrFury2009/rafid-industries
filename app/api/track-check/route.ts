import { NextResponse } from 'next/server'
import { incrementClearAirChecks } from '@/lib/kv'

export async function POST() {
  try {
    const total = await incrementClearAirChecks()
    return NextResponse.json({ success: true, total })
  } catch {
    return NextResponse.json({ success: true, total: 0 })
  }
}
