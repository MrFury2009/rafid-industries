import { NextRequest, NextResponse } from 'next/server'

interface UrlMetadata {
  title?: string
  author?: string
  date?: string
  siteName?: string
  publisher?: string
  type?: string
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || !url.startsWith('http')) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RafidIndustries/1.0',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status}` },
        { status: 400 }
      )
    }

    const html = await response.text()

    // Parse metadata using regex
    const title = extractMetaTag(html, 'og:title') || extractTitle(html)
    const author = extractMetaTag(html, 'author')
    const date = extractMetaTag(html, 'article:published_time')
    const siteName = extractMetaTag(html, 'og:site_name')
    const type = extractMetaTag(html, 'og:type')

    const metadata: UrlMetadata = {
      title,
      author,
      date,
      siteName,
      type,
    }

    return NextResponse.json(metadata)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to fetch metadata: ${message}` },
      { status: 500 }
    )
  }
}

function extractMetaTag(html: string, property: string): string | undefined {
  const regex = new RegExp(
    `<meta\\s+(?:property="|name=")${property}"\\s+content="([^"]*)"`,
    'i'
  )
  const match = html.match(regex)
  return match ? match[1] : undefined
}

function extractTitle(html: string): string | undefined {
  const match = html.match(/<title>([^<]+)<\/title>/i)
  return match ? match[1] : undefined
}
