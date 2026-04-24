'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import { useRef } from 'react'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/tools', label: 'Educational Tools' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
]

export function Nav() {
  const pathname = usePathname()
  const { theme, toggle, mounted } = useTheme()
  const toggleBtnRef = useRef<HTMLButtonElement>(null)

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-serif text-xl font-semibold tracking-wide transition-colors duration-200"
          style={{ color: 'var(--text)' }}
        >
          Rafid Industries
        </Link>

        {/* Links */}
        <ul className="flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className="nav-link text-sm font-medium tracking-wide"
                  style={{ color: isActive ? 'var(--sage)' : 'var(--muted)' }}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Dark mode toggle
            Only shows theme-specific icon after client mount to prevent
            hydration mismatch (server always sees 'light'). */}
        <button
          ref={toggleBtnRef}
          onClick={() => toggle(toggleBtnRef.current ?? undefined)}
          aria-label={
            mounted && theme === 'dark'
              ? 'Switch to light mode'
              : 'Switch to dark mode'
          }
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200"
          style={{
            backgroundColor: 'var(--elevated)',
            color: 'var(--text)',
          }}
        >
          {/* Render a placeholder circle until mounted — no hydration mismatch */}
          {!mounted ? (
            <span
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: 'var(--muted)', opacity: 0.4 }}
            />
          ) : theme === 'dark' ? (
            <SunIcon />
          ) : (
            <MoonIcon />
          )}
        </button>
      </nav>
    </header>
  )
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
