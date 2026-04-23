import Image from 'next/image'
import Link from 'next/link'
import { PageWrapper } from '@/components/PageWrapper'
import { RevealSection } from '@/components/RevealSection'
import { StatCounter } from '@/components/StatCounter'
import { getPageviews, getProducts } from '@/lib/kv'
import type { Product } from '@/lib/kv'

export const revalidate = 60 // ISR: re-validate every 60s

/* ── Static fallback cards (shown when KV is empty) ────────────────── */
const STATIC_CARDS: CardData[] = [
  {
    slug: 'clearair',
    name: 'ClearAir',
    tagline: 'Real-time airspace situational awareness.',
    image: '/images/products/clearair-hero.svg',
    status: 'Live',
  },
  {
    slug: 'airspace-map',
    name: 'AirspaceMap',
    tagline: 'Interactive drone zone visualisation.',
    image: '/images/products/airspace-map.svg',
  },
  {
    slug: 'drone-tech',
    name: 'DroneTech Platform',
    tagline: 'End-to-end drone fleet management.',
    image: '/images/products/drone-tech.svg',
  },
]

/** Derive image path from slug (slug-to-filename map). */
const SLUG_IMAGE: Record<string, string> = {
  clearair: '/images/products/clearair-hero.svg',
  'airspace-map': '/images/products/airspace-map.svg',
  'drone-tech': '/images/products/drone-tech.svg',
}

interface CardData {
  slug: string
  name: string
  tagline: string
  image: string
  status?: string
}

function toCardData(p: Product): CardData {
  return {
    slug: p.slug,
    name: p.name,
    tagline: p.tagline ?? p.description,
    image: SLUG_IMAGE[p.slug] ?? '/images/products/clearair-hero.svg',
    status: p.status,
  }
}

export default async function HomePage() {
  const [pageviews, kvProducts] = await Promise.all([
    getPageviews('home'),
    getProducts(),
  ])

  const cards: CardData[] = kvProducts.length > 0
    ? kvProducts.map(toCardData)
    : STATIC_CARDS

  return (
    <PageWrapper>
      <main>
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 py-32" style={{ backgroundColor: 'var(--bg)' }}>
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
              {/* Copy */}
              <div className="flex flex-col justify-center">
                <p
                  className="mb-4 text-sm font-medium uppercase tracking-widest"
                  style={{ color: 'var(--sage)' }}
                >
                  Precision Drone Technology
                </p>
                <h1
                  className="hero-heading font-serif text-5xl font-semibold leading-tight lg:text-6xl"
                  style={{ color: 'var(--text)' }}
                >
                  Airspace
                  <br />
                  <em className="not-italic" style={{ color: 'var(--sage)' }}>
                    Intelligently
                  </em>
                  <br />
                  Managed.
                </h1>
                <p
                  className="mt-6 max-w-md text-base leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  From autonomous drone operations to real-time airspace
                  situational awareness — Rafid Industries builds the tools
                  that keep the skies safe and efficient.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/#products"
                    className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: 'var(--sage)', color: '#fff' }}
                  >
                    Explore Tools →
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-semibold transition-colors duration-200"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--text)',
                    }}
                  >
                    About Us
                  </Link>
                </div>
              </div>

              {/* Hero image */}
              <div className="relative flex items-center justify-center">
                <div
                  className="relative h-80 w-full overflow-hidden rounded-2xl lg:h-96"
                  style={{ backgroundColor: 'var(--surface)' }}
                >
                  <Image
                    src="/images/hero/drone-1.svg"
                    alt="Autonomous drone in flight"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    className="object-contain p-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────────── */}
        <RevealSection>
          <section
            className="border-y px-6 py-16"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
          >
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 lg:grid-cols-4">
              <StatCounter value={2400} suffix="+" label="Flight Hours" />
              <StatCounter value={98} suffix="%" label="Uptime SLA" />
              <StatCounter value={120} suffix="+" label="Zones Mapped" />
              <StatCounter
                value={pageviews ?? 0}
                label="Site Visits"
              />
            </div>
          </section>
        </RevealSection>

        {/* ── Tools grid ───────────────────────────────────────────── */}
        <RevealSection delay={40}>
          <section id="products" className="px-6 py-24" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="mx-auto max-w-6xl">
              <h2
                className="font-serif text-3xl font-semibold"
                style={{ color: 'var(--text)' }}
              >
                Our Tools
              </h2>
              <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>
                Purpose-built for the modern airspace operator.
              </p>

              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                  <ToolCard key={card.slug} {...card} />
                ))}
              </div>
            </div>
          </section>
        </RevealSection>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <RevealSection delay={80}>
          <section
            className="px-6 py-24 text-center"
            style={{ backgroundColor: 'var(--surface)' }}
          >
            <div className="mx-auto max-w-2xl">
              <h2
                className="font-serif text-4xl font-semibold"
                style={{ color: 'var(--text)' }}
              >
                Ready to elevate your operations?
              </h2>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                Join operators worldwide who trust Rafid Industries for safe,
                efficient, and intelligent drone solutions.
              </p>
              <Link
                href="/#products"
                className="mt-8 inline-flex items-center rounded-full px-8 py-4 text-sm font-semibold transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: 'var(--sage)', color: '#fff' }}
              >
                Explore Tools →
              </Link>
            </div>
          </section>
        </RevealSection>
      </main>
    </PageWrapper>
  )
}

/* ── Tool card ──────────────────────────────────────────────────────── */
function ToolCard({ slug, name, tagline, image, status }: CardData) {
  return (
    <Link
      href={`/tools/${slug}`}
      className="group block overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--surface)',
      }}
    >
      <div
        className="relative h-44 w-full overflow-hidden"
        style={{ backgroundColor: 'var(--elevated)' }}
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <h3
            className="font-serif text-lg font-semibold"
            style={{ color: 'var(--text)' }}
          >
            {name}
          </h3>
          {status === 'Live' && (
            <span
              className="flex shrink-0 items-center gap-1 text-xs font-medium"
              style={{ color: 'var(--sage)' }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: '#7A9E82' }}
              />
              Live
            </span>
          )}
        </div>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
          {tagline}
        </p>
        <span
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--sage)' }}
        >
          Open tool
          <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  )
}
