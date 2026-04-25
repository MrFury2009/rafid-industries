import type { Source, Author } from '../types'
import { toSentenceCase, stripTrackingParams } from '../sanitize'

function formatAuthors(authors: Author[], max: number = 19): string {
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

function formatAuthorInitial(author: Author | undefined): string {
  if (!author) return ''
  if (author.literal) return author.literal.charAt(0)
  if (!author.family) return ''
  return author.family
}

export function format(source: Source): string {
  const authors = source.authors && source.authors.length > 0
    ? formatAuthors(source.authors, 19)
    : source.title

  const year = source.year || 'n.d.'
  const title = toSentenceCase(source.title)

  switch (source.type) {
    case 'journal-doi':
    case 'journal-online':
    case 'journal-print': {
      // Author(s) (Year). Title. Container Title, Volume(Issue), pages. https://doi.org/DOI
      const container = source.containerTitle || 'Unknown Journal'
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
      if (source.doi) {
        ref += `. https://doi.org/${source.doi}`
      } else if (source.url) {
        ref += `. Retrieved from ${stripTrackingParams(source.url)}`
      }
      ref += '.'
      return ref
    }

    case 'book': {
      // Author(s) (Year). Title. Publisher.
      let ref = `${authors} (${year}). ${title}`
      if (source.edition && source.edition !== '1') {
        ref += ` (${source.edition} ed.)`
      }
      ref += '.'
      if (source.publisher) {
        ref += ` ${source.publisher}.`
      } else {
        ref += ' [Publisher unknown].'
      }
      return ref
    }

    case 'book-edited': {
      // Editor(s) (Ed./Eds.). Title. Publisher.
      const editors = source.editors ? formatAuthors(source.editors, 19) : authors
      const edLabel = (source.editors?.length || 1) > 1 ? 'Eds.' : 'Ed.'
      let ref = `${editors} (${year}) (${edLabel}). ${title}`
      if (source.edition && source.edition !== '1') {
        ref += ` (${source.edition} ed.)`
      }
      ref += '.'
      if (source.publisher) {
        ref += ` ${source.publisher}.`
      }
      return ref
    }

    case 'book-chapter': {
      // Author(s) (Year). Chapter title. In Editor(s) (Ed./Eds.), Container title (pp. pages).
      const editors = source.editors ? formatAuthors(source.editors, 19) : 'Unknown'
      const edLabel = (source.editors?.length || 1) > 1 ? 'Eds.' : 'Ed.'
      let ref = `${authors} (${year}). ${title}. In ${editors} (${edLabel}), ${source.containerTitle || 'Edited volume'}`
      if (source.pages) {
        ref += ` (pp. ${source.pages})`
      }
      ref += '.'
      if (source.publisher) {
        ref += ` ${source.publisher}.`
      }
      return ref
    }

    case 'webpage': {
      // Author(s) (Year). Title. Retrieved from URL
      let ref = `${authors} (${year}). ${title}. Retrieved from ${stripTrackingParams(source.url || '')}`
      return ref
    }

    case 'news': {
      // Author(s) (Year). Title. Publication. Retrieved from URL
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
      // Author(s) (Year). Title. Paper presented at Conference.
      let ref = `${authors} (${year}). ${title}. Paper presented at the ${source.containerTitle || 'conference'}`
      if (source.place) {
        ref += `, ${source.place}`
      }
      ref += '.'
      return ref
    }

    case 'thesis': {
      // Author(s) (Year). Title [Doctoral dissertation/Master's thesis, Institution].
      let ref = `${authors} (${year}). ${title}`
      const type = source.meta?.type || 'Doctoral dissertation'
      ref += ` [${type}, ${source.publisher || 'Unknown institution'}].`
      return ref
    }

    case 'report': {
      // Author(s) (Year). Title. Organization.
      let ref = `${authors} (${year}). ${title}.`
      if (source.publisher) {
        ref += ` ${source.publisher}.`
      }
      if (source.doi) {
        ref += ` https://doi.org/${source.doi}`
      }
      return ref
    }

    case 'preprint': {
      // Author(s) (Year). Title. https://doi.org/... or arXiv:...
      let ref = `${authors} (${year}). ${title}.`
      if (source.meta?.arxiv) {
        ref += ` arXiv:${source.meta.arxiv}`
      } else if (source.doi) {
        ref += ` https://doi.org/${source.doi}`
      }
      return ref
    }

    case 'video': {
      // Author(s) (Year). Title [Video]. Retrieved from URL
      let ref = `${authors} (${year}). ${title} [Video]. Retrieved from ${stripTrackingParams(source.url || '')}`
      return ref
    }

    case 'podcast': {
      // Author(s) (Year). Episode title. In Podcast title. Retrieved from URL
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
      // Author (Year). Post text. Retrieved from URL
      let ref = `${authors} (${year}). ${title}.`
      if (source.url) {
        ref += ` Retrieved from ${stripTrackingParams(source.url)}`
      }
      return ref
    }

    case 'film': {
      // Director (Director). (Year). Film title. Studio.
      let ref = `${authors} (Director). (${year}). ${title}`
      if (source.publisher) {
        ref += `. ${source.publisher}`
      }
      ref += '.'
      return ref
    }

    case 'dataset': {
      // Author(s) (Year). Dataset title [Data set]. https://doi.org/...
      let ref = `${authors} (${year}). ${title} [Data set].`
      if (source.doi) {
        ref += ` https://doi.org/${source.doi}`
      } else if (source.url) {
        ref += ` Retrieved from ${stripTrackingParams(source.url)}`
      }
      return ref
    }

    default:
      return `${authors} (${year}). ${title}.`
  }
}
