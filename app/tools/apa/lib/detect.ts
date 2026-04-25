import type { DetectedType } from './types'

export interface DetectionResult {
  type: DetectedType
  value: string
}

const DOI_REGEX = /\b10\.\d{4,9}\/[-._;()\/:A-Z0-9]+\b/i
const ARXIV_REGEX = /arxiv:\s*(\d{4}\.\d{4,5}(?:v\d+)?)/i
const BARE_ARXIV_REGEX = /\b(\d{4}\.\d{4,5}(?:v\d+)?)\b/
const PMID_REGEX = /^\s*(pmid:?\s*)?(\d{1,9})\s*$/i
const ISBN_REGEX = /(\d{10}(?:\d{3})?|-|X)/gi
const URL_REGEX = /^https?:\/\//i
const BIBTEX_REGEX = /@(article|book|misc|inproceedings|conference|phdthesis|techreport|mastersthesis|webpage|news|video|dataset)\{/i
const RIS_REGEX = /^TY\s+-\s/m

function validateISBN(raw: string): string | null {
  // Strip hyphens and spaces
  const cleaned = raw.replace(/[-\s]/g, '')

  if (cleaned.length === 10) {
    // ISBN-10: mod 11 check
    let sum = 0
    for (let i = 0; i < 9; i++) {
      const digit = parseInt(cleaned[i], 10)
      if (isNaN(digit)) return null
      sum += digit * (10 - i)
    }
    const checkChar = cleaned[9]
    const checkDigit = (11 - (sum % 11)) % 11
    const expectedCheck = checkDigit === 10 ? 'X' : checkDigit.toString()
    return checkChar.toUpperCase() === expectedCheck ? cleaned : null
  }

  if (cleaned.length === 13) {
    // ISBN-13: mod 10 check
    let sum = 0
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(cleaned[i], 10)
      if (isNaN(digit)) return null
      sum += digit * (i % 2 === 0 ? 1 : 3)
    }
    const checkDigit = (10 - (sum % 10)) % 10
    const expectedCheck = checkDigit.toString()
    return cleaned[12] === expectedCheck ? cleaned : null
  }

  return null
}

export function detectInputType(raw: string): DetectionResult | null {
  const trimmed = raw.trim()

  if (!trimmed) return null

  // 1. DOI
  const doiMatch = trimmed.match(DOI_REGEX)
  if (doiMatch) {
    return { type: 'doi', value: doiMatch[0] }
  }

  // 2. arXiv
  const arxivMatch = trimmed.match(ARXIV_REGEX)
  if (arxivMatch) {
    return { type: 'arxiv', value: arxivMatch[1] }
  }
  // Try bare arXiv ID if no arxiv: prefix
  if (/^\d{4}\.\d{4,5}(?:v\d+)?$/.test(trimmed)) {
    return { type: 'arxiv', value: trimmed }
  }

  // 3. PMID
  const pmidMatch = trimmed.match(PMID_REGEX)
  if (pmidMatch) {
    return { type: 'pmid', value: pmidMatch[2] }
  }

  // 4. ISBN
  const isbnMatch = trimmed.match(ISBN_REGEX)
  if (isbnMatch && isbnMatch.join('').replace(/-/g, '').length >= 10) {
    const validated = validateISBN(isbnMatch.join(''))
    if (validated) {
      return { type: 'isbn', value: validated }
    }
  }

  // 5. URL
  if (URL_REGEX.test(trimmed)) {
    return { type: 'url', value: trimmed }
  }

  // 6. BibTeX
  if (BIBTEX_REGEX.test(trimmed)) {
    return { type: 'bibtex', value: trimmed }
  }

  // 7. RIS
  if (RIS_REGEX.test(trimmed)) {
    return { type: 'ris', value: trimmed }
  }

  // 8. Raw citation (fallback)
  return { type: 'raw', value: trimmed }
}
