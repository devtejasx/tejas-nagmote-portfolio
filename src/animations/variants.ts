import type { Transition, Variants } from 'motion/react'

export const easeOut: Transition['ease'] = [0.22, 1, 0.36, 1]

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: easeOut } },
}

export const staggerChildren = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
})

/** Shared viewport settings so every reveal triggers at the same depth. */
export const revealViewport = { once: true, amount: 0.15 } as const
