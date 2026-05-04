'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const sizeClasses: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

function WordmarkText({ size = 'sm' }: { size?: string }) {
  return (
    <span
      className={`font-sans font-medium uppercase tracking-[0.22em] ${sizeClasses[size] ?? sizeClasses.sm}`}
    >
      RAFID <span className="text-sage">I</span>NDUSTRIES
    </span>
  )
}

interface WordmarkProps {
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export default function Wordmark({ size = 'md', animated = false }: WordmarkProps) {
  const [mounted, setMounted] = useState(false)
  const [introActive, setIntroActive] = useState(false)
  const [stage, setStage] = useState<'center' | 'nav'>('center')

  useEffect(() => {
    setMounted(true)

    if (!animated) return

    if (typeof sessionStorage === 'undefined') return
    const played = sessionStorage.getItem('ri_intro_played')
    if (played) return

    sessionStorage.setItem('ri_intro_played', '1')
    setIntroActive(true)

    // Trigger the CSS transition after one frame
    const t1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => setStage('nav'))
    })
    // Remove overlay after transition completes
    const t2 = setTimeout(() => setIntroActive(false), 750)

    return () => {
      cancelAnimationFrame(t1)
      clearTimeout(t2)
    }
  }, [animated])

  // SSR / non-animated: static render
  if (!mounted || !animated) {
    return <WordmarkText size={size} />
  }

  if (!introActive) {
    return <WordmarkText size={size} />
  }

  // During intro: invisible placeholder in document flow + fixed overlay portal
  // The fixed overlay sits at the nav position (top: 1rem, left: 1.5rem)
  // In 'center' stage it's transformed to the viewport center + scaled up
  // In 'nav' stage it transitions back to (0,0) scale(1)
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: '1rem',
    left: '1.5rem',
    zIndex: 100,
    pointerEvents: 'none',
    transition: 'transform 0.6s ease-in-out',
    transform:
      stage === 'center'
        ? 'translate(calc(50vw - 1.5rem - 50%), calc(50vh - 1rem - 50%)) scale(3)'
        : 'translate(0px, 0px) scale(1)',
  }

  return (
    <>
      {/* Invisible placeholder to hold space in document flow */}
      <span className="invisible">
        <WordmarkText size={size} />
      </span>
      {createPortal(
        <div style={overlayStyle}>
          <WordmarkText size="sm" />
        </div>,
        document.body
      )}
    </>
  )
}
