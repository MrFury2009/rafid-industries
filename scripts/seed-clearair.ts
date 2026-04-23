/**
 * Seed script: upsert ClearAir into the KV products array.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seed-clearair.ts
 *
 * Requires: tsx  (npm i -D tsx)
 * Env vars: KV_REST_API_URL, KV_REST_API_TOKEN  (set in .env.local / Vercel dashboard)
 */

import { getProducts, setProducts } from '../lib/kv'
import type { Product } from '../lib/kv'

const CLEARAIR: Product = {
  name: 'ClearAir',
  slug: 'clearair',
  description: 'Drone airspace checker. Instant, accurate, no account required.',
  status: 'Live',
  url: 'https://clearair.vercel.app',
  features: [
    'Checks restricted, prohibited, and controlled airspace instantly',
    'Uses live FAA data — no stale static datasets',
    'Works without an account or API key',
    'Mobile-friendly map with tap-to-check',
  ],
  createdAt: new Date().toISOString(),
}

async function main() {
  console.log('🌱  Seeding ClearAir into KV…')

  const existing = await getProducts()
  console.log(`   Found ${existing.length} existing product(s).`)

  const idx = existing.findIndex((p) => p.slug === 'clearair')

  let updated: Product[]
  if (idx !== -1) {
    // Update in place — preserve createdAt if already set
    updated = [...existing]
    updated[idx] = { ...CLEARAIR, createdAt: existing[idx].createdAt ?? CLEARAIR.createdAt }
    console.log('   ClearAir already exists — updating record.')
  } else {
    // Append
    updated = [...existing, CLEARAIR]
    console.log('   ClearAir not found — appending new record.')
  }

  const ok = await setProducts(updated)
  if (ok) {
    console.log('✅  Done. Products in KV:', updated.map((p) => p.slug).join(', '))
  } else {
    console.error('❌  Failed to write to KV. Check KV_REST_API_URL / KV_REST_API_TOKEN.')
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
