import type { Source, Author } from '../types'
import { toSentenceCase, stripTrackingParams } from '../sanitize'

function formatAuthors(authors: Author[], max: number = 7): string {
  if (!authors || authors.length === 0) return ''

  const formatted = authors.slice(0, max).map((a) => {
    if (a.literal) return a.literal
    if (!a.family) return ''
    const initial = a.given ? a.given.split('-').map((g) => `${g.charAt(0)}.`).join('-') : ''
    return initial ? `${a.family}, ${initial}` : a.family
  })

  if (authors.length > max) {
    return `${formatted.join(', ')}, ...`
  }

  return formatted.join(', ')
}

export function format(source: Source): string {
  const authors = source.authors && source.authors.length > 0
    ? formatAuthors(source.authors, 7)
    : source.title

  const year = source.year || 'n.d.'
  const title = toSentenceCase(source.title)

  switch (source.type) {
    case 'journal-doi':
    case 'journal-online':
    case 'journal-print': {
      let ref = `${authors} (${year}). ${title}.`
      if (source.containerTitle) {
        ref += ` ${source.containerTitle}`
        if (source.volume) {
          ref += `, ${source.volume}`
          if (source.issue) {
            ref += `(${source.issue})`
          }
        }
      }
      if (source.pages) {
        ref += `, ${source.pages}`
      }
      // APA 6: doi: format (not https://doi.org/)
      if (source.doi) {
        ref += `. doi:${source.doi}`
      } else if (source.url) {
        ref += `. Retrieved from ${stripTrackingParams(source.url)}`
      }
      ref += '.'
      return ref
    }

    case 'book': {
      let ref = `${authors} (${year}). ${title}`
      if (source.edition && source.edition !== '1') {
        ref += ` (${source.edition} ed.)`
      }
      ref += '.'
      if (source.place && source.publisher) {
        ref += ` ${source.place}: ${source.publisher}.`
      } else if (source.publisher) {
        ref += ` ${source.publisher}.`
      }
      return ref
    }

    case 'book-edited': {
      const editors = source.editors ? formatAuthors(source.editors, 7) : authors
      const edLabel = (source.editors?.length || 1) > 1 ? 'Eds.' : 'Ed.'
      let ref = `${editors} (${year}) (${edLabel}). ${title}`
      if (source.edition && source.edition !== '1') {
        ref += ` (${source.edition} ed.)`
      }
      ref += '.'
      if (source.place && source.publisher) {
        ref += ` ${source.place}: ${source.publisher}.`
      } else if (source.publisher) {
        ref += ` ${source.publisher}.`
      }
      return ref
    }

    case 'book-chapter': {
      const editors = source.editors ? formatAuthors(source.editors, 7) : 'Unknown'
      const edLabel = (source.editors?.length || 1) > 1 ? 'Eds.' : 'Ed.'
      let ref = `${authors} (${year}). ${title}. In ${editors} (${edLabel}), ${source.containerTitle || 'Edited volume'}`
      if (source.pages) {
        ref += ` (pp. ${source.pages})`
      }
      ref += '.'
      if (source.place && source.publisher) {
        ref += ` ${source.place}: ${source.publisher}.`
      } else if (source.publisher) {
        ref += ` ${source.publisher}.`
      }
      return ref
    }

    case 'webpage': {
      let ref = `${authors} (${year}). ${title}. Retrieved from ${stripTrackingParams(source.url || '')}`
      return ref
    }

    case 'news': {
      let ref = `${authors} (${year}). ${title}.`
      if (source.containerTitle) {
        ref += ` ${source.containerTitle}.`
      }
      if (source.url) {
        ref += ` Retrieved from ${stripTrackingParams(source.url)}`
      }
      return ref
    }

    case 'conference': {
      let ref = `${authors} (${year}). ${title}. Paper presented at the ${source.containerTitle || 'conference'}`
      if (source.place) {
        ref += `, ${source.place}`
      }
      ref += '.'
      return ref
    }

    case 'thesis': {
      let ref = `${authors} (${year}). ${title}`
      const type = source.meta?.type || 'Doctoral dissertation'
      ref += ` (${type}). ${source.publisher || 'Unknown institution'}.`
      return ref
    }

    case 'report': {
      let ref = `${authors} (${year}). ${title}.`
      if (source.publisher) {
        ref += ` ${source.publisher}.`
      }
      if (source.doi) {
        ref += ` doi:${source.doi}`
      }
      return ref
    }

    case 'preprint': {
      let ref = `${authors} (${year}). ${title}.`
      if (source.meta?.arxiv) {
        ref += ` arXiv:${source.meta.arxiv}`
      } else if (source.doi) {
        ref += ` doi:${source.doi}`
      }
      return ref
    }

    case 'video': {
      let ref = `${authors} (${year}). ${title} [Video]. Retrieved from ${stripTrackingParams(source.url || '')}`
      return ref
    }

    case 'podcast': {
      let ref = `${authors} (${year}). ${title}.`
      if (source.containerTitle) {
        ref += ` ${source.containerTitle}.`
      }
      if (source.url) {
        ref += ` Retrieved from ${stripTrackingParams(source.url)}`
      }
      return ref
    }

    case 'social': {
      let ref = `${authors} (${year}). ${title}.`
      if (source.url) {
        ref += ` Retrieved from ${stripTrackingParams(source.url)}`
      }
      return ref
    }

    case 'film': {
      let ref = `${authors} (Director). (${year}). ${title}`
      if (source.publisher) {
        ref += `. ${source.publisher}`
      }
      ref += '.'
      return ref
    }

    case 'dataset': {
      let ref = `${authors} (${year}). ${title} [Data set].`
      if (source.doi) {
        ref += ` doi:${source.doi}`
      } else if (source.url) {
        ref += ` Retrieved from ${stripTrackingParams(source.url)}`
      }
      return ref
    }

    default:
      return `${authors} (${year}). ${title}.`
  }
}
