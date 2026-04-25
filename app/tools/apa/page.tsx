'use client'

import { useState, useEffect } from 'react'
import { SmartInput } from './components/SmartInput'
import { CitationPreview } from './components/CitationPreview'
import { ManualForm } from './components/ManualForm'
import { BulkPaste } from './components/BulkPaste'
import { LibraryPanel } from './components/LibraryPanel'
import { format as formatAPA7 } from './lib/formatters/apa7'
import { format as formatAPA6 } from './lib/formatters/apa6'
import { formatParenthetical, formatNarrative } from './lib/formatters/intext'
import type { Source, FormatVersion, DetectedType, LibraryEntry } from './lib/types'

const STORAGE_KEY = 'ri:apa:library:v1'

export default function APAPage() {
  const [activeTab, setActiveTab] = useState<'smart' | 'manual' | 'bulk'>('smart')
  const [formatVersion, setFormatVersion] = useState<FormatVersion>('apa7')
  const [currentSource, setCurrentSource] = useState<Source | null>(null)
  const [library, setLibrary] = useState<LibraryEntry[]>([])
  const [showLibrary, setShowLibrary] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load library from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          setLibrary(JSON.parse(stored))
        } catch {
          console.error('Failed to parse library')
        }
      }
    }
  }, [])

  // Save library to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(library))
    }
  }, [library])

  const handleSmartInputSubmit = async (type: DetectedType, value: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/tools/apa/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        setError(data.error || 'Failed to resolve citation')
        setCurrentSource(null)
        return
      }

      if (data.source) {
        setCurrentSource(data.source)
        addToLibrary(data.source)
        setError(null)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(`Request failed: ${message}`)
      setCurrentSource(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualFormSubmit = (source: Source) => {
    setCurrentSource(source)
    addToLibrary(source)
    setError(null)
  }

  const handleBulkPasteResults = (results: Array<{ source: Source | null; error?: string }>) => {
    const successful = results.filter((r) => r.source).map((r) => r.source!) as Source[]
    successful.forEach(addToLibrary)

    if (successful.length > 0) {
      setCurrentSource(successful[0])
      setError(null)
    }

    const failures = results.filter((r) => !r.source)
    if (failures.length > 0) {
      setError(`${failures.length}/${results.length} failed to resolve`)
    }
  }

  function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  function generateDuplicateHash(source: Source): string {
    const title = source.title.toLowerCase().slice(0, 40)
    const firstAuthor = source.authors?.[0]?.family?.toLowerCase() || ''
    const year = source.year || ''
    return `${source.type}|${title}|${firstAuthor}|${year}`
  }

  const addToLibrary = (source: Source) => {
    const hash = generateDuplicateHash(source)
    const isDuplicate = library.some((entry) => generateDuplicateHash(entry.source) === hash)

    if (isDuplicate) {
      setError('This citation is already in your library')
      return
    }

    const formatter = formatVersion === 'apa7' ? formatAPA7 : formatAPA6
    const reference = formatter(source)
    const inTextParenthetical = formatParenthetical(source, formatVersion)
    const inTextNarrative = formatNarrative(source, formatVersion)

    const entry: LibraryEntry = {
      id: generateId(),
      source,
      reference,
      inTextParenthetical,
      inTextNarrative,
      addedAt: Date.now(),
    }

    setLibrary([...library, entry])
  }

  const handleDeleteFromLibrary = (id: string) => {
    setLibrary(library.filter((entry) => entry.id !== id))
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="font-serif text-4xl font-light tracking-tight mb-2"
            style={{ color: 'var(--text)' }}
          >
            APA Reference Generator
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            APA 7 / APA 6 compatible citations
          </p>
        </div>

        {/* Controls Bar */}
        <div className="mb-8 flex items-center justify-between gap-6 flex-wrap">
          {/* Format Toggle */}
          <div className="flex gap-2 rounded-none border" style={{ borderColor: 'var(--border)' }}>
            {(['apa7', 'apa6'] as const).map((version) => (
              <button
                key={version}
                onClick={() => setFormatVersion(version)}
                className="px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: formatVersion === version ? 'var(--sage)' : 'transparent',
                  color: formatVersion === version ? 'white' : 'var(--text)',
                }}
              >
                {version.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Library Button */}
          <button
            onClick={() => setShowLibrary(!showLibrary)}
            className="px-4 py-2 text-sm font-medium rounded-none border transition-colors"
            style={{
              borderColor: showLibrary ? 'var(--sage)' : 'var(--border)',
              color: showLibrary ? 'var(--sage)' : 'var(--text)',
              backgroundColor: showLibrary ? 'var(--sage)/10' : 'transparent',
            }}
          >
            Library ({library.length})
          </button>
        </div>

        {/* Main Content - Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-8">
          {/* Input Section */}
          <section className="flex flex-col gap-6">
            {/* Tab Navigation */}
            <div className="flex gap-2 border-b" style={{ borderColor: 'var(--border)' }}>
              {['smart', 'manual', 'bulk'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className="px-4 py-3 text-sm font-medium rounded-none transition-colors"
                  style={{
                    color: activeTab === tab ? 'var(--sage)' : 'var(--muted)',
                    borderBottom: activeTab === tab ? '2px solid var(--sage)' : 'none',
                    marginBottom: '-2px',
                  }}
                >
                  {tab === 'smart' && 'Smart Input'}
                  {tab === 'manual' && 'Manual Form'}
                  {tab === 'bulk' && 'Bulk Paste'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex flex-col gap-4">
              {activeTab === 'smart' && (
                <>
                  <SmartInput onSubmit={handleSmartInputSubmit} isLoading={isLoading} />
                  {error && (
                    <div
                      className="p-4 rounded-none border text-sm"
                      style={{
                        backgroundColor: 'var(--elevated)',
                        borderColor: 'var(--border)',
                        color: 'var(--text)',
                      }}
                    >
                      {error}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'manual' && <ManualForm onSubmit={handleManualFormSubmit} />}

              {activeTab === 'bulk' && <BulkPaste onResults={handleBulkPasteResults} />}
            </div>
          </section>

          {/* Preview Section */}
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              Citation Preview
            </h2>
            <CitationPreview source={currentSource} version={formatVersion} />
          </section>
        </div>
      </div>

      {/* Library Panel */}
      <LibraryPanel isOpen={showLibrary} entries={library} onDelete={handleDeleteFromLibrary} />
    </main>
  )
}
