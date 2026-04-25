'use client'

import { useState } from 'react'
import type { LibraryEntry } from '../lib/types'

interface ExportMenuProps {
  entries: LibraryEntry[]
}

export function ExportMenu({ entries }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCopyAll = () => {
    const text = entries.map((e) => e.reference).join('\n\n')
    navigator.clipboard.writeText(text)
    setIsOpen(false)
  }

  const handleExportPlainText = () => {
    const text = entries
      .map((e) => {
        // Hanging indent simulation in plain text
        const lines = e.reference.split('\n')
        return lines.map((line, idx) => (idx === 0 ? line : '  ' + line)).join('\n')
      })
      .join('\n\n')

    const element = document.createElement('a')
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`)
    element.setAttribute('download', 'references.txt')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    setIsOpen(false)
  }

  const handleExportBibTeX = () => {
    const bibtex = entries.map((e) => sourceToBibTeX(e)).join('\n\n')

    const element = document.createElement('a')
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(bibtex)}`)
    element.setAttribute('download', 'references.bib')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    setIsOpen(false)
  }

  const handleExportRIS = () => {
    const ris = entries.map((e) => sourceToRIS(e)).join('\n')

    const element = document.createElement('a')
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(ris)}`)
    element.setAttribute('download', 'references.ris')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-sm font-medium rounded-none border transition-colors"
        style={{
          backgroundColor: 'var(--elevated)',
          borderColor: 'var(--border)',
          color: 'var(--text)',
        }}
      >
        Export
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 rounded-none border shadow-lg z-10 w-48"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <button
            onClick={handleCopyAll}
            className="w-full text-left px-4 py-2 text-sm hover:bg-elevated transition-colors"
            style={{ color: 'var(--text)' }}
          >
            Copy All
          </button>
          <button
            onClick={handleExportPlainText}
            className="w-full text-left px-4 py-2 text-sm hover:bg-elevated transition-colors"
            style={{ color: 'var(--text)' }}
          >
            Plain Text (.txt)
          </button>
          <button
            onClick={handleExportBibTeX}
            className="w-full text-left px-4 py-2 text-sm hover:bg-elevated transition-colors"
            style={{ color: 'var(--text)' }}
          >
            BibTeX (.bib)
          </button>
          <button
            onClick={handleExportRIS}
            className="w-full text-left px-4 py-2 text-sm hover:bg-elevated transition-colors"
            style={{ color: 'var(--text)' }}
          >
            RIS (.ris)
          </button>
        </div>
      )}
    </div>
  )
}

function sourceToBibTeX(entry: LibraryEntry): string {
  const source = entry.source
  const year = source.year || 'n.d.'
  const authors = source.authors.map((a) => `${a.family}, ${a.given}`).join(' and ')

  let bibtex = ''

  switch (source.type) {
    case 'journal-doi':
    case 'journal-online':
    case 'journal-print':
      bibtex = `@article{${year}${source.authors[0]?.family || 'unknown'},\n`
      bibtex += `  author = {${authors}},\n`
      bibtex += `  year = {${year}},\n`
      bibtex += `  title = {${source.title}},\n`
      if (source.containerTitle) bibtex += `  journal = {${source.containerTitle}},\n`
      if (source.volume) bibtex += `  volume = {${source.volume}},\n`
      if (source.issue) bibtex += `  number = {${source.issue}},\n`
      if (source.pages) bibtex += `  pages = {${source.pages}},\n`
      if (source.doi) bibtex += `  doi = {${source.doi}},\n`
      bibtex += '}'
      return bibtex

    case 'book':
      bibtex = `@book{${year}${source.authors[0]?.family || 'unknown'},\n`
      bibtex += `  author = {${authors}},\n`
      bibtex += `  year = {${year}},\n`
      bibtex += `  title = {${source.title}},\n`
      if (source.publisher) bibtex += `  publisher = {${source.publisher}},\n`
      bibtex += '}'
      return bibtex

    default:
      bibtex = `@misc{${year}${source.authors[0]?.family || 'unknown'},\n`
      bibtex += `  author = {${authors || 'Unknown'}},\n`
      bibtex += `  year = {${year}},\n`
      bibtex += `  title = {${source.title}},\n`
      if (source.url) bibtex += `  url = {${source.url}},\n`
      bibtex += '}'
      return bibtex
  }
}

function sourceToRIS(entry: LibraryEntry): string {
  const source = entry.source

  let ris = 'TY  - JOUR\n'
  if (source.type === 'book') ris = 'TY  - BOOK\n'
  if (source.type === 'conference') ris = 'TY  - CPAPER\n'

  ris += `TI  - ${source.title}\n`

  source.authors.forEach((a) => {
    ris += `AU  - ${a.family}${a.given ? ', ' + a.given : ''}\n`
  })

  if (source.year) ris += `PY  - ${source.year}\n`
  if (source.containerTitle) ris += `JO  - ${source.containerTitle}\n`
  if (source.volume) ris += `VL  - ${source.volume}\n`
  if (source.issue) ris += `IS  - ${source.issue}\n`
  if (source.pages) {
    const [start, end] = source.pages.split('-')
    if (start) ris += `SP  - ${start}\n`
    if (end) ris += `EP  - ${end}\n`
  }
  if (source.doi) ris += `DO  - ${source.doi}\n`
  if (source.url) ris += `UR  - ${source.url}\n`
  if (source.publisher) ris += `PB  - ${source.publisher}\n`

  ris += 'ER  -\n'
  return ris
}
