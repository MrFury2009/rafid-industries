import type { Source } from '@/app/tools/apa/lib/types'

interface OLBook {
  title: string
  authors?: Array<{ name: string }>
  publish_date?: string
  publishers?: string[]
  isbn_13?: string[]
  isbn_10?: string[]
  number_of_pages?: number
  dewey_decimal_class?: string[]
}

export async function fetchOpenLibrary(isbn: string): Promise<Source | { error: string }> {
  try {
    const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${encodeURIComponent(isbn)}&format=json&jscmd=data`
    const response = await fetch(url)

    if (!response.ok) {
      return { error: `OpenLibrary returned ${response.status}` }
    }

    const data = (await response.json()) as Record<string, OLBook>
    const key = Object.keys(data)[0]
    const book = data[key]

    if (!book) {
      return { error: 'No OpenLibrary record found' }
    }

    return {
      type: 'book',
      title: book.title,
      authors: (book.authors || []).map((a) => {
        const parts = a.name.split(' ')
        return {
          family: parts[parts.length - 1],
          given: parts.slice(0, -1).join(' '),
        }
      }),
      year: book.publish_date?.match(/\d{4}/)?.[0],
      publisher: book.publishers?.[0],
      isbn: book.isbn_13?.[0] || book.isbn_10?.[0],
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { error: `OpenLibrary fetch failed: ${message}` }
  }
}

interface GoogleBooksVolume {
  volumeInfo?: {
    title?: string
    authors?: string[]
    publishedDate?: string
    publisher?: string
    industryIdentifiers?: Array<{ type: string; identifier: string }>
  }
}

export async function fetchGoogleBooks(isbn: string): Promise<Source | { error: string }> {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}`
    const response = await fetch(url)

    if (!response.ok) {
      return { error: `Google Books returned ${response.status}` }
    }

    const data = (await response.json()) as { items?: GoogleBooksVolume[] }
    const book = data.items?.[0]

    if (!book || !book.volumeInfo) {
      return { error: 'No Google Books record found' }
    }

    const vol = book.volumeInfo
    const isbn13 = vol.industryIdentifiers?.find((id) => id.type === 'ISBN_13')?.identifier
    const isbn10 = vol.industryIdentifiers?.find((id) => id.type === 'ISBN_10')?.identifier

    return {
      type: 'book',
      title: vol.title || 'Untitled',
      authors: (vol.authors || []).map((a) => {
        const parts = a.split(' ')
        return {
          family: parts[parts.length - 1],
          given: parts.slice(0, -1).join(' '),
        }
      }),
      year: vol.publishedDate?.match(/\d{4}/)?.[0],
      publisher: vol.publisher,
      isbn: isbn13 || isbn10,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { error: `Google Books fetch failed: ${message}` }
  }
}
