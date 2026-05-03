import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageWrapper } from '@/components/PageWrapper'
import { getProducts, getClearAirChecks } from '@/lib/kv'
import type { Metadata } from 'next'

export const revalidate = 60

/* ── ClearAir hard-coded fallback (if KV not seeded yet) ─────────────── */
const CLEARAIR_FALLBACK = {
  slug: 'clearair',
  name: 'ClearAir',
  description: 'Drone airspace checker. Instant, accurate, no account required.',
  status: 'Live',
  url: 'https://clearair.vercel.app',
  features: [
    'Checks restricted, prohibited, and controlled airspace instantly',
    'Uses live FAA data — no stale static datasets',
    'Works without an account or API key',
    'Mobile-friendly map with tap-to-check',
  ],
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}

/* ── Metadata ──────────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const products = await getProducts()
  const product =
    products.find((p) => p.slug === params.slug) ??
    (params.slug === 'clearair' ? CLEARAIR_FALLBACK : null)

  if (!product) return {}

  const title = `${product.name} — Rafid Industries`
  const description = product.description

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: 'Rafid Industries',
    },
    alternates: {
      canonical: `https://rafid-industries-7um2.vercel.app/tools/${params.slug}`,
    },
  }
}

/* ── Page ──────────────────────────────────────────────────────────────── */
export default async function ToolPage({
  params,
}: {
  params: { slug: string }
}) {
  const products = await getProducts()
  let product =
    products.find((p) => p.slug === params.slug) ??
    (params.slug === 'clearair' ? CLEARAIR_FALLBACK : null)

  if (!product) notFound()

  // If KV product exists but is missing features, merge in the ClearAir fallback features
  const features =
    product.features?.length
      ? product.features
      : params.slug === 'clearair'
        ? CLEARAIR_FALLBACK.features
        : []

  const checks =
    params.slug === 'clearair' ? await getClearAirChecks() : null

  return (
    <PageWrapper>
      <main className="px-6 py-20" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="mx-auto max-w-3xl">

          {/* ── Breadcrumb ─────────────────────────────────────────── */}
          <Link
            href="/#products"
            className="group inline-flex items-center gap-1.5 text-sm transition-colors duration-200"
            style={{ color: 'var(--muted)' }}
          >
            <span className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
            Tools
          </Link>

          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="mt-8 flex flex-wrap items-baseline gap-4">
            <h1
              className="font-serif text-5xl lg:text-6xl"
              style={{ color: 'var(--text)', fontWeight: 300 }}
            >
              {product.name}
            </h1>
            {product.status === 'Live' && (
              <span
                className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
                style={{ borderColor: 'var(--sage)', color: 'var(--sage)' }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: '#7A9E82' }}
                />
                Live
              </span>
            )}
          </div>

          {/* ── Description ────────────────────────────────────────── */}
          <p
            className="mt-6 text-base leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            {product.description}
          </p>

          {/* ── Launch CTA ─────────────────────────────────────────── */}
          {product.url && (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: 'var(--sage)', color: '#fff' }}
            >
              Launch {product.name} →
            </a>
          )}

          {/* ── What it does ───────────────────────────────────────── */}
          {features.length > 0 && (
            <div
              className="mt-14 rounded-xl border p-6"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--surface)',
              }}
            >
              <h2
                className="mb-5 font-serif text-xl font-semibold"
                style={{ color: 'var(--text)' }}
              >
                What it does
              </h2>
              <ul className="space-y-3">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm leading-relaxed"
                    style={{ color: 'var(--muted)' }}
                  >
                    <span style={{ color: 'var(--sage)', flexShrink: 0 }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Usage counter ──────────────────────────────────────── */}
          {checks !== null && (
            <div
              className="mt-6 rounded-xl border p-6 text-center"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--surface)',
              }}
            >
              <p
                className="font-serif text-4xl"
                style={{ color: 'var(--sage)', fontWeight: 300 }}
              >
                {formatNumber(checks)}
              </p>
              <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
                airspace checks run
              </p>
            </div>
          )}

          {/* ── Footer ─────────────────────────────────────────────── */}
          <div
            className="mt-16 border-t pt-8 text-center"
            style={{ borderColor: 'var(--border)' }}
          >
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              More tools coming soon.{' '}
              <Link
                href="/"
                className="font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: 'var(--sage)' }}
              >
                Back to Rafid Industries →
              </Link>
            </p>
          </div>

        </div>
      </main>
    </PageWrapper>
  )
}
