export type SourceType =
  | 'journal-doi'
  | 'journal-online'
  | 'journal-print'
  | 'book'
  | 'book-edited'
  | 'book-chapter'
  | 'webpage'
  | 'news'
  | 'conference'
  | 'thesis'
  | 'report'
  | 'preprint'
  | 'video'
  | 'podcast'
  | 'social'
  | 'film'
  | 'dataset'

export type Author = {
  given?: string
  family?: string
  literal?: string
  role?: 'author' | 'editor' | 'translator'
}

export type Source = {
  type: SourceType
  authors: Author[]
  editors?: Author[]
  year?: string
  title: string
  containerTitle?: string
  publisher?: string
  place?: string
  volume?: string
  issue?: string
  pages?: string
  doi?: string
  url?: string
  accessed?: string
  edition?: string
  isbn?: string
  issn?: string
  meta?: Record<string, string>
}

export type FormatVersion = 'apa7' | 'apa6'

export type LibraryEntry = {
  id: string
  source: Source
  reference: string
  inTextParenthetical: string
  inTextNarrative: string
  addedAt: number
}

export type DetectedType =
  | 'doi'
  | 'arxiv'
  | 'pmid'
  | 'isbn'
  | 'url'
  | 'bibtex'
  | 'ris'
  | 'raw'

export type ResolveResponse = {
  source?: Source
  error?: string
}
