'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Wordmark from './Wordmark'

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function Nav() {
  const [dark, setDark] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (typeof localStorage === 'undefined') return
    setDark(localStorage.getItem('ri_dark') === '1')
  }, [])

  const handleToggle = () => {
    const btn = toggleRef.current
    const nextDark = !dark

    if (btn) {
      const rect = btn.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      document.documentElement.style.setProperty('--toggle-x', `${x}px`)
      document.documentElement.style.setProperty('--toggle-y', `${y}px`)
    }

    const apply = () => {
      setDark(nextDark)
      if (nextDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      try {
        localStorage.setItem('ri_dark', nextDark ? '1' : '0')
      } catch {}
    }

    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(apply)
    } else {
      apply()
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-bg/95 dark:bg-dark-bg/95 backdrop-blur-sm border-b border-border dark:border-dark-border">
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Wordmark size="sm" />
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/tools" className="nav-link text-sm font-sans text-ink dark:text-dark-text">
            Tools
          </Link>
          <Link href="/about" className="nav-link text-sm font-sans text-ink dark:text-dark-text">
            About
          </Link>
          <button
            ref={toggleRef}
            onClick={handleToggle}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="text-ink dark:text-dark-text hover:text-sage dark:hover:text-sage transition-colors"
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </nav>
      </div>
    </header>
  )
}
