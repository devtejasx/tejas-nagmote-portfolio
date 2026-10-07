import type { ReactNode } from 'react'
import { motion } from 'motion/react'
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
    <motion.header
      className="section-heading"
      variants={staggerChildren(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      <motion.p className="section-heading__eyebrow mono" variants={fadeUp}>
        <span className="section-heading__index">{index}</span>
        <span aria-hidden="true">/</span>
        {eyebrow}
      </motion.p>
      <motion.h2 id={id} className="section-heading__title" variants={fadeUp}>
        {title}
      </motion.h2>
      {children && (
        <motion.div className="section-heading__lead" variants={fadeUp}>
          {children}
        </motion.div>
      )}
    </motion.header>
  )
}
