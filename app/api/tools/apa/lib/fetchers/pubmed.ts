import type { Source } from '@/app/tools/apa/lib/types'

interface PubMedSummary {
  title?: string
  authors?: Array<{ name: string }>
  pubdate?: string
  source?: string
  volume?: string
  issue?: string
  pages?: string
  articleids?: Array<{ idtype: string; value: string }>
}

export async function fetchPubMed(pmid: string): Promise<Source | { error: string }> {
  try {
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${encodeURIComponent(pmid)}&retmode=json`
    const response = await fetch(url)

    if (!response.ok) {
      return { error: `PubMed returned ${response.status}` }
    }

    const data = (await response.json()) as {
      result?: Record<string, PubMedSummary>
    }
    const record = data.result?.[pmid]

    if (!record) {
      return { error: 'No PubMed record found' }
    }

    const doi = record.articleids?.find((id) => id.idtype === 'doi')?.value

    return {
      type: 'journal-doi',
      title: record.title || 'Untitled',
      authors: (record.authors || []).map((a) => {
        const parts = a.name.split(' ')
        return {
          family: parts[parts.length - 1],
          given: parts.slice(0, -1).join(' '),
        }
      }),
      year: record.pubdate?.match(/\d{4}/)?.[0],
      containerTitle: record.source,
      volume: record.volume,
      issue: record.issue,
      pages: record.pages,
      doi,
      meta: { pmid },
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { error: `PubMed fetch failed: ${message}` }
  }
}
