/**
 * KV helpers — server-side only (no NEXT_PUBLIC_ prefix on any env var).
 * All functions have try/catch with graceful fallback (null / empty array).
 * Never import this file from 'use client' components.
 */

import { Redis } from '@upstash/redis'

// Singleton — reuse across requests in the same server instance
let _kv: Redis | null = null

function getKv(): Redis {
  if (!_kv) {
    _kv = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
  }
  return _kv
}

/* ── Pageview tracking ───────────────────────────────────────────────── */
export async function getPageviews(page: string): Promise<number | null> {
  try {
    const kv = getKv()
    const val = await kv.get<number>(`pageviews:${page}`)
    return val ?? 0
  } catch {
    // KV not configured or network error — return null, page still renders
    return null
  }
}

export async function incrementPageview(page: string): Promise<void> {
  try {
    const kv = getKv()
    await kv.incr(`pageviews:${page}`)
  } catch {
    // Silently fail — pageview tracking is non-critical
  }
}

/* ── Products ────────────────────────────────────────────────────────── */
export interface Product {
  slug: string
  name: string
  tagline?: string
  description: string
  status?: string        // e.g. "Live" | "Beta" | "Coming Soon"
  url?: string           // external launch URL
  price?: number
  available?: boolean
  features?: string[]
  createdAt?: string
}

/** Read all products. Stored as a JSON array under key "products". */
export async function getProducts(): Promise<Product[]> {
  try {
    const kv = getKv()
    const products = await kv.get<Product[]>('products')
    return products ?? []
  } catch {
    return []
  }
}

/** Overwrite the full products array. */
export async function setProducts(products: Product[]): Promise<boolean> {
  try {
    const kv = getKv()
    await kv.set('products', products)
    return true
  } catch {
    return false
  }
}

/** Convenience: get a single product by slug from the products array. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts()
  return products.find((p) => p.slug === slug) ?? null
}

/** Legacy hset-based getter kept for backward compat. */
export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const kv = getKv()
    const product = await kv.hgetall(`product:${slug}`)
    return (product as unknown as Product) ?? null
  } catch {
    return null
  }
}

export async function setProduct(slug: string, data: Product): Promise<boolean> {
  try {
    const kv = getKv()
    await kv.hset(`product:${slug}`, { ...data } as Record<string, unknown>)
    return true
  } catch {
    return false
  }
}

/* ── ClearAir usage counter ──────────────────────────────────────────── */
export async function getClearAirChecks(): Promise<number> {
  try {
    const kv = getKv()
    const val = await kv.get<number>('clearair_checks')
    return val ?? 0
  } catch {
    return 0
  }
}

/* ── Admin stats ─────────────────────────────────────────────────────── */
export interface AdminStats {
  totalPageviews: number
  homeViews: number
  productsViews: number
}

export async function getAdminStats(): Promise<AdminStats | null> {
  try {
    const kv = getKv()
    const [total, home, products] = await Promise.all([
      kv.get<number>('pageviews:total'),
      kv.get<number>('pageviews:home'),
      kv.get<number>('pageviews:products'),
    ])
    return {
      totalPageviews: total ?? 0,
      homeViews: home ?? 0,
      productsViews: products ?? 0,
    }
  } catch {
    return null
  }
}
