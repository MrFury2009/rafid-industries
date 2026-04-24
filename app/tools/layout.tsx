import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Educational Tools',
  description: 'Free, precise tools for students and researchers.',
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Subtle header strip */}
      <div
        className="border-b py-3 px-6"
        style={{
          backgroundColor: 'var(--elevated)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium tracking-wide" style={{ color: 'var(--muted)' }}>
            TOOLS
          </p>
        </div>
      </div>
      {children}
    </>
  )
}
