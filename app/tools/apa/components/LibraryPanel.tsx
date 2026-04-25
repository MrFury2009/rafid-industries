'use client'

import { useEffect, useState } from 'react'
import { CopyButton } from '@/components/ui/CopyButton'
import type { LibraryEntry } from '../lib/types'

const STORAGE_KEY = 'ri:apa:library:v1'

interface LibraryPanelProps {
  isOpen: boolean
  entries: LibraryEntry[]
  onDelete: (id: string) => void
}

export function LibraryPanel({ isOpen, entries, onDelete }: LibraryPanelProps) {
  const sorted = [...entries].sort((a, b) => {
    const aFamily = a.source.authors?.[0]?.family || ''
    const bFamily = b.source.authors?.[0]?.family || ''
    return aFamily.localeCompare(bFamily)
  })

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 left-auto right-0 z-40 w-96 border-l overflow-y-auto flex flex-col"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        top: '60px', // Below the nav
      }}
    >
      <div className="p-6 flex-1 space-y-4">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
          My Citations
        </h2>

        {entries.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            No citations yet. Add one to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {sorted.map((entry) => (
              <div
                key={entry.id}
                className="p-3 rounded-none border space-y-2"
                style={{
                  backgroundColor: 'var(--elevated)',
                  borderColor: 'var(--border)',
                }}
              >
                <h3
                  className="text-sm font-semibold line-clamp-2"
                  style={{ color: 'var(--text)' }}
                >
                  {entry.source.title}
                </h3>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  {entry.source.authors?.[0]?.family || 'Unknown'}
                  {entry.source.year ? ` (${entry.source.year})` : ''}
                </p>
                <div className="flex gap-2 text-xs">
                  <CopyButton text={entry.reference} label="Copy reference" />
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="px-3 py-2 font-medium rounded-none border transition-colors"
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: 'var(--border)',
                      color: 'var(--text)',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer action */}
      {entries.length > 0 && (
        <div className="border-t p-4" style={{ borderColor: 'var(--border)' }}>
          <button
            className="w-full px-4 py-2 text-sm font-medium rounded-none transition-colors"
            style={{
              backgroundColor: 'var(--sage)',
              color: 'white',
            }}
          >
            Export All
          </button>
        </div>
      )}
    </div>
  )
}
