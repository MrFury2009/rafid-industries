import type { Author } from './types'

export function toSentenceCase(title: string): string {
  if (!title) return ''
  // Capitalize first letter, lowercase the rest, but preserve acronyms/initials
  const trimmed = title.trim()
  if (trimmed.length === 0) return ''
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
}

export function parseName(raw: string): Author {
  const trimmed = raw.trim()
  if (!trimmed) return {}

  // Try to parse "FirstName LastName" or "LastName, FirstName"
  if (trimmed.includes(',')) {
    const [family, given] = trimmed.split(',').map((s) => s.trim())
    return { family, given }
  }

  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) {
    return { family: parts[0] }
  }

  return {
    given: parts.slice(0, -1).join(' '),
    family: parts[parts.length - 1],
  }
}

export function stripTrackingParams(url: string): string {
  try {
    const parsed = new URL(url)
    const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
    utm.forEach((param) => parsed.searchParams.delete(param))
    return parsed.toString()
  } catch {
    return url
  }
}

export function validateISBN(raw: string): string | null {
  const cleaned = raw.replace(/[-\s]/g, '')

  if (cleaned.length === 10) {
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
