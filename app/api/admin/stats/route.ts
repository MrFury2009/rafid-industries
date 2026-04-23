import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAdminStats, getClearAirChecks } from '@/lib/kv'

/**
 * Admin stats API — returns pageview data for the admin dashboard.
 * Protected by cookie-based session check.
 */
export async function GET(request: NextRequest) {
  try {
    // Auth check
    const cookieStore = cookies()
    const session = cookieStore.get('ri-admin-session')
    if (!session || session.value !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [stats, clearairChecks] = await Promise.all([
      getAdminStats(),
      getClearAirChecks(),
    ])

    // Build rows for table (could be expanded with real KV scan)
    const rows = stats
      ? [
          { page: '/', views: stats.homeViews },
          { page: '/products', views: stats.productsViews },
        ].filter((r) => r.views > 0)
      : []

    return NextResponse.json({ stats, rows, clearairChecks })
  } catch (err) {
    console.error('[admin/stats] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
