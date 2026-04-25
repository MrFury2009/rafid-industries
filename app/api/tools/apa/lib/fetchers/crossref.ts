import type { Source } from '@/app/tools/apa/lib/types'

interface CrossRefWork {
  title?: string[]
  author?: Array<{ given?: string; family?: string }>
  editor?: Array<{ given?: string; family?: string }>
  issued?: { 'date-parts'?: [number[]] }
  DOI?: string
  URL?: string
  volume?: string
  issue?: string
  page?: string
  'container-title'?: string[]
  publisher?: string
  type?: string
  ISBN?: string[]
  ISSN?: string[]
}

type CrossRefType = 'journal-article' | 'book' | 'book-chapter' | 'proceedings-article' | 'posted-content'

export async function fetchCrossRef(doi: string): Promise<Source | { error: string }> {
  try {
    const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RafidIndustries/1.0 (mailto:admin@rafidindustries.com)',
      },
    })

    if (!response.ok) {
      return { error: `CrossRef returned ${response.status}` }
    }

    const data = (await response.json()) as { message?: CrossRefWork }
    const work = data.message

    if (!work) {
      return { error: 'No CrossRef record found' }
    }

    // Determine source type based on CrossRef type
    let sourceType: Source['type'] = 'journal-doi'
    const crType = work.type as CrossRefType | undefined
    if (crType === 'book') {
      sourceType = 'book'
    } else if (crType === 'book-chapter') {
      sourceType = 'book-chapter'
    } else if (crType === 'proceedings-article') {
      sourceType = 'conference'
    } else if (crType === 'posted-content') {
      sourceType = 'preprint'
    }

    return {
      type: sourceType,
      title: work.title?.[0] || 'Untitled',
      authors: (work.author || []).map((a) => ({
        given: a.given,
        family: a.family,
      })),
      editors: (work.editor || []).map((e) => ({
        given: e.given,
        family: e.family,
        role: 'editor',
      })),
      year: work.issued?.['date-parts']?.[0]?.[0]?.toString(),
      doi: work.DOI || doi,
      url: work.URL,
      volume: work.volume,
      issue: work.issue,
      pages: work.page,
      containerTitle: work['container-title']?.[0],
      publisher: work.publisher,
      isbn: work.ISBN?.[0],
      issn: work.ISSN?.[0],
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { error: `CrossRef fetch failed: ${message}` }
  }
}
