import { motion } from 'motion/react'
import {
  BookOpen,
  Cloud,
  CodeXml,
  Cpu,
  Database,
  FlaskConical,
  Network,
  Server,
  type LucideIcon,
} from 'lucide-react'
import { fadeUp, revealViewport, staggerChildren } from '../animations/variants'
import { SectionHeading } from '../components/SectionHeading'
import { TiltCard } from '../components/TiltCard'
import { skillCategories } from '../data/skills'
import './Skills.css'

const icons: Record<string, LucideIcon> = {
  languages: CodeXml,
  systems: Cpu,
  backend: Server,
  distributed: Network,
  databases: Database,
  cloud: Cloud,
  testing: FlaskConical,
  fundamentals: BookOpen,
}

/** Bento order: wide cards alternate with pairs of narrow ones. */
const order = [
  'systems',
  'languages',
  'distributed',
  'backend',
  'databases',
  'cloud',
  'fundamentals',
  'testing',
]
const wide = new Set(['systems', 'backend', 'fundamentals', 'testing'])
const ordered = order.map((id) => skillCategories.find((c) => c.id === id)!)

const chip = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
}

export function Skills() {
  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading index="02" eyebrow="Skills" id="skills-title" title="The toolkit.">
          <p>
            From thread-safe C++ to the services, databases and pipelines around it — grouped as on
            my resume.
          </p>
        </SectionHeading>

        <motion.ul
          className="skills__grid"
          variants={staggerChildren(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {ordered.map((category) => {
            const Icon = icons[category.id]
            return (
              <motion.li
                key={category.id}
                variants={fadeUp}
                className={`skills__cell ${wide.has(category.id) ? 'skills__cell--wide' : ''}`}
              >
                <TiltCard className="skill-card glass" maxTilt={5}>
                  <div className="skill-card__head">
                    <span className="skill-card__icon" aria-hidden="true">
                      <Icon size={20} strokeWidth={1.8} />
                    </span>
                    <span className="skill-card__tag mono" aria-hidden="true">
                      // {category.tag}
                    </span>
                    <span className="skill-card__count mono" aria-hidden="true">
                      {String(category.skills.length).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="skill-card__title">{category.title}</h3>
                  <motion.ul
                    className="skill-card__list"
                    variants={staggerChildren(0.05, 0.15)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={revealViewport}
                  >
                    {category.skills.map((skill) => (
                      <motion.li key={skill} variants={chip} className="skill-chip">
                        {skill}
                      </motion.li>
                    ))}
                  </motion.ul>
                </TiltCard>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}
