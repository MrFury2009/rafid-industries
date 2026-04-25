'use client'

import { useState } from 'react'
import type { DetectedType, Source } from '../lib/types'

interface BulkPasteProps {
  onResults: (results: Array<{ source: Source | null; error?: string }>) => void
  isLoading?: boolean
}

export function BulkPaste({ onResults, isLoading = false }: BulkPasteProps) {
  const [input, setInput] = useState('')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleSubmit = async () => {
    const lines = input
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    if (lines.length === 0) return

    setProcessing(true)
    setProgress(0)

    const results: Array<{ source: Source | null; error?: string }> = []
    const total = lines.length

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      try {
        // Simple detection - just try to detect type
        const response = await fetch('/api/tools/apa/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'raw', value: line }),
        })

        const data = await response.json()

        if (data.source) {
          results.push({ source: data.source })
        } else {
          results.push({ source: null, error: data.error || 'Failed to resolve' })
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        results.push({ source: null, error: message })
      }

      setProgress(((i + 1) / total) * 100)
      // Stagger requests by 100ms
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    setProcessing(false)
    onResults(results)
  }

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste one citation per line..."
        className="w-full h-40 px-4 py-3 rounded-none border text-sm font-mono resize-none"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--text)',
        }}
        disabled={processing}
      />

      {processing && (
        <div className="space-y-2">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            Processing {Math.floor(progress)}/100%
          </div>
          <div
            className="h-1 rounded-none overflow-hidden"
            style={{ backgroundColor: 'var(--elevated)' }}
          >
            <div
              className="h-full transition-all"
              style={{
                backgroundColor: 'var(--sage)',
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!input.trim() || processing}
        className="w-full px-4 py-3 text-sm font-medium rounded-none transition-colors disabled:opacity-50"
        style={{
          backgroundColor: 'var(--sage)',
          color: 'white',
        }}
      >
        {processing ? 'Processing...' : 'Resolve All'}
      </button>
    </div>
  )
}
