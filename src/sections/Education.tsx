import { GraduationCap } from 'lucide-react'
import { Badges } from '../components/Badges'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { TiltCard } from '../components/TiltCard'
import { university } from '../data/education'
import './Education.css'

/** Kept deliberately short: the degree in one card. Earlier schooling is on the timeline. */
export function Education() {
  return (
    <section id="education" className="section education" aria-labelledby="education-title">
      <div className="container">
        <SectionHeading index="08" eyebrow="Education" id="education-title" title="Education." />

        <Reveal className="edu">
          <span className="edu__marker" aria-hidden="true">
            <GraduationCap size={22} strokeWidth={1.8} />
          </span>
          <TiltCard className="edu-card glass" maxTilt={3}>
            <p className="edu-card__years mono">
              <time dateTime={String(university.start)}>{university.start}</time>
              <span aria-hidden="true"> — </span>
              <span className="sr-only"> to </span>
              <time dateTime={String(university.end)}>{university.end}</time>
            </p>
            <h3 className="edu-card__school">{university.institution}</h3>
            {university.place && <p className="edu-card__place">{university.place}</p>}
            <p className="edu-card__degree">{university.credential}</p>
            {university.coursework && (
              <div className="edu-card__coursework">
                <h4 className="edu-card__label mono">Relevant coursework</h4>
                <Badges
                  items={university.coursework}
                  label="Relevant coursework"
                  variant="feature"
                />
              </div>
            )}
          </TiltCard>
        </Reveal>
      </div>
    </section>
  )
}
