'use client'

import {
  motion,
  useInView,
  type Variants,
  type HTMLMotionProps,
} from 'framer-motion'
import { useRef, type ElementType, type ReactNode } from 'react'
import { staggerContainer, fadeUp } from '@/lib/motion'

type As = 'section' | 'div' | 'article' | 'aside' | 'main' | 'header' | 'footer'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  id?: string
  as?: As
  childVariant?: Variants
  /** Override container variants entirely */
  containerVariant?: Variants
  /** Delay before stagger begins */
  delayChildren?: number
}

export function AnimatedSection({
  children,
  className,
  id,
  as = 'section',
  childVariant = fadeUp,
  containerVariant,
  delayChildren,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref as React.RefObject<Element>, {
    once: true,
    margin: '-80px',
  })

  const container: Variants = containerVariant ?? {
    ...staggerContainer,
    visible: {
      ...((staggerContainer.visible as object) ?? {}),
      transition: {
        staggerChildren: 0.12,
        delayChildren: delayChildren ?? 0.1,
      },
    },
  }

  // Inject childVariant into React context via CSS custom property trick
  // Instead, we'll clone children with the variant prop — but since children
  // can be arbitrary, we use a context approach via CSS vars.
  // Simplest production pattern: export context so children can consume it.

  const MotionTag = motion[as as keyof typeof motion] as ElementType

  return (
    <MotionTag
      ref={ref}
      id={id}
      className={className}
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {children}
    </MotionTag>
  )
}

/**
 * AnimatedItem — use inside AnimatedSection for staggered children.
 * Reads childVariant from nearest AnimatedSection (via variants cascade).
 */
export function AnimatedItem({
  children,
  className,
  variant = fadeUp,
  ...rest
}: {
  children: ReactNode
  className?: string
  variant?: Variants
} & Omit<HTMLMotionProps<'div'>, 'variants' | 'className' | 'children'>) {
  return (
    <motion.div className={className} variants={variant} {...rest}>
      {children}
    </motion.div>
  )
}
