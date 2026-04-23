'use client'

import { type ReactNode } from 'react'

/**
 * Wraps page content with a mount animation (opacity + translateY).
 * Uses CSS animation so there's no JS timer — works with page.tsx files
 * by being included in each page's client subtree.
 */
export function PageWrapper({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>
}
