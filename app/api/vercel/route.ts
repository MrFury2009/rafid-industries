import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  if (cookieStore.get('ri_admin_auth')?.value !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { endpoint, method = 'GET' } = await req.json()

    if (!endpoint || typeof endpoint !== 'string') {
      return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 })
    }

    const token = process.env.VERCEL_ACCESS_TOKEN ?? ''
    const url = `https://api.vercel.com${endpoint}`

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: 'Upstream error' }, { status: 502 })
  }
}
