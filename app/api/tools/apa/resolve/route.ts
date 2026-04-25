import { NextRequest, NextResponse } from 'next/server'
import type { Source, DetectedType } from '@/app/tools/apa/lib/types'
import { fetchCrossRef } from '../lib/fetchers/crossref'
import { fetchOpenLibrary, fetchGoogleBooks } from '../lib/fetchers/openLibrary'
import { fetchPubMed } from '../lib/fetchers/pubmed'
import { fetchArXiv } from '../lib/fetchers/arxiv'

export const maxDuration = 30

async function resolveSource(
  type: DetectedType,
  value: string
): Promise<Source | { error: string }> {
  try {
    switch (type) {
      case 'doi':
        return await fetchCrossRef(value)

      case 'isbn': {
        const result = await fetchOpenLibrary(value)
        if ('error' in result) {
          return await fetchGoogleBooks(value)
        }
        return result
      }

      case 'pmid':
        return await fetchPubMed(value)

      case 'arxiv':
        return await fetchArXiv(value)

      case 'url':
        return {
          error: 'URL metadata fetching not yet implemented',
        }

      case 'bibtex':
        return {
          error: 'BibTeX parsing not yet implemented',
        }

      case 'ris':
        return {
          error: 'RIS parsing not yet implemented',
        }

      case 'raw':
        return {
          error: 'Raw citation parsing not yet implemented',
        }

      default:
        return {
          error: `Unknown type: ${type}`,
        }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return {
      error: `Failed to resolve ${type}: ${message}`,
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, value } = await request.json()

    if (!type || !value) {
      return NextResponse.json(
        { error: 'Missing type or value' },
        { status: 400 }
      )
    }

    const result = await resolveSource(type, value)

    // Set cache headers for successful DOI/ISBN/arXiv fetches
    const headers = new Headers()
    if ('error' in result === false && ['doi', 'isbn', 'arxiv'].includes(type)) {
      headers.set('Cache-Control', 's-maxage=2592000, stale-while-revalidate=604800')
    }

    if ('error' in result) {
      return NextResponse.json(result, { status: 400, headers })
    }

    return NextResponse.json({ source: result }, { headers })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: `Server error: ${message}` },
      { status: 500 }
    )
  }
}
