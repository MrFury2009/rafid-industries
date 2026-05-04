import { getProducts, getHeroText, setProducts, DEFAULT_PRODUCTS } from '@/lib/kv'
import Wordmark from '@/components/Wordmark'
import ToolGrid from '@/components/ToolGrid'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Home() {
  let [products, heroText] = await Promise.all([
    getProducts(),
    getHeroText(),
  ])

  if (products.length === 0) {
    await setProducts(DEFAULT_PRODUCTS)
    products = DEFAULT_PRODUCTS
  }

  const headline = heroText || 'Precision software. Built in public.'

  return (
    <main>
      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-6 pt-24 pb-16">
        <div className="mb-8">
          <Wordmark size="lg" animated />
        </div>

        <div>
          <h1
            className="font-display font-light italic text-ink dark:text-dark-text leading-tight mb-4"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
          >
            {headline}
          </h1>
          <p className="font-sans text-base text-ink/60 dark:text-dark-text/60">
            Tools, apps, and products from Rafid Industries.
          </p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6">
        <hr className="border-t border-border dark:border-dark-border" />
      </div>

      {/* Tools section */}
      <section className="max-w-[1200px] mx-auto px-6 pt-10 pb-24">
        <p className="font-sans font-medium text-[11px] uppercase tracking-[0.22em] text-sage mb-6">
          Tools
        </p>
        <ToolGrid products={products} />
      </section>

      {/* Footer */}
      <footer className="border-t border-border dark:border-dark-border">
        <div className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <Wordmark size="sm" />
            <p className="font-display italic text-sm text-ink/50 dark:text-dark-text/50 mt-1">
              Built in public.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-ink/50 dark:text-dark-text/50">
            <a
              href="https://github.com/rafidindustries"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink dark:hover:text-dark-text transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://x.com/rafidindustries"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink dark:hover:text-dark-text transition-colors"
            >
              X
            </a>
            <span>© 2025 Rafid Industries</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
