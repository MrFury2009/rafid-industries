import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    const expected = process.env.ADMIN_PASSWORD ?? ''

    if (!expected || password !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const res = NextResponse.json({ success: true })
    res.headers.set(
      'Set-Cookie',
      'ri_admin_auth=1; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400'
    )
    return res
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
