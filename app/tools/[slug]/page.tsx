import { notFound } from 'next/navigation'
import { getProductBySlug, getClearAirChecks, getProducts, setProducts, DEFAULT_PRODUCTS } from '@/lib/kv'
import type { Metadata } from 'next'
import ViewTracker from './ViewTracker'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Ensure products are seeded
  const products = await getProducts()
  if (products.length === 0) await setProducts(DEFAULT_PRODUCTS)

  const product = await getProductBySlug(params.slug)
  if (!product) return { title: 'Not Found — Rafid Industries' }

  return {
    title: `${product.name} — Rafid Industries`,
    description: product.description,
  }
}

export default async function ToolPage({ params }: Props) {
  // Ensure products are seeded
  const products = await getProducts()
  if (products.length === 0) await setProducts(DEFAULT_PRODUCTS)

  const product = await getProductBySlug(params.slug)
  if (!product) notFound()

  const clearairChecks = params.slug === 'clearair' ? await getClearAirChecks() : null
  const isLive = product.status === 'live'
  const hasUrl = isLive && product.url

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-16">
      <ViewTracker pathname={`/tools/${params.slug}`} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ink/50 dark:text-dark-text/50 mb-10 font-sans">
        <Link href="/" className="hover:text-ink dark:hover:text-dark-text transition-colors">
          Home
        </Link>
        <span>›</span>
        <Link href="/tools" className="hover:text-ink dark:hover:text-dark-text transition-colors">
          Tools
        </Link>
        <span>›</span>
        <span className="text-ink dark:text-dark-text">{product.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="font-display font-light text-4xl md:text-5xl text-ink dark:text-dark-text">
            {product.name}
          </h1>
          {/* Status badge */}
          <span
            className={`font-sans text-xs uppercase tracking-[0.12em] px-2 py-1 border ${
              isLive
                ? 'border-sage text-sage'
                : 'border-border dark:border-dark-border text-ink/40 dark:text-dark-text/40'
            }`}
          >
            {isLive ? 'Live' : 'Soon'}
          </span>
        </div>
        <p className="font-sans text-base text-ink/60 dark:text-dark-text/60 max-w-xl">
          {product.description}
        </p>
      </div>

      {/* Features list */}
      {product.features && product.features.length > 0 && (
        <div className="mb-10">
          <p className="font-sans font-medium text-[11px] uppercase tracking-[0.22em] text-sage mb-4">
            Features
          </p>
          <ul className="space-y-2">
            {product.features.map((f, i) => (
              <li key={i} className="flex items-start gap-3 font-sans text-sm text-ink/80 dark:text-dark-text/80">
                <span className="text-sage mt-0.5 flex-shrink-0">–</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Usage stat for ClearAir */}
      {clearairChecks !== null && (
        <div className="mb-10 border border-border dark:border-dark-border p-4 inline-block">
          <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-sage mb-1">
            Total checks
          </p>
          <p className="font-display text-3xl text-ink dark:text-dark-text">
            {clearairChecks.toLocaleString()}
          </p>
        </div>
      )}

      {/* CTA */}
      {hasUrl ? (
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-sage text-bg font-sans text-sm font-medium px-6 py-3 hover:opacity-90 transition-opacity"
        >
          Launch {product.name} →
        </a>
      ) : isLive ? (
        <span className="inline-flex items-center gap-2 bg-sage/30 text-sage font-sans text-sm font-medium px-6 py-3 cursor-not-allowed">
          Launch {product.name} →
        </span>
      ) : (
        <span className="inline-flex items-center gap-2 border border-border dark:border-dark-border text-ink/40 dark:text-dark-text/40 font-sans text-sm px-6 py-3 cursor-not-allowed">
          Coming soon
        </span>
      )}
    </main>
  )
}
