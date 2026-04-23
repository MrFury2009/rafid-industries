'use client'

import { useEffect, useRef, useState } from 'react'

interface StatCounterProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  label: string
}

export function StatCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 600,
  label,
}: StatCounterProps) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const hasRunRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Respect reduced motion — show final value immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRunRef.current) {
          hasRunRef.current = true
          observer.unobserve(el)

          const animate = (timestamp: number) => {
            if (startTimeRef.current === null) startTimeRef.current = timestamp
            const elapsed = timestamp - startTimeRef.current
            const progress = Math.min(elapsed / duration, 1)
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(Math.round(eased * value))

            if (progress < 1) {
              rafRef.current = requestAnimationFrame(animate)
            }
          }

          rafRef.current = requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration])

  return (
    <div ref={containerRef} className="text-center">
      <p
        className="stat-counter font-serif text-5xl font-semibold"
        style={{ color: 'var(--sage)' }}
      >
        {prefix}{display.toLocaleString()}{suffix}
      </p>
      <p className="mt-2 text-sm font-medium" style={{ color: 'var(--muted)' }}>
        {label}
      </p>
    </div>
  )
}
