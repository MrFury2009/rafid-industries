'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error reporting service in production
    console.error('[Global Error]', error)
  }, [error])

  return (
    <main
      className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <h1
        className="font-serif text-2xl font-semibold"
        style={{ color: 'var(--text)' }}
      >
        Something went wrong
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
        An unexpected error occurred. Our team has been notified.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
        style={{ backgroundColor: 'var(--sage)', color: '#fff' }}
      >
        Try Again
      </button>
    </main>
  )
}
