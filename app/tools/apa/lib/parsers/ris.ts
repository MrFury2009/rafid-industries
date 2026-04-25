import type { Source } from '../types'

interface RISData {
  [key: string]: string[]
}

export function parseRIS(raw: string): Source | null {
  const lines = raw.split('\n').map((line) => line.trim())
  const data: RISData = {}

  // Parse RIS format
  for (const line of lines) {
    if (line.includes('-')) {
      const [tag, ...rest] = line.split('-').map((s) => s.trim())
      const value = rest.join('-')
      if (!data[tag]) data[tag] = []
      data[tag].push(value)
    }
  }

  // Extract metadata
  const typeString = data.TY?.[0]?.toUpperCase()
  const title = data.TI?.[0]
  const authors = (data.AU || []).map((author) => {
    const parts = author.split(',').map((p) => p.trim())
    return {
      family: parts[0],
      given: parts[1],
    }
  })
  const year = data.PY?.[0]?.substring(0, 4)
  const journal = data.JO?.[0] || data.JF?.[0]
  const volume = data.VL?.[0]
  const issue = data.IS?.[0]
  const pages = data.SP?.[0] && data.EP?.[0] ? `${data.SP[0]}-${data.EP[0]}` : undefined
  const doi = data.DO?.[0]
  const url = data.UR?.[0] || data.L1?.[0]
  const publisher = data.PB?.[0]

  let sourceType: Source['type'] = 'journal-doi'
  if (typeString === 'BOOK') sourceType = 'book'
  if (typeString === 'CPAPER') sourceType = 'conference'
  if (typeString === 'THES') sourceType = 'thesis'
  if (typeString === 'RPRT') sourceType = 'report'
  if (typeString === 'ELEC' || typeString === 'EWEB') sourceType = 'webpage'
  if (typeString === 'VIDEO') sourceType = 'video'

  if (!title) return null

  return {
    type: sourceType,
    title,
    authors,
    year,
    containerTitle: journal,
    volume,
    issue,
    pages,
    doi,
    url,
    publisher,
  }
}
