import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { setHeroText, setAdminNotes } from '@/lib/kv'

export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  if (cookieStore.get('ri_admin_auth')?.value !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { key, value } = await req.json()

    if (key === 'hero_text') {
      await setHeroText(String(value ?? ''))
    } else if (key === 'admin_notes') {
      await setAdminNotes(String(value ?? ''))
    } else {
      return NextResponse.json({ error: 'Unknown key' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
