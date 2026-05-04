'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface DashboardProps {
  initialHeroText: string
  initialAdminNotes: string
  initialViewsTotal: number
  initialClearairChecks: number
  initialPageViews: Record<string, number>
  projectIdRI: string
  projectIdClearAir: string
}

// Count-up animation hook
function useCountUp(target: number, duration = 600) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const start = performance.now()
    const step = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      setValue(Math.round(target * progress))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])

  return value
}

type Tab = 'deployments' | 'kv' | 'content' | 'notes'

const TABS: { id: Tab; label: string }[] = [
  { id: 'deployments', label: 'Deployments' },
  { id: 'kv', label: 'KV Stats' },
  { id: 'content', label: 'Content' },
  { id: 'notes', label: 'Notes' },
]

const dark = {
  bg: '#0F0F0E',
  surface: '#1A1410',
  border: '#3D3028',
  text: '#F0EDE8',
  muted: '#A89880',
  sage: '#7A9E82',
}

export default function AdminDashboard({
  initialHeroText,
  initialAdminNotes,
  initialViewsTotal,
  initialClearairChecks,
  initialPageViews,
  projectIdRI,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('kv')
  const [heroText, setHeroText] = useState(initialHeroText)
  const [notes, setNotes] = useState(initialAdminNotes)
  const [deployments, setDeployments] = useState<null | unknown[]>(null)
  const [deploymentsError, setDeploymentsError] = useState('')
  const [saveStatus, setSaveStatus] = useState('')
  const notesDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const totalViews = useCountUp(initialViewsTotal)
  const clearairChecks = useCountUp(initialClearairChecks)

  // Fetch deployments when tab opens
  useEffect(() => {
    if (activeTab !== 'deployments') return
    if (deployments !== null) return

    const fetchDeployments = async () => {
      try {
        const qs = projectIdRI ? `?projectId=${projectIdRI}&limit=10` : '?limit=10'
        const res = await fetch('/api/vercel', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ endpoint: `/v6/deployments${qs}` }),
        })
        const data = await res.json()
        setDeployments(data?.deployments ?? [])
      } catch {
        setDeploymentsError('Failed to load deployments.')
      }
    }

    fetchDeployments()
  }, [activeTab, deployments, projectIdRI])

  const saveContent = useCallback(async (key: string, value: string) => {
    setSaveStatus('Saving…')
    try {
      await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })
      setSaveStatus('Saved')
      setTimeout(() => setSaveStatus(''), 2000)
    } catch {
      setSaveStatus('Error saving')
    }
  }, [])

  const handleNotesChange = (val: string) => {
    setNotes(val)
    if (notesDebounceRef.current) clearTimeout(notesDebounceRef.current)
    notesDebounceRef.current = setTimeout(() => saveContent('admin_notes', val), 1000)
  }

  const s: React.CSSProperties = { color: dark.text }

  return (
    <div style={{ backgroundColor: dark.bg, color: dark.text, minHeight: '100vh' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.22em] mb-1" style={{ color: dark.sage }}>
              Rafid Industries
            </p>
            <h1 className="font-sans text-2xl font-medium" style={s}>Admin</h1>
          </div>
          {saveStatus && (
            <span className="font-sans text-xs" style={{ color: dark.muted }}>{saveStatus}</span>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / top tabs */}
          <aside className="md:w-40 flex-shrink-0">
            <nav className="flex md:flex-col gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="font-sans text-sm text-left px-3 py-2 transition-colors"
                  style={{
                    color: activeTab === tab.id ? dark.text : dark.muted,
                    backgroundColor: activeTab === tab.id ? dark.surface : 'transparent',
                    borderLeft: activeTab === tab.id ? `2px solid ${dark.sage}` : '2px solid transparent',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Tab content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'kv' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <StatCard label="Total Views" value={totalViews} color={dark.sage} />
                  <StatCard label="ClearAir Checks" value={clearairChecks} color={dark.sage} />
                  {Object.entries(initialPageViews).slice(0, 4).map(([page, count]) => (
                    <StatCard key={page} label={page} value={count} color={dark.muted} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'deployments' && (
              <div>
                {deploymentsError && (
                  <p className="font-sans text-sm" style={{ color: '#F87171' }}>{deploymentsError}</p>
                )}
                {deployments === null && !deploymentsError && (
                  <p className="font-sans text-sm" style={{ color: dark.muted }}>Loading…</p>
                )}
                {deployments && (deployments as DeploymentItem[]).map((d) => (
                  <DeploymentRow key={(d as DeploymentItem).uid} d={d as DeploymentItem} />
                ))}
                {deployments?.length === 0 && (
                  <p className="font-sans text-sm" style={{ color: dark.muted }}>No deployments found.</p>
                )}
              </div>
            )}

            {activeTab === 'content' && (
              <div>
                <label className="font-sans text-xs uppercase tracking-[0.22em] block mb-2" style={{ color: dark.sage }}>
                  Hero text
                </label>
                <textarea
                  value={heroText}
                  onChange={(e) => setHeroText(e.target.value)}
                  onBlur={() => saveContent('hero_text', heroText)}
                  rows={4}
                  className="w-full font-sans text-sm p-3 resize-none focus:outline-none"
                  style={{
                    backgroundColor: dark.surface,
                    border: `1px solid ${dark.border}`,
                    color: dark.text,
                  }}
                  placeholder="Precision software. Built in public."
                />
                <p className="font-sans text-xs mt-1" style={{ color: dark.muted }}>
                  Auto-saves on blur.
                </p>
              </div>
            )}

            {activeTab === 'notes' && (
              <div>
                <label className="font-sans text-xs uppercase tracking-[0.22em] block mb-2" style={{ color: dark.sage }}>
                  Admin notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  rows={12}
                  className="w-full font-sans text-sm p-3 resize-none focus:outline-none"
                  style={{
                    backgroundColor: dark.surface,
                    border: `1px solid ${dark.border}`,
                    color: dark.text,
                  }}
                  placeholder="Internal notes…"
                />
                <p className="font-sans text-xs mt-1" style={{ color: dark.muted }}>
                  Auto-saves 1s after you stop typing.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="p-4 border"
      style={{ borderColor: dark.border, backgroundColor: dark.surface }}
    >
      <p className="font-sans text-xs uppercase tracking-[0.12em] mb-1" style={{ color: dark.muted }}>
        {label}
      </p>
      <p className="font-sans text-2xl font-medium tabular-nums" style={{ color }}>
        {value.toLocaleString()}
      </p>
    </div>
  )
}

interface DeploymentItem {
  uid: string
  name: string
  url?: string
  state?: string
  created?: number
  createdAt?: number
}

function DeploymentRow({ d }: { d: DeploymentItem }) {
  const state = (d.state ?? '').toLowerCase()
  const stateColor =
    state === 'ready' ? '#7A9E82' :
    state === 'error' ? '#F87171' :
    dark.muted

  const ts = d.createdAt ?? d.created
  const date = ts ? new Date(ts).toLocaleDateString() : '—'

  return (
    <div
      className="flex items-center justify-between py-3 border-b font-sans text-sm"
      style={{ borderColor: dark.border, color: dark.text }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stateColor }} />
        <span className="truncate" style={{ color: dark.muted }}>{d.name ?? d.uid}</span>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <span className="text-xs" style={{ color: stateColor }}>{d.state ?? '—'}</span>
        <span className="text-xs" style={{ color: dark.muted }}>{date}</span>
      </div>
    </div>
  )
}
