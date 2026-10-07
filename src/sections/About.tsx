import { m } from 'motion/react'
import { GraduationCap, Languages, MapPin } from 'lucide-react'
import { fadeUp, revealViewport, staggerChildren } from '../animations/variants'
import { Counter } from '../components/Counter'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { TiltCard } from '../components/TiltCard'
import { education } from '../data/education'
import { profile, stats } from '../data/profile'
import './About.css'

const terminal: { cmd: string; out: string }[] = [
  { cmd: 'whoami', out: 'tejas-nagmote · cs undergraduate, pes university' },
  { cmd: 'cat focus', out: 'c++ systems · backend engineering · distributed systems' },
  { cmd: 'cat debugging', out: 'concurrency · memory safety · correctness' },
  { cmd: 'ls stack/', out: 'postgresql  redis  websockets  docker  github-actions' },
]

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
                  B.Tech CSE, {education.institution} ({education.start}–{education.end})
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
              <m.div
                className="terminal__body mono"
                variants={staggerChildren(0.22, 0.2)}
                initial="hidden"
                whileInView="visible"
                viewport={revealViewport}
              >
                {terminal.map((line) => (
                  <m.div key={line.cmd} variants={terminalLine} className="terminal__entry">
                    <p>
                      <span className="terminal__prompt" aria-hidden="true">
                        $
                      </span>{' '}
                      {line.cmd}
                    </p>
                    <p className="terminal__out">{line.out}</p>
                  </m.div>
                ))}
                <m.p variants={terminalLine} aria-hidden="true">
                  <span className="terminal__prompt">$</span> <span className="terminal__caret" />
                </m.p>
              </m.div>
            </TiltCard>
          </Reveal>
        </div>

        <m.ul
          className="about__stats"
          variants={staggerChildren(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
        >
          {stats.map((s) => (
            <m.li key={s.label} variants={fadeUp} className="stat glass">
              <Counter value={s.value} className="stat__value gradient-text" />
              <p className="stat__label">{s.label}</p>
              <p className="stat__context">{s.context}</p>
            </m.li>
          ))}
        </m.ul>
      </div>
    </section>
  )
}
