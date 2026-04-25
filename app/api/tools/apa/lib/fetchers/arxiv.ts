import type { Source } from '@/app/tools/apa/lib/types'

export async function fetchArXiv(id: string): Promise<Source | { error: string }> {
  try {
    const url = `http://export.arxiv.org/api/query?id_list=${encodeURIComponent(id)}`
    const response = await fetch(url)

    if (!response.ok) {
      return { error: `arXiv returned ${response.status}` }
    }

    const text = await response.text()

    // Parse Atom XML using regex
    const titleMatch = text.match(/<title>([^<]+)<\/title>/)
    const authorMatches = text.matchAll(/<author>\s*<name>([^<]+)<\/name>\s*<\/author>/g)
    const publishedMatch = text.match(/<published>(\d{4})-(\d{2})-(\d{2})/)
    const summaryMatch = text.match(/<summary>([^<]+)<\/summary>/)
    const doiMatch = text.match(/<arxiv:doi>([^<]+)<\/arxiv:doi>/)

    const authors = Array.from(authorMatches).map((match) => {
      const name = match[1]
      const parts = name.split(' ')
      return {
        family: parts[parts.length - 1],
        given: parts.slice(0, -1).join(' '),
      }
    })

    const year = publishedMatch ? publishedMatch[1] : undefined

    return {
      type: 'preprint',
      title: titleMatch ? titleMatch[1] : 'Untitled',
      authors,
      year,
      url: `https://arxiv.org/abs/${id}`,
      doi: doiMatch ? doiMatch[1] : undefined,
      meta: { arxiv: id },
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { error: `arXiv fetch failed: ${message}` }
  }
}
