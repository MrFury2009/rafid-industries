import Image from 'next/image'
import Link from 'next/link'
import { PageWrapper } from '@/components/PageWrapper'
import { RevealSection } from '@/components/RevealSection'

// Static read-only route — cache aggressively
export async function generateMetadata() {
  return {
    title: 'Products',
    description: 'Explore Rafid Industries precision drone products.',
  }
}

// Note: cache headers set in the route handler pattern below
// For App Router pages, use the route segment config:
export const revalidate = 60 // ISR every 60s

const PRODUCTS = [
  {
    slug: 'clearair',
    name: 'ClearAir',
    tagline: 'Real-time airspace situational awareness.',
    description:
      'ClearAir gives drone operators a live, colour-coded map of airspace classifications, NOTAMs, and flight restrictions — all in one frictionless interface.',
    image: '/images/products/clearair-hero.svg',
    badge: 'Flagship',
  },
  {
    slug: 'airspace-map',
    name: 'AirspaceMap',
    tagline: 'Interactive drone zone visualisation.',
    description:
      'Visualise controlled, restricted, and prohibited airspace with centimetre-accurate boundary data. Plan routes before you fly.',
    image: '/images/products/airspace-map.svg',
    badge: null,
  },
  {
    slug: 'drone-tech',
    name: 'DroneTech Platform',
    tagline: 'End-to-end drone fleet management.',
    description:
      'Monitor, schedule, and maintain your entire drone fleet from a single dashboard. Predictive maintenance powered by onboard telemetry.',
    image: '/images/products/drone-tech.svg',
    badge: 'Beta',
  },
]

export default function ProductsPage() {
  return (
    <PageWrapper>
      <main className="px-6 py-20" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="mx-auto max-w-6xl">
          <RevealSection>
            <header className="mb-16">
              <p
                className="mb-3 text-sm font-medium uppercase tracking-widest"
                style={{ color: 'var(--sage)' }}
              >
                Our Suite
              </p>
              <h1
                className="font-serif text-4xl font-semibold lg:text-5xl"
                style={{ color: 'var(--text)' }}
              >
                Built for the Future of Flight
              </h1>
              <p
                className="mt-4 max-w-xl text-base leading-relaxed"
                style={{ color: 'var(--muted)' }}
              >
                Every product in our suite is purpose-built for professional
                drone operators who demand reliability, precision, and clarity.
              </p>
            </header>
          </RevealSection>

          <div className="space-y-6">
            {PRODUCTS.map((product, i) => (
              <RevealSection key={product.slug} delay={i * 60}>
                <Link
                  href={`/products/${product.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 hover:shadow-xl md:flex-row"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--surface)',
                  }}
                >
                  <div
                    className="relative h-52 flex-shrink-0 overflow-hidden md:h-auto md:w-72"
                    style={{ backgroundColor: 'var(--elevated)' }}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 288px"
                      className="object-contain p-8 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8">
                    <div className="flex items-center gap-3">
                      <h2
                        className="font-serif text-2xl font-semibold"
                        style={{ color: 'var(--text)' }}
                      >
                        {product.name}
                      </h2>
                      {product.badge && (
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                          style={{
                            backgroundColor: 'var(--sage)',
                            color: '#fff',
                          }}
                        >
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <p
                      className="mt-1 text-sm font-medium"
                      style={{ color: 'var(--sage)' }}
                    >
                      {product.tagline}
                    </p>
                    <p
                      className="mt-4 text-sm leading-relaxed"
                      style={{ color: 'var(--muted)' }}
                    >
                      {product.description}
                    </p>
                    <span
                      className="mt-6 text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
                      style={{ color: 'var(--sage)' }}
                    >
                      View details →
                    </span>
                  </div>
                </Link>
              </RevealSection>
            ))}
          </div>
        </div>
      </main>
    </PageWrapper>
  )
}
