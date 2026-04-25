'use client'

import { useState } from 'react'
import type { Source, SourceType, Author } from '../lib/types'

interface ManualFormProps {
  onSubmit: (source: Source) => void
  isLoading?: boolean
}

const SOURCE_TYPES: Array<{ value: SourceType; label: string }> = [
  { value: 'journal-doi', label: 'Journal Article (DOI)' },
  { value: 'journal-online', label: 'Journal Article (Online)' },
  { value: 'journal-print', label: 'Journal Article (Print)' },
  { value: 'book', label: 'Book' },
  { value: 'book-edited', label: 'Edited Book' },
  { value: 'book-chapter', label: 'Book Chapter' },
  { value: 'webpage', label: 'Webpage' },
  { value: 'news', label: 'News Article' },
  { value: 'conference', label: 'Conference Paper' },
  { value: 'thesis', label: 'Thesis' },
  { value: 'report', label: 'Report' },
  { value: 'preprint', label: 'Preprint' },
  { value: 'video', label: 'Video' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'social', label: 'Social Media' },
  { value: 'film', label: 'Film' },
  { value: 'dataset', label: 'Dataset' },
]

export function ManualForm({ onSubmit, isLoading = false }: ManualFormProps) {
  const [sourceType, setSourceType] = useState<SourceType>('journal-doi')
  const [title, setTitle] = useState('')
  const [authors, setAuthors] = useState<Author[]>([{ given: '', family: '' }])
  const [year, setYear] = useState('')
  const [containerTitle, setContainerTitle] = useState('')
  const [publisher, setPublisher] = useState('')
  const [volume, setVolume] = useState('')
  const [issue, setIssue] = useState('')
  const [pages, setPages] = useState('')
  const [doi, setDoi] = useState('')
  const [url, setUrl] = useState('')

  const handleAddAuthor = () => {
    setAuthors([...authors, { given: '', family: '' }])
  }

  const handleUpdateAuthor = (index: number, field: 'given' | 'family', value: string) => {
    const updated = [...authors]
    updated[index] = { ...updated[index], [field]: value }
    setAuthors(updated)
  }

  const handleRemoveAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const source: Source = {
      type: sourceType,
      title,
      authors: authors.filter((a) => a.family || a.given),
      year,
      containerTitle,
      publisher,
      volume,
      issue,
      pages,
      doi,
      url,
    }

    onSubmit(source)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Source Type */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          Source Type
        </label>
        <select
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value as SourceType)}
          className="px-4 py-3 rounded-none border text-sm"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text)',
          }}
        >
          {SOURCE_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="px-4 py-3 rounded-none border text-sm"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text)',
          }}
        />
      </div>

      {/* Authors */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            Authors
          </label>
          <button
            type="button"
            onClick={handleAddAuthor}
            className="text-xs px-2 py-1 rounded-none border"
            style={{
              backgroundColor: 'var(--elevated)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
            }}
          >
            + Add Author
          </button>
        </div>
        <div className="space-y-2">
          {authors.map((author, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                placeholder="Given name"
                value={author.given || ''}
                onChange={(e) => handleUpdateAuthor(idx, 'given', e.target.value)}
                className="flex-1 px-3 py-2 rounded-none border text-sm"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
              />
              <input
                type="text"
                placeholder="Family name"
                value={author.family || ''}
                onChange={(e) => handleUpdateAuthor(idx, 'family', e.target.value)}
                className="flex-1 px-3 py-2 rounded-none border text-sm"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
              />
              {authors.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveAuthor(idx)}
                  className="px-3 py-2 rounded-none border text-sm"
                  style={{
                    backgroundColor: 'var(--elevated)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Year */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          Year
        </label>
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="2024"
          className="px-4 py-3 rounded-none border text-sm"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text)',
          }}
        />
      </div>

      {/* Container Title */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          Container Title (Journal, Book, Website)
        </label>
        <input
          type="text"
          value={containerTitle}
          onChange={(e) => setContainerTitle(e.target.value)}
          className="px-4 py-3 rounded-none border text-sm"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text)',
          }}
        />
      </div>

      {/* Publisher */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          Publisher
        </label>
        <input
          type="text"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
          className="px-4 py-3 rounded-none border text-sm"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text)',
          }}
        />
      </div>

      {/* Volume, Issue, Pages */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
            Volume
          </label>
          <input
            type="text"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="px-3 py-2 rounded-none border text-sm"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
            Issue
          </label>
          <input
            type="text"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            className="px-3 py-2 rounded-none border text-sm"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
            Pages
          </label>
          <input
            type="text"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            placeholder="1-20"
            className="px-3 py-2 rounded-none border text-sm"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
            }}
          />
        </div>
      </div>

      {/* DOI & URL */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
            DOI
          </label>
          <input
            type="text"
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
            placeholder="10.xxxx/xxxx"
            className="px-3 py-2 rounded-none border text-sm"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
            URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="px-3 py-2 rounded-none border text-sm"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
            }}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !title}
        className="w-full px-4 py-3 text-sm font-medium rounded-none transition-colors disabled:opacity-50"
        style={{
          backgroundColor: 'var(--sage)',
          color: 'white',
        }}
      >
        {isLoading ? 'Creating...' : 'Create Citation'}
      </button>
    </form>
  )
}
