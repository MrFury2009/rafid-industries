import { cookies } from 'next/headers'
import AdminLogin from '@/components/admin/AdminLogin'
import AdminDashboard from '@/components/admin/AdminDashboard'
import {
  getHeroText,
  getAdminNotes,
  getPageViews,
  getClearAirChecks,
} from '@/lib/kv'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin — Rafid Industries',
}

export default async function AdminPage() {
  const cookieStore = cookies()
  const isAuthed = cookieStore.get('ri_admin_auth')?.value === '1'

  if (!isAuthed) {
    return <AdminLogin />
  }

  const [heroText, adminNotes, viewsTotal, clearairChecks, homepageViews, toolsViews] =
    await Promise.all([
      getHeroText(),
      getAdminNotes(),
      getPageViews('total'),
      getClearAirChecks(),
      getPageViews('/'),
      getPageViews('/tools'),
    ])

  const pageViews: Record<string, number> = {
    '/': homepageViews,
    '/tools': toolsViews,
  }

  return (
    <AdminDashboard
      initialHeroText={heroText}
      initialAdminNotes={adminNotes}
      initialViewsTotal={viewsTotal}
      initialClearairChecks={clearairChecks}
      initialPageViews={pageViews}
      projectIdRI={process.env.VERCEL_PROJECT_ID_RI ?? ''}
      projectIdClearAir={process.env.VERCEL_PROJECT_ID_CLEARAIR ?? ''}
    />
  )
}
