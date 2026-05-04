import { getProducts, setProducts, DEFAULT_PRODUCTS } from '@/lib/kv'
import ToolGrid from '@/components/ToolGrid'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Tools — Rafid Industries',
  description: 'Deterministic tools. No AI dependencies. Built for precision.',
}

export default async function ToolsPage() {
  let products = await getProducts()

  if (products.length === 0) {
    await setProducts(DEFAULT_PRODUCTS)
    products = DEFAULT_PRODUCTS
  }

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-16">
      <div>
        <h1 className="font-display font-light text-4xl md:text-5xl text-ink dark:text-dark-text mb-3">
          Educational Tools
        </h1>
        <p className="font-sans text-base text-ink/60 dark:text-dark-text/60 mb-12">
          Deterministic tools. No AI dependencies. Built for precision.
        </p>
      </div>

      <ToolGrid products={products} />
    </main>
  )
}
