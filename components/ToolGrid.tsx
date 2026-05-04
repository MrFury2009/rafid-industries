'use client'

import { motion } from 'framer-motion'
import ToolCard from './ToolCard'
import type { Product } from '@/lib/kv'

export default function ToolGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-border dark:bg-dark-border">
      {products.map((product, i) => (
        <motion.div
          key={product.slug}
          className="bg-bg dark:bg-dark-bg"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.3, ease: 'easeOut' }}
        >
          <ToolCard
            name={product.name}
            description={product.description}
            status={product.status}
            slug={product.slug}
            url={product.url}
          />
        </motion.div>
      ))}
    </div>
  )
}
