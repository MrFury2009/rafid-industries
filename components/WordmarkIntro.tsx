'use client'

import { useEffect, useRef, useState } from 'react'

const WORDMARK = 'RAFID INDUSTRIES'
const SESSION_KEY = 'ri:intro:seen'

export function WordmarkIntro() {
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Gate: only show on first visit per session
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(SESSION_KEY)) return

    sessionStorage.setItem(SESSION_KEY, '1')
    setVisible(true)

    // Stagger letters in, then fade out after a hold
    const holdMs = 1200
    const fadeMs = 600
    const staggerMs = 60
    const totalStagger = WORDMARK.length * staggerMs
    const totalIn = totalStagger + 400

    const holdTimer = setTimeout(() => {
      setAnimating(true) // triggers fade-out class
    }, totalIn + holdMs)

    const unmountTimer = setTimeout(() => {
      setVisible(false)
    }, totalIn + holdMs + fadeMs)

    return () => {
      clearTimeout(holdTimer)
      clearTimeout(unmountTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#F5F4EF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: animating ? 0 : 1,
        transition: animating ? 'opacity 0.6s cubic-bezier(0.25,0.1,0.25,1)' : 'none',
        pointerEvents: animating ? 'none' : 'all',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 0,
          overflow: 'hidden',
        }}
      >
        {WORDMARK.split('').map((char, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontWeight: 500,
              fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
              letterSpacing: '0.25em',
              color: '#1A1A1A',
              opacity: 0,
              transform: 'translateY(12px)',
              animation: `ri-char-in 0.55s cubic-bezier(0.22,1,0.36,1) forwards`,
              animationDelay: `${i * 60}ms`,
              // Spaces need explicit width
              minWidth: char === ' ' ? '0.6em' : undefined,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes ri-char-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
