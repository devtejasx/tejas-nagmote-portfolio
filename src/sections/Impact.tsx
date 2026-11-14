import { m, type Variants } from 'motion/react'
import { FlaskConical, GitMerge, Gauge, Layers, ScrollText, type LucideIcon } from 'lucide-react'
import { revealViewport, staggerChildren } from '../animations/variants'
import { Counter } from '../components/Counter'
import { TiltCard } from '../components/TiltCard'
import { stats } from '../data/profile'
import './Impact.css'

const icons: LucideIcon[] = [GitMerge, Layers, FlaskConical, ScrollText, Gauge]

/** Cards swing up out of the page, like panels rising onto a desk. */
const rise: Variants = {
  hidden: { opacity: 0, rotateX: -32, y: 40 },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

export function Impact() {
  return (
    <section id="impact" className="section impact" aria-labelledby="impact-title">
      <div className="container">
        <header className="impact__header">
          <p className="section-heading__eyebrow mono">
            <span className="section-heading__index">00</span>
            <span aria-hidden="true">/</span>
            Impact
          </p>
          <h2 id="impact-title" className="impact__title">
            Code that ships, <span className="gradient-text">most of it reviewed upstream.</span>
          </h2>
        </header>

        <m.ul
          className="impact__grid"
          variants={staggerChildren(0.09)}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
        >
          {stats.map((stat, i) => {
            const Icon = icons[i % icons.length]
            return (
              <m.li key={stat.label} variants={rise} className="impact__cell">
                <TiltCard className="impact-card glass" maxTilt={8}>
                  <span className="impact-card__icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <Counter value={stat.value} className="impact-card__value gradient-text" />
                  <p className="impact-card__label">{stat.label}</p>
                  <p className="impact-card__context">{stat.context}</p>
                </TiltCard>
              </m.li>
            )
          })}
        </m.ul>
      </div>
    </section>
  )
}
