import type { ReactNode } from 'react'
import { m } from 'motion/react'
import { fadeUp, revealViewport, staggerChildren } from '../animations/variants'

interface SectionHeadingProps {
  index: string
  eyebrow: string
  title: ReactNode
  id: string
  children?: ReactNode
}

export function SectionHeading({ index, eyebrow, title, id, children }: SectionHeadingProps) {
  return (
    <m.header
      className="section-heading"
      variants={staggerChildren(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      <m.p className="section-heading__eyebrow mono" variants={fadeUp}>
        <span className="section-heading__index">{index}</span>
        <span aria-hidden="true">/</span>
        {eyebrow}
      </m.p>
      <m.h2 id={id} className="section-heading__title" variants={fadeUp}>
        {title}
      </m.h2>
      {children && (
        <m.div className="section-heading__lead" variants={fadeUp}>
          {children}
        </m.div>
      )}
    </m.header>
  )
}
