'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

type Direction = 'up' | 'left' | 'right' | 'fade'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  /** Override the initial tween vars (merged with direction defaults) */
  from?: Record<string, unknown>
  direction?: Direction
}

function getFromVars(direction: Direction): Record<string, unknown> {
  switch (direction) {
    case 'left':
      return { opacity: 0, x: -32, y: 0 }
    case 'right':
      return { opacity: 0, x: 32, y: 0 }
    case 'fade':
      return { opacity: 0, y: 0 }
    case 'up':
    default:
      return { opacity: 0, y: 32 }
  }
}

function getToVars(direction: Direction): Record<string, unknown> {
  switch (direction) {
    case 'left':
    case 'right':
      return { opacity: 1, x: 0 }
    case 'fade':
      return { opacity: 1 }
    case 'up':
    default:
      return { opacity: 1, y: 0 }
  }
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  from,
  direction = 'up',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) return

    let gsap: typeof import('gsap').gsap
    let ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger
    let ctx: ReturnType<typeof gsap.context> | undefined
    let trigger: ScrollTrigger | undefined

    async function init() {
      const gsapMod = await import('gsap')
      const stMod = await import('gsap/ScrollTrigger')
      gsap = gsapMod.gsap
      ScrollTrigger = stMod.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      const fromVars = { ...getFromVars(direction), ...from }
      const toVars = getToVars(direction)

      ctx = gsap.context(() => {
        gsap.fromTo(el, fromVars, {
          ...toVars,
          duration: 1.1,
          ease: 'power2.out',
          delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })
      })
    }

    init()

    return () => {
      ctx?.revert()
    }
  }, [delay, direction, from])

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  )
}
