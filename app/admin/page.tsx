import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Admin sections: never need SSR, auth-gated, heavy — load dynamically
const AdminDashboard = dynamic(
  () => import('@/components/admin/AdminDashboard'),
  {
    ssr: false,
    loading: () => <AdminSkeleton />,
  },
)

export const metadata = {
  title: 'Admin Dashboard',
}

// Server-side auth check
function isAuthenticated(): boolean {
  try {
    const cookieStore = cookies()
    const session = cookieStore.get('ri-admin-session')
    return session?.value === process.env.ADMIN_PASSWORD
  } catch {
    return false
  }
}

export default function AdminPage() {
  if (!isAuthenticated()) {
    redirect('/admin/login')
  }

  return (
    <main className="min-h-screen px-6 py-12" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <h1
            className="font-serif text-3xl font-semibold"
            style={{ color: 'var(--text)' }}
          >
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Rafid Industries internal control panel
          </p>
        </header>

        <Suspense fallback={<AdminSkeleton />}>
          <AdminDashboard />
        </Suspense>
      </div>
    </main>
  )
}

function AdminSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-24 rounded-xl"
            style={{ backgroundColor: 'var(--surface)' }}
          />
        ))}
      </div>
      {/* Table skeleton */}
      <div
        className="rounded-xl border"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
      >
        <div className="p-4 space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 rounded-lg"
              style={{ backgroundColor: 'var(--elevated)' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
