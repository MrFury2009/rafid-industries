'use client'

import { MotionConfig } from 'framer-motion'
import { motionDefaults } from '@/lib/motion'

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      transition={motionDefaults.transition}
      reducedMotion="user"
    >
      {children}
    </MotionConfig>
  )
}
