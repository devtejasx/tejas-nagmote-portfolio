import { m } from 'motion/react'
import { GraduationCap, Languages, MapPin } from 'lucide-react'
import { revealViewport, staggerChildren } from '../animations/variants'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { TiltCard } from '../components/TiltCard'
import { university } from '../data/education'
import { atAGlance, profile } from '../data/profile'
import './About.css'

const terminalLine = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
}

export function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container">
        <SectionHeading
          index="01"
          eyebrow="About"
          id="about-title"
          title="Systems-minded, from the mutex up."
        />

        <div className="about__grid">
          <Reveal className="about__text">
            <p className="about__lead">{profile.summary[0]}</p>
            <p>{profile.summary[1]}</p>

            <ul className="about__focus" aria-label="Focus areas">
              {profile.focusAreas.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <dl className="about__meta">
              <div>
                <dt>
                  <MapPin size={16} aria-hidden="true" /> Based in
                </dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt>
                  <GraduationCap size={16} aria-hidden="true" /> Studying
                </dt>
                <dd>
                  B.Tech CSE, {university.institution} ({university.start}–{university.end})
                </dd>
              </div>
              <div>
                <dt>
                  <Languages size={16} aria-hidden="true" /> Speaks
                </dt>
                <dd>{profile.spokenLanguages.join(', ')}</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal className="about__terminal-wrap" delay={0.1}>
            <TiltCard className="terminal glass" maxTilt={4}>
              <div className="terminal__bar" aria-hidden="true">
                <span />
                <span />
                <span />
                <p className="mono">~/tejas</p>
              </div>
              <div className="terminal__body mono">
                <p className="terminal__command">
                  <span className="terminal__prompt" aria-hidden="true">
                    $
                  </span>{' '}
                  tejas --at-a-glance
                </p>
                <m.dl
                  className="glance"
                  variants={staggerChildren(0.12, 0.2)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={revealViewport}
                >
                  {atAGlance.map((row) => (
                    <m.div key={row.key} variants={terminalLine} className="glance__row">
                      <dt>{row.key}</dt>
                      <dd>{row.value}</dd>
                    </m.div>
                  ))}
                </m.dl>
                <p aria-hidden="true">
                  <span className="terminal__prompt">$</span> <span className="terminal__caret" />
                </p>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
