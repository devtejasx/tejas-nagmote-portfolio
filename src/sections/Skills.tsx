import { useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import {
  BookOpen,
  Cloud,
  Cpu,
  Database,
  FlaskConical,
  Network,
  Server,
  type LucideIcon,
} from 'lucide-react'
import { fadeUp, staggerChildren } from '../animations/variants'
import { SectionHeading } from '../components/SectionHeading'
import { TiltCard } from '../components/TiltCard'
import { skillCategories, skillEvidence } from '../data/skills'
import './Skills.css'

const icons: Record<string, LucideIcon> = {
  systems: Cpu,
  backend: Server,
  distributed: Network,
  databases: Database,
  cloud: Cloud,
  testing: FlaskConical,
  fundamentals: BookOpen,
}

const wide = new Set(['systems', 'backend', 'fundamentals'])

/** Where on the page each piece of evidence lives. */
const evidenceTarget = (name: string) => {
  switch (name) {
    case 'Real-Time Chat Server':
      return '#project-realtime-chat'
    case 'DeployX':
      return '#project-deployx'
    case 'REST API Testing Suite':
      return '#project-api-testing'
    default:
      return '#open-source'
  }
}

const categoryOf = (skill: string) =>
  skillCategories.find((c) => c.skills.includes(skill))?.title ?? ''

const clip = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text

/**
 * A small node-link picture of the selected skill and the work that uses it,
 * with packets flowing along the links (CSS only, stopped under reduced motion).
 */
function EvidenceGraph({ skill, evidence }: { skill: string; evidence: string[] }) {
  const height = Math.max(150, evidence.length * 46 + 20)
  const mid = height / 2
  const step = evidence.length > 1 ? (height - 60) / (evidence.length - 1) : 0
  return (
    <svg
      className="evidence-graph"
      viewBox={`0 0 420 ${height}`}
      role="img"
      aria-label={
        evidence.length
          ? `${skill} is used in ${evidence.join(', ')}.`
          : `${skill} is listed on the resume.`
      }
    >
      {evidence.map((e, i) => {
        const y = evidence.length > 1 ? 30 + i * step : mid
        const d = `M120 ${mid} C 190 ${mid}, 200 ${y}, 260 ${y}`
        return (
          <g key={e}>
            <path className="evidence-graph__link" d={d} />
            <path className="evidence-graph__flow" d={d} />
            <rect
              x="260"
              y={y - 15}
              width="156"
              height="30"
              rx="8"
              className="evidence-graph__node"
            />
            <text x="338" y={y + 4} textAnchor="middle" className="evidence-graph__label">
              {clip(e, 22)}
            </text>
          </g>
        )
      })}
      <circle cx="64" cy={mid} r="54" className="evidence-graph__core" />
      <text x="64" y={mid + 4} textAnchor="middle" className="evidence-graph__skill">
        {clip(skill, 14)}
      </text>
    </svg>
  )
}

export function Skills() {
  const [selected, setSelected] = useState('Redis Pub/Sub')
  const evidence = skillEvidence[selected] ?? []

  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading index="05" eyebrow="Skills" id="skills-title" title="Technical arsenal.">
          <p>
            Grouped by what each tool is for. Select any skill to see where it shows up in the work
            on this page.
          </p>
        </SectionHeading>

        <div className="evidence glass">
          <div className="evidence__text" aria-live="polite">
            <p className="evidence__eyebrow mono">{categoryOf(selected)}</p>
            <p className="evidence__skill">{selected}</p>
            {evidence.length > 0 ? (
              <ul className="evidence__list" aria-label={`Where ${selected} is used`}>
                {evidence.map((e) => (
                  <li key={e}>
                    <a className="text-link" href={evidenceTarget(e)}>
                      {e}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="evidence__none">
                Listed on the resume; not tied to a specific project on this page.
              </p>
            )}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={selected}
              className="evidence__graph"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
            >
              <EvidenceGraph skill={selected} evidence={evidence} />
            </m.div>
          </AnimatePresence>
        </div>

        <m.ul
          className="skills__grid"
          variants={staggerChildren(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {skillCategories.map((category) => {
            const Icon = icons[category.id]
            return (
              <m.li
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
                  <ul className="skill-card__list">
                    {category.skills.map((skill) => (
                      <li key={skill}>
                        <button
                          type="button"
                          className={`skill-chip${skillEvidence[skill] ? ' skill-chip--linked' : ''}`}
                          aria-pressed={selected === skill}
                          onClick={() => setSelected(skill)}
                        >
                          {skill}
                        </button>
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              </m.li>
            )
          })}
        </m.ul>
      </div>
    </section>
  )
}
