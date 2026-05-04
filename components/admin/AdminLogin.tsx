'use client'

import { useState } from 'react'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        window.location.reload()
      } else {
        setError('Incorrect password.')
      }
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#0F0F0E', color: '#F5F4EF' }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xs">
        <div className="mb-4">
          <p className="font-sans font-medium text-xs uppercase tracking-[0.22em]" style={{ color: '#7A9E82' }}>
            Rafid Industries
          </p>
          <h1 className="font-sans text-xl font-medium mt-1" style={{ color: '#F5F4EF' }}>
            Admin
          </h1>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="font-sans text-sm px-4 py-3 border focus:outline-none focus:border-[#7A9E82] transition-colors"
          style={{
            backgroundColor: '#1A1410',
            borderColor: '#3D3028',
            color: '#F5F4EF',
          }}
        />

        {error && (
          <p className="font-sans text-xs text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="font-sans text-sm font-medium px-4 py-3 transition-opacity disabled:opacity-50"
          style={{ backgroundColor: '#7A9E82', color: '#F5F4EF' }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
