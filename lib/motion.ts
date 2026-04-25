import type { Variants, Transition } from 'framer-motion'

// ─── Easing ──────────────────────────────────────────────────────────────────

/** Standard ease — used across all main variants */
export const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1]

/** Sharp deceleration for character reveals */
export const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1]

// ─── Transition defaults ─────────────────────────────────────────────────────

export const motionDefaults: { transition: Transition } = {
  transition: {
    ease,
    duration: 0.9,
  },
}

// ─── Variants ────────────────────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease },
  },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease },
  },
}

/** For individual characters — clip with overflow:hidden on parent */
export const charReveal: Variants = {
  hidden: { y: '100%' },
  visible: {
    y: '0%',
    transition: { duration: 0.7, ease: easeOutExpo },
  },
}

/** Horizontal rule / underline reveal */
export const lineReveal: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, ease },
  },
}
