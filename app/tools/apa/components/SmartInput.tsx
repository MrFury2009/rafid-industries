'use client'

import { useCallback, useRef, useState } from 'react'
import { detectInputType } from '../lib/detect'
import type { DetectedType } from '../lib/types'

interface SmartInputProps {
  onSubmit: (type: DetectedType, value: string) => void
  isLoading?: boolean
}

const TYPE_LABELS: Record<DetectedType, string> = {
  doi: 'DOI',
  arxiv: 'arXiv',
  pmid: 'PubMed ID',
  isbn: 'ISBN',
  url: 'URL',
  bibtex: 'BibTeX',
  ris: 'RIS',
  raw: 'Raw Citation',
}

export function SmartInput({ onSubmit, isLoading = false }: SmartInputProps) {
  const [input, setInput] = useState('')
  const [detected, setDetected] = useState<DetectedType | null>(null)
  const [showOverride, setShowOverride] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()

  const handleInputChange = (value: string) => {
    setInput(value)
    setShowOverride(false)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      const result = detectInputType(value)
      setDetected(result?.type || null)
    }, 300)
  }

  const handleSubmit = (type?: DetectedType) => {
    const finalType = type || detected || 'raw'
    if (input.trim()) {
      onSubmit(finalType, input.trim())
      setInput('')
      setDetected(null)
      setShowOverride(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit()
          }}
          placeholder="Paste DOI, ISBN, URL, arXiv ID, PMID, or citation..."
          className="flex-1 rounded-none border px-4 py-3 text-sm transition-colors"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text)',
          }}
          disabled={isLoading}
        />
        <button
          onClick={() => handleSubmit()}
          disabled={!input.trim() || isLoading}
          className="rounded-none border px-6 py-3 text-sm font-medium transition-colors disabled:opacity-50"
          style={{
            backgroundColor: 'var(--sage)',
            borderColor: 'var(--sage)',
            color: 'white',
          }}
        >
          {isLoading ? 'Loading...' : 'Add'}
        </button>
      </div>

      {detected && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOverride(!showOverride)}
            className="inline-flex items-center gap-2 rounded-none bg-sage/10 px-3 py-1 text-xs font-semibold transition-colors hover:bg-sage/20"
            style={{ color: 'var(--sage)' }}
          >
            {TYPE_LABELS[detected]}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 11 4 6 9" />
            </svg>
          </button>

          {showOverride && (
            <div className="flex gap-1 flex-wrap">
              {(Object.keys(TYPE_LABELS) as DetectedType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    handleSubmit(type)
                    setShowOverride(false)
                  }}
                  className="rounded-none border px-2 py-1 text-xs transition-colors"
                  style={{
                    backgroundColor: 'var(--elevated)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                  }}
                >
                  {TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
