import type { Source } from '../types'

export function parseBibTeX(raw: string): Source | null {
  // Very basic BibTeX parser using regex
  const typeMatch = raw.match(/@(\w+)\{/)
  if (!typeMatch) return null

  const type = typeMatch[1].toLowerCase()
  const title = extractField(raw, 'title')
  const author = extractField(raw, 'author')
  const year = extractField(raw, 'year')
  const journal = extractField(raw, 'journal')
  const volume = extractField(raw, 'volume')
  const number = extractField(raw, 'number')
  const pages = extractField(raw, 'pages')
  const doi = extractField(raw, 'doi')
  const url = extractField(raw, 'url')
  const publisher = extractField(raw, 'publisher')
  const booktitle = extractField(raw, 'booktitle')

  let sourceType: Source['type'] = 'journal-doi'
  if (type === 'book') sourceType = 'book'
  if (type === 'inproceedings') sourceType = 'conference'
  if (type === 'phdthesis' || type === 'mastersthesis') sourceType = 'thesis'
  if (type === 'techreport') sourceType = 'report'
  if (type === 'misc' && url) sourceType = 'webpage'

  // Parse authors
  const authors = author ? parseAuthors(author) : []

  if (!title) return null

  return {
    type: sourceType,
    title,
    authors,
    year,
    containerTitle: journal || booktitle,
    volume,
    issue: number,
    pages,
    doi,
    url,
    publisher,
  }
}

function extractField(bibtex: string, fieldName: string): string | undefined {
  const regex = new RegExp(`${fieldName}\\s*=\\s*[{"]([^}"]+)`, 'i')
  const match = bibtex.match(regex)
  return match ? match[1].trim() : undefined
}

function parseAuthors(authorString: string): Array<{ given?: string; family?: string }> {
  return authorString.split(' and ').map((author) => {
    const trimmed = author.trim()
    const parts = trimmed.split(',').map((p) => p.trim())

    if (parts.length === 2) {
      // "Family, Given" format
      return { family: parts[0], given: parts[1] }
    }

    // "Given Family" format
    const nameParts = trimmed.split(/\s+/)
    return {
      given: nameParts.slice(0, -1).join(' '),
      family: nameParts[nameParts.length - 1],
    }
  })
}
