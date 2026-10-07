import type { ReactNode } from 'react'
import { m, type Variants } from 'motion/react'
import { fadeUp, revealViewport } from '../animations/variants'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  variants?: Variants
  as?: 'div' | 'li' | 'article' | 'section'
}

/** Fades content up once it scrolls into view. Motion skips the movement under reduced motion. */
export function Reveal({
  children,
  className,
  delay = 0,
  variants = fadeUp,
  as = 'div',
}: RevealProps) {
  const Component = m[as]
  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      transition={{ delay }}
    >
      {children}
    </Component>
  )
}
