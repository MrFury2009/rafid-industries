import Link from 'next/link'

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Section strip — distinguishes Educational Tools from the ClearAir/Products section */}
      <div
        className="border-b px-6 py-3"
        style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)' }}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-2 text-xs font-medium tracking-wide uppercase">
          <Link
            href="/"
            className="transition-colors duration-150"
            style={{ color: 'var(--muted)' }}
          >
            Home
          </Link>
          <span style={{ color: 'var(--border)' }}>›</span>
          <span style={{ color: 'var(--sage)' }}>Educational Tools</span>
        </div>
      </div>

      {children}
    </>
  )
}
