import Link from 'next/link'

interface ToolCardProps {
  name: string
  description: string
  status: 'live' | 'soon'
  slug: string
  url?: string
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="arrow-icon transition-transform duration-[180ms] ease-in-out"
    >
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ToolCard({ name, description, status, slug, url }: ToolCardProps) {
  const isLive = status === 'live'
  const hasLink = isLive && (url || slug)

  const content = (
    <div className={`group bg-bg dark:bg-dark-bg p-6 flex flex-col gap-3 h-full ${
      isLive
        ? 'border border-border dark:border-dark-border hover:border-sage dark:hover:border-sage transition-colors duration-[200ms] cursor-pointer'
        : 'border border-border dark:border-dark-border opacity-60 cursor-default'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Status dot */}
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: isLive ? '#7A9E82' : '#9CA3AF' }}
            aria-label={isLive ? 'Live' : 'Coming soon'}
          />
          <h3 className="font-sans font-medium text-sm text-ink dark:text-dark-text">
            {name}
          </h3>
        </div>
        {isLive && (
          <span className="group-hover:translate-x-1 transition-transform duration-[180ms] ease-in-out text-ink dark:text-dark-text flex-shrink-0">
            <ArrowIcon />
          </span>
        )}
      </div>
      <p className="font-sans text-sm text-ink/60 dark:text-dark-text/60 leading-relaxed">
        {description}
      </p>
    </div>
  )

  if (!hasLink) return content

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block h-full">
        {content}
      </a>
    )
  }

  return (
    <Link href={`/tools/${slug}`} className="block h-full">
      {content}
    </Link>
  )
}
