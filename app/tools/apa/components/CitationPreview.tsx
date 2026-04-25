'use client'

import { CopyButton } from '@/components/ui/CopyButton'
import { format as formatAPA7 } from '../lib/formatters/apa7'
import { format as formatAPA6 } from '../lib/formatters/apa6'
import { formatParenthetical, formatNarrative } from '../lib/formatters/intext'
import type { Source, FormatVersion } from '../lib/types'

interface CitationPreviewProps {
  source: Source | null
  version: FormatVersion
}

export function CitationPreview({ source, version }: CitationPreviewProps) {
  if (!source) {
    return (
      <div
        className="p-6 rounded-none border text-center"
        style={{
          backgroundColor: 'var(--elevated)',
          borderColor: 'var(--border)',
          color: 'var(--muted)',
        }}
      >
        <p className="text-sm">No citation loaded</p>
      </div>
    )
  }

  const formatter = version === 'apa7' ? formatAPA7 : formatAPA6
  const reference = formatter(source)
  const parenthetical = formatParenthetical(source, version)
  const narrative = formatNarrative(source, version)

  return (
    <div className="flex flex-col gap-6">
      {/* Reference Entry */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
          Reference Entry
        </h3>
        <div
          className="p-4 rounded-none border"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text)',
          }}
        >
          <p
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{
              textIndent: '-2em',
              paddingLeft: '2em',
            }}
          >
            {reference}
          </p>
        </div>
        <CopyButton text={reference} label="Copy reference" />
      </div>

      {/* In-Text Citations */}
      <div className="space-y-4">
        {/* Parenthetical */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
            In-text (Parenthetical)
          </h3>
          <div
            className="p-4 rounded-none border"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
            }}
          >
            <p className="text-sm font-mono">{parenthetical}</p>
          </div>
          <CopyButton text={parenthetical} label="Copy parenthetical" />
        </div>

        {/* Narrative */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
            In-text (Narrative)
          </h3>
          <div
            className="p-4 rounded-none border"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
            }}
          >
            <p className="text-sm font-mono">{narrative}</p>
          </div>
          <CopyButton text={narrative} label="Copy narrative" />
        </div>
      </div>
    </div>
  )
}
