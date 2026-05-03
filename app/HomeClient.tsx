'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  fadeUp,
  fadeIn,
  staggerContainer,
  lineReveal,
  scaleIn,
} from '@/lib/motion'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

// ─── Types ────────────────────────────────────────────────────────────────────

// Loose interface — compatible with whatever getProducts() returns from @/lib/kv
interface Product {
  slug: string
  name: string
  description?: string
  status?: string
  url?: string
  features?: string[]
  category?: string
  createdAt?: string
}

interface HomeClientProps {
  products: Product[]
}

// ─── Status label helper ──────────────────────────────────────────────────────

function StatusDot({ status }: { status?: string }) {
  const label =
    status?.toLowerCase() === 'coming-soon' ? 'Coming Soon'
    : status?.toLowerCase() === 'beta' ? 'Beta'
    : status?.toLowerCase() === 'live' ? 'Live'
    : status ?? 'Live'

  const isActive = !status || status.toLowerCase() === 'live' || status.toLowerCase() === 'beta'

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: isActive ? '#7A9E82' : 'rgba(26,26,26,0.25)' }}
        aria-hidden="true"
      />
      <span
        className="text-[10px] uppercase tracking-[0.15em] font-medium"
        style={{
          color: isActive ? '#7A9E82' : 'rgba(26,26,26,0.4)',
          fontFamily: 'var(--font-dm-sans)',
        }}
      >
        {label}
      </span>
    </span>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <Link
        href={`/tools/${product.slug}`}
        className="block border border-[#1A1A1A]/10 p-8 md:p-10 relative overflow-hidden"
        style={{ backgroundColor: '#F5F4EF' }}
      >
        {/* Hover fill layer */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ backgroundColor: 'rgba(122,158,130,0.04)' }}
        />

        <div className="relative z-10 flex flex-col gap-6">
          {/* Top row: status + index */}
          <div className="flex items-center justify-between">
            <StatusDot status={product.status} />
            <span
              className="text-[11px] tabular-nums"
              style={{
                color: '#1A1A1A',
                opacity: 0.25,
                fontFamily: 'var(--font-dm-sans)',
                letterSpacing: '0.08em',
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Product name */}
          <div>
            <h3
              className="text-xl md:text-2xl font-medium leading-tight tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-dm-sans)', color: '#1A1A1A' }}
            >
              {product.name}
            </h3>
            {product.category && (
              <p
                className="mt-1 text-[11px] uppercase tracking-[0.14em]"
                style={{ color: '#1A1A1A', opacity: 0.4 }}
              >
                {product.category}
              </p>
            )}
          </div>

          {/* Description */}
          <p
            className="text-sm leading-relaxed"
            style={{
              color: '#1A1A1A',
              opacity: 0.6,
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            {product.description}
          </p>

          {/* Arrow */}
          <div className="flex items-center justify-between pt-2">
            <motion.span
              className="text-sm tracking-[0.06em] uppercase"
              style={{
                color: '#7A9E82',
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '11px',
                letterSpacing: '0.14em',
              }}
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.35 }}
            >
              Explore
            </motion.span>
            <motion.span
              className="text-[#7A9E82]"
              style={{ fontSize: '16px' }}
              initial={{ x: 0, opacity: 0.5 }}
              whileHover={{ x: 6, opacity: 1 }}
              transition={{ duration: 0.35 }}
              aria-hidden="true"
            >
              →
            </motion.span>
          </div>
        </div>

        {/* Bottom border reveal on hover */}
        <motion.div
          className="absolute bottom-0 left-0 h-px w-full origin-left"
          style={{ backgroundColor: '#7A9E82' }}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </Link>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function HomeClient({ products }: HomeClientProps) {
  const heroRef = useRef<HTMLElement>(null)
  const productsHeadingRef = useRef<HTMLDivElement>(null)
  const isHeroInView = useInView(heroRef as React.RefObject<Element>, {
    once: true,
    margin: '-40px',
  })
  const isProductsHeadingInView = useInView(
    productsHeadingRef as React.RefObject<Element>,
    { once: true, margin: '-60px' },
  )

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F4EF' }}>
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <motion.section
        ref={heroRef}
        className="relative min-h-[90vh] flex flex-col justify-end px-6 md:px-12 lg:px-20 pb-16 md:pb-24"
        variants={staggerContainer}
        initial="hidden"
        animate={isHeroInView ? 'visible' : 'hidden'}
      >
        {/* Thin vertical rule — left accent */}
        <motion.div
          className="absolute left-6 md:left-12 lg:left-20 top-0 w-px origin-top"
          style={{ backgroundColor: '#1A1A1A', opacity: 0.12, height: '45%' }}
          variants={{
            hidden: { scaleY: 0 },
            visible: {
              scaleY: 1,
              transition: { duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 },
            },
          }}
        />

        <div className="max-w-[1200px] mx-auto w-full">
          {/* Eyebrow */}
          <motion.p
            className="mb-6 text-[11px] uppercase tracking-[0.22em]"
            style={{ color: '#7A9E82', fontFamily: 'var(--font-dm-sans)' }}
            variants={fadeIn}
          >
            Est. 2024
          </motion.p>

          {/* Main headline */}
          <motion.h1
            className="text-[clamp(3rem,9vw,8rem)] leading-[0.92] tracking-[-0.03em] font-light"
            style={{
              fontFamily: 'var(--font-cormorant)',
              color: '#1A1A1A',
              fontWeight: 300,
            }}
            variants={fadeUp}
          >
            Rafid
            <br />
            <span style={{ opacity: 0.45 }}>Industries</span>
          </motion.h1>

          {/* Divider */}
          <div className="overflow-hidden mt-10 mb-8">
            <motion.div
              className="h-px w-full origin-left"
              style={{ backgroundColor: '#1A1A1A', opacity: 0.15 }}
              variants={lineReveal}
            />
          </div>

          {/* Tagline row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.p
              className="text-base md:text-lg leading-relaxed max-w-[480px]"
              style={{
                color: '#1A1A1A',
                opacity: 0.55,
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 500,
              }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 } } }}
            >
              Precision tools for learners and educators.
              Built with care for the people who use them.
            </motion.p>

            <motion.a
              href="#products"
              className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.18em]"
              style={{ color: '#1A1A1A', fontFamily: 'var(--font-dm-sans)', opacity: 0.5 }}
              variants={fadeIn}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span>View Products</span>
              <span aria-hidden="true" style={{ fontSize: '14px' }}>↓</span>
            </motion.a>
          </div>
        </div>
      </motion.section>

      {/* ─── Products Section ─────────────────────────────────────────────── */}
      <section
        id="products"
        className="px-6 md:px-12 lg:px-20 pt-24 pb-32"
      >
        <div className="max-w-[1200px] mx-auto">
          {/* Section heading */}
          <div ref={productsHeadingRef}>
            <motion.div
              className="flex items-end justify-between mb-16"
              variants={staggerContainer}
              initial="hidden"
              animate={isProductsHeadingInView ? 'visible' : 'hidden'}
            >
              <div>
                <motion.p
                  className="mb-3 text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: '#7A9E82', fontFamily: 'var(--font-dm-sans)' }}
                  variants={fadeIn}
                >
                  Products
                </motion.p>
                <motion.h2
                  className="text-[clamp(1.75rem,4vw,3.5rem)] font-light leading-tight tracking-[-0.025em]"
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    color: '#1A1A1A',
                    fontWeight: 300,
                  }}
                  variants={fadeUp}
                >
                  Our Products
                </motion.h2>
              </div>

              <motion.p
                className="hidden md:block text-sm tabular-nums"
                style={{
                  color: '#1A1A1A',
                  opacity: 0.3,
                  fontFamily: 'var(--font-dm-sans)',
                }}
                variants={fadeIn}
              >
                {products.length} total
              </motion.p>
            </motion.div>

            {/* Horizontal rule below heading */}
            <ScrollReveal direction="fade">
              <div className="h-px w-full mb-0" style={{ backgroundColor: '#1A1A1A', opacity: 0.1 }} />
            </ScrollReveal>
          </div>

          {/* Cards grid */}
          {products.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-px"
              style={{ backgroundColor: '#1A1A1A', opacity: undefined }}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              {products.map((product, i) => (
                <div key={product.slug} style={{ backgroundColor: '#F5F4EF' }}>
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="py-32 text-center"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p
                className="text-sm"
                style={{
                  color: '#1A1A1A',
                  opacity: 0.35,
                  fontFamily: 'var(--font-dm-sans)',
                }}
              >
                No products yet.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <motion.footer
        className="px-6 md:px-12 lg:px-20 py-12 border-t"
        style={{ borderColor: 'rgba(26,26,26,0.1)' }}
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p
              className="text-sm font-medium tracking-[0.08em] uppercase"
              style={{ fontFamily: 'var(--font-dm-sans)', color: '#1A1A1A' }}
            >
              Rafid Industries
            </p>
            <p
              className="mt-1 text-xs"
              style={{
                color: '#1A1A1A',
                opacity: 0.35,
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          <nav className="flex items-center gap-8" aria-label="Footer navigation">
            <Link
              href="/tools"
              className="text-xs uppercase tracking-[0.14em] transition-opacity"
              style={{
                color: '#1A1A1A',
                opacity: 0.4,
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              Educational Tools
            </Link>
          </nav>
        </div>
      </motion.footer>
    </main>
  )
}
