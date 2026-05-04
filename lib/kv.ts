import { Redis } from '@upstash/redis'

let _kv: Redis | null = null

function getKv(): Redis {
  if (!_kv) {
    _kv = new Redis({
      url: process.env.KV_REST_API_URL ?? '',
      token: process.env.KV_REST_API_TOKEN ?? '',
    })
  }
  return _kv
}

export interface Product {
  slug: string
  name: string
  description: string
  status: 'live' | 'soon'
  url?: string
  features?: string[]
  createdAt?: string
}

export const DEFAULT_PRODUCTS: Product[] = [
  {
    name: 'ClearAir',
    slug: 'clearair',
    description: 'Drone airspace checker. Instant. No account required.',
    status: 'live',
    url: 'https://clearair.vercel.app',
    features: [
      'Checks restricted, prohibited, and controlled airspace instantly',
      'Uses live FAA data — no stale static datasets',
      'Works without an account or API key',
      'Mobile-friendly map with tap-to-check',
    ],
  },
  {
    name: 'RI Relay',
    slug: 'ri-relay',
    description: 'Offload Minecraft chunk generation to your iPad.',
    status: 'soon',
    url: '',
  },
  {
    name: 'APA Generator',
    slug: 'apa',
    description: 'Deterministic APA7 citation formatter. Zero AI.',
    status: 'live',
    url: '',
  },
  {
    name: 'Coming Soon',
    slug: 'tbd-1',
    description: 'Another tool in development.',
    status: 'soon',
    url: '',
  },
  {
    name: 'Coming Soon',
    slug: 'tbd-2',
    description: 'Another tool in development.',
    status: 'soon',
    url: '',
  },
  {
    name: 'Coming Soon',
    slug: 'tbd-3',
    description: 'Another tool in development.',
    status: 'soon',
    url: '',
  },
]

export async function getProducts(): Promise<Product[]> {
  try {
    const kv = getKv()
    const products = await kv.get<Product[]>('products')
    return products ?? []
  } catch {
    return []
  }
}

export async function setProducts(products: Product[]): Promise<boolean> {
  try {
    const kv = getKv()
    await kv.set('products', products)
    return true
  } catch {
    return false
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts()
  return products.find((p) => p.slug === slug) ?? null
}

export async function getHeroText(): Promise<string> {
  try {
    const kv = getKv()
    const val = await kv.get<string>('hero_text')
    return val ?? ''
  } catch {
    return ''
  }
}

export async function setHeroText(text: string): Promise<boolean> {
  try {
    const kv = getKv()
    await kv.set('hero_text', text)
    return true
  } catch {
    return false
  }
}

export async function getAdminNotes(): Promise<string> {
  try {
    const kv = getKv()
    const val = await kv.get<string>('admin_notes')
    return val ?? ''
  } catch {
    return ''
  }
}

export async function setAdminNotes(text: string): Promise<boolean> {
  try {
    const kv = getKv()
    await kv.set('admin_notes', text)
    return true
  } catch {
    return false
  }
}

export async function getClearAirChecks(): Promise<number> {
  try {
    const kv = getKv()
    const val = await kv.get<number>('clearair_checks')
    return val ?? 0
  } catch {
    return 0
  }
}

export async function incrementClearAirChecks(): Promise<number> {
  try {
    const kv = getKv()
    const newVal = await kv.incr('clearair_checks')
    return newVal
  } catch {
    return 0
  }
}

export async function getPageViews(page: string): Promise<number> {
  try {
    const kv = getKv()
    const val = await kv.get<number>(`views:${page}`)
    return val ?? 0
  } catch {
    return 0
  }
}

export async function incrementPageViews(page: string): Promise<void> {
  try {
    const kv = getKv()
    await Promise.all([
      kv.incr(`views:${page}`),
      kv.incr('views:total'),
    ])
  } catch {
    // non-critical
  }
}
