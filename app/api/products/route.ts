import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/kv'

/**
 * Static read-only product listing.
 * Cache-Control: s-maxage=60, stale-while-revalidate=300
 */
export async function GET() {
  try {
    const products = await getProducts()

    // Fallback static data if KV is empty
    const result =
      products.length > 0
        ? products
        : [
            {
              slug: 'clearair',
              name: 'ClearAir',
              tagline: 'Real-time airspace situational awareness.',
              description: 'Live airspace data for drone operators.',
              available: true,
            },
            {
              slug: 'airspace-map',
              name: 'AirspaceMap',
              tagline: 'Interactive drone zone visualisation.',
              description: 'Plan routes before you fly.',
              available: true,
            },
            {
              slug: 'drone-tech',
              name: 'DroneTech Platform',
              tagline: 'End-to-end drone fleet management.',
              description: 'Monitor your entire fleet.',
              available: false,
            },
          ]

    return NextResponse.json(
      { products: result },
      {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        },
      },
    )
  } catch (err) {
    console.error('[api/products] Error:', err)
    return NextResponse.json(
      { error: 'Failed to load products', products: [] },
      { status: 500 },
    )
  }
}
