'use client'

import { useEffect, useRef } from 'react'

interface StaggerProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  index?: number
  staggerMs?: number
}

const STAGGER_KEYFRAME = `
@keyframes stagger-fade-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  @keyframes stagger-fade-up {
    from {
      opacity: 1;
      transform: none;
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
}
`

export function StaggerContainer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    const styleId = 'stagger-keyframes'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = STAGGER_KEYFRAME
      document.head.appendChild(style)
    }
  }, [])

  return <>{children}</>
}

export function StaggerItem({
  children,
  index = 0,
  staggerMs = 60,
  duration = 400,
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const delay = index * staggerMs
          ref.current!.style.opacity = '0'
          ref.current!.style.transform = 'translateY(12px)'
          ref.current!.style.animation = `stagger-fade-up ${duration}ms ease-out both`
          ref.current!.style.animationDelay = `${delay}ms`
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [index, staggerMs, duration])

  return <div ref={ref}>{children}</div>
}
