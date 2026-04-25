import type { Source, FormatVersion } from '../types'

export function formatParenthetical(source: Source, version: FormatVersion = 'apa7'): string {
  if (!source.authors || source.authors.length === 0) {
    // Use title if no authors
    const titleStart = source.title.split(' ').slice(0, 3).join(' ')
    return `("${titleStart}...", ${source.year || 'n.d.'})`
  }

  const firstAuthor = source.authors[0]
  const lastName = firstAuthor.literal || firstAuthor.family || 'Unknown'

  if (source.authors.length === 1) {
    return `(${lastName}, ${source.year || 'n.d.'})`
  }

  if (source.authors.length === 2) {
    const secondAuthor = source.authors[1]
    const secondName = secondAuthor.literal || secondAuthor.family || 'Unknown'
    return `(${lastName} & ${secondName}, ${source.year || 'n.d.'})`
  }

  // 3+ authors: use et al.
  return `(${lastName} et al., ${source.year || 'n.d.'})`
}

export function formatNarrative(source: Source, version: FormatVersion = 'apa7'): string {
  if (!source.authors || source.authors.length === 0) {
    const titleStart = source.title.split(' ').slice(0, 3).join(' ')
    return `"${titleStart}..." (${source.year || 'n.d.'})`
  }

  const firstAuthor = source.authors[0]
  const lastName = firstAuthor.literal || firstAuthor.family || 'Unknown'

  if (source.authors.length === 1) {
    return `${lastName} (${source.year || 'n.d.'})`
  }

  if (source.authors.length === 2) {
    const secondAuthor = source.authors[1]
    const secondName = secondAuthor.literal || secondAuthor.family || 'Unknown'
    return `${lastName} and ${secondName} (${source.year || 'n.d.'})`
  }

  // 3+ authors: use et al.
  return `${lastName} et al. (${source.year || 'n.d.'})`
}
