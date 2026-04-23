import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageWrapper } from '@/components/PageWrapper'

export const revalidate = 60

const PRODUCTS: Record<
  string,
  {
    name: string
    tagline: string
    description: string
    image: string
    features: string[]
  }
> = {
  clearair: {
    name: 'ClearAir',
    tagline: 'Real-time airspace situational awareness.',
    description:
      'ClearAir gives drone operators a live, colour-coded map of airspace classifications, NOTAMs, and flight restrictions. Powered by FAA data updated in real time.',
    image: '/images/products/clearair-hero.svg',
    features: [
      'Live airspace classification overlay',
      'NOTAM integration and alerts',
      'Restricted zone pulse indicators',
      'Geocoding-powered location search',
      'Offline-capable with service worker',
      'MapLibre GL JS rendering engine',
    ],
  },
  'airspace-map': {
    name: 'AirspaceMap',
    tagline: 'Interactive drone zone visualisation.',
    description:
      'Visualise controlled, restricted, and prohibited airspace with centimetre-accurate boundary data. Plan routes before you fly.',
    image: '/images/products/airspace-map.svg',
    features: [
      'Sub-metre boundary accuracy',
      'Route planning tools',
      'Export to KML / GeoJSON',
      'Historical airspace snapshots',
      'API for third-party integration',
    ],
  },
  'drone-tech': {
    name: 'DroneTech Platform',
    tagline: 'End-to-end drone fleet management.',
    description:
      'Monitor, schedule, and maintain your entire drone fleet from a single dashboard. Predictive maintenance powered by onboard telemetry.',
    image: '/images/products/drone-tech.svg',
    features: [
      'Real-time telemetry dashboard',
      'Predictive maintenance alerts',
      'Mission scheduling and logs',
      'Multi-pilot management',
      'Compliance report generation',
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(PRODUCTS).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const product = PRODUCTS[params.slug]
  if (!product) return {}
  return { title: product.name, description: product.tagline }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS[params.slug]
  if (!product) notFound()

  return (
    <PageWrapper>
      <main className="px-6 py-20" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="mx-auto max-w-4xl">
          <Link
            href="/products"
            className="nav-link mb-8 inline-flex items-center gap-2 text-sm"
            style={{ color: 'var(--muted)' }}
          >
            ← Back to Products
          </Link>

          {/* Hero */}
          <div
            className="relative mb-12 h-72 w-full overflow-hidden rounded-2xl"
            style={{ backgroundColor: 'var(--surface)' }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
              className="object-contain p-12"
            />
          </div>

          {/* Content */}
          <h1
            className="font-serif text-4xl font-semibold"
            style={{ color: 'var(--text)' }}
          >
            {product.name}
          </h1>
          <p className="mt-2 text-lg font-medium" style={{ color: 'var(--sage)' }}>
            {product.tagline}
          </p>
          <p
            className="mt-6 text-base leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            {product.description}
          </p>

          {/* Features */}
          <div
            className="mt-10 rounded-xl border p-6"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--surface)',
            }}
          >
            <h2
              className="mb-4 font-serif text-xl font-semibold"
              style={{ color: 'var(--text)' }}
            >
              Key Features
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: 'var(--muted)' }}
                >
                  <span style={{ color: 'var(--sage)' }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </PageWrapper>
  )
}
