'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

/* ── Types ──────────────────────────────────────────────────────────── */
type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggle: (buttonEl?: HTMLElement) => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggle: () => {},
  mounted: false,
})

export function useTheme() {
  return useContext(ThemeContext)
}

/* ── Fragment geometry ──────────────────────────────────────────────── */
// 4 irregular convex polygons — broken ice / cracked glass shards
const FRAGMENTS = [
  {
    clip: 'polygon(0% 0%, 68% 0%, 58% 45%, 30% 72%, 0% 60%)',
    dx: '-52px',
    dy: '-40px',
    delay: 0,
  },
  {
    clip: 'polygon(62% 0%, 100% 0%, 100% 55%, 72% 68%, 44% 30%)',
    dx: '48px',
    dy: '-36px',
    delay: 60,
  },
  {
    clip: 'polygon(0% 58%, 34% 70%, 50% 100%, 0% 100%)',
    dx: '-44px',
    dy: '42px',
    delay: 120,
  },
  {
    clip: 'polygon(45% 42%, 78% 62%, 100% 52%, 100% 100%, 38% 100%)',
    dx: '56px',
    dy: '48px',
    delay: 180,
  },
]

const DURATION = 550
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'
const MAX_DELAY = Math.max(...FRAGMENTS.map((f) => f.delay))

/* ── Helpers ─────────────────────────────────────────────────────────── */
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = localStorage.getItem('ri-theme') as Theme | null
    if (stored === 'dark' || stored === 'light') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  } catch {
    return 'light'
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  try {
    localStorage.setItem('ri-theme', theme)
  } catch {
    // Safari private mode — ignore safely
  }
}

/* ── Multi-fragment animation ────────────────────────────────────────── */
function runFragmentTransition(nextTheme: Theme, onSwitch: () => void) {
  // Skip animation if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    onSwitch()
    return
  }

  const destBg = nextTheme === 'dark' ? '#1A1410' : '#F5F4EF'
  const timers: ReturnType<typeof setTimeout>[] = []

  // Inject fragment elements
  const fragEls = FRAGMENTS.map((f) => {
    const el = document.createElement('div')
    el.className = 'theme-fragment'
    el.style.cssText = [
      `clip-path: ${f.clip}`,
      `background-color: ${destBg}`,
      `transform: translateX(${f.dx}) translateY(${f.dy})`,
      'opacity: 0',
      // Transition applied after reflow
    ].join(';')
    document.body.appendChild(el)
    return { el, f }
  })

  const doAnimate = () => {
    // Force reflow so initial state is established
    void document.body.getBoundingClientRect()

    // Apply transitions and animate fragments to identity
    fragEls.forEach(({ el, f }) => {
      el.style.transition = [
        `transform ${DURATION}ms ${EASING} ${f.delay}ms`,
        `opacity ${DURATION}ms ${EASING} ${f.delay}ms`,
      ].join(',')
      el.style.transform = 'translateX(0) translateY(0)'
      el.style.opacity = '1'
    })

    // Switch theme at the midpoint of the last fragment's animation
    const switchAt = DURATION / 2 + MAX_DELAY
    timers.push(
      setTimeout(() => {
        onSwitch()
      }, switchAt),
    )

    // Fade fragments out
    const fadeAt = DURATION + MAX_DELAY
    timers.push(
      setTimeout(() => {
        fragEls.forEach(({ el, f }) => {
          el.style.transition = `opacity ${DURATION * 0.6}ms ${EASING}`
          el.style.opacity = '0'
        })
        // Remove after fade
        timers.push(
          setTimeout(() => {
            fragEls.forEach(({ el }) => {
              el.parentNode?.removeChild(el)
            })
          }, DURATION * 0.6 + 50),
        )
      }, fadeAt),
    )
  }

  if ('startViewTransition' in document) {
    // Use View Transitions as the framing mechanism
    ;(document as Document & { startViewTransition: (cb: () => void) => unknown })
      .startViewTransition(() => {
        doAnimate()
      })
  } else {
    doAnimate()
  }
}

/* ── Provider ────────────────────────────────────────────────────────── */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialise with 'light' on server; useEffect reads real preference.
  // suppressHydrationWarning on <html> handles the class difference.
  // The no-flash script is in layout.tsx (next/script beforeInteractive).
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initial = getInitialTheme()
    setTheme(initial)
    // applyTheme call here syncs React state to what the script already set
    applyTheme(initial)
    setMounted(true)
  }, [])

  const toggle = useCallback(
    (_buttonEl?: HTMLElement) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark'
      runFragmentTransition(next, () => {
        applyTheme(next)
        setTheme(next)
      })
    },
    [theme],
  )

  return (
    <ThemeContext.Provider value={{ theme, toggle, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}
