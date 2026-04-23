'use client'

import { useState, useTransition } from 'react'
import { loginAction } from '@/app/admin/login/actions'

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await loginAction(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center px-6"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border p-8"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--surface)',
        }}
      >
        <h1
          className="font-serif text-2xl font-semibold"
          style={{ color: 'var(--text)' }}
        >
          Admin Login
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
          Rafid Industries internal access
        </p>

        <form action={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium uppercase tracking-wider"
              style={{ color: 'var(--muted)' }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--elevated)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full py-3 text-sm font-semibold transition-opacity duration-200 disabled:opacity-50"
            style={{ backgroundColor: 'var(--sage)', color: '#fff' }}
          >
            {isPending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  )
}
