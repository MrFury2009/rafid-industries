'use client'

import { useEffect, useState } from 'react'
import { StatCounter } from '@/components/StatCounter'

interface Stats {
  totalPageviews: number
  homeViews: number
  productsViews: number
}

interface PageviewRow {
  page: string
  views: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [rows, setRows] = useState<PageviewRow[]>([])
  const [clearairChecks, setClearairChecks] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        const res = await fetch('/api/admin/stats')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!cancelled) {
          setStats(data.stats ?? null)
          setRows(data.rows ?? [])
          setClearairChecks(data.clearairChecks ?? 0)
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load stats. KV may not be configured.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl"
              style={{ backgroundColor: 'var(--surface)' }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {error && (
        <div
          className="rounded-lg border px-4 py-3 text-sm"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--muted)',
          }}
          role="alert"
        >
          ⚠️ {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Pageviews', value: stats?.totalPageviews ?? 0 },
          { label: 'Home Views', value: stats?.homeViews ?? 0 },
          { label: 'Products Views', value: stats?.productsViews ?? 0 },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border p-6"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--surface)',
            }}
          >
            <StatCounter value={value} label={label} />
          </div>
        ))}
      </div>

      {/* ClearAir usage */}
      <div
        className="rounded-xl border p-6"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="font-serif text-lg font-semibold"
            style={{ color: 'var(--text)' }}
          >
            ClearAir Usage
          </h2>
          <span
            className="flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium"
            style={{ borderColor: 'var(--sage)', color: 'var(--sage)' }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#7A9E82' }} />
            Live
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span
            className="font-serif text-4xl"
            style={{ color: 'var(--sage)', fontWeight: 300 }}
          >
            {clearairChecks.toLocaleString('en-US')}
          </span>
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            airspace checks run
          </span>
        </div>
        <p className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
          KV key: <code className="font-mono">clearair_checks</code>
        </p>
      </div>

      {/* Pageview table */}
      <div
        className="overflow-hidden rounded-xl border"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--surface)',
        }}
      >
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2
            className="font-serif text-lg font-semibold"
            style={{ color: 'var(--text)' }}
          >
            Page Views
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: 'var(--elevated)' }}>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: 'var(--muted)' }}
              >
                Page
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                style={{ color: 'var(--muted)' }}
              >
                Views
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-8 text-center text-sm"
                  style={{ color: 'var(--muted)' }}
                >
                  No pageview data yet.
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={row.page}
                  className="admin-row border-t"
                  style={{
                    animationDelay: `${i * 40}ms`,
                    borderColor: 'var(--border)',
                  }}
                >
                  <td className="px-6 py-3 font-mono" style={{ color: 'var(--text)' }}>
                    {row.page}
                  </td>
                  <td
                    className="px-6 py-3 text-right"
                    style={{ color: 'var(--sage)' }}
                  >
                    {row.views.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
