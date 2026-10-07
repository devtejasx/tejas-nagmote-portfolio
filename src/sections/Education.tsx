import { GraduationCap } from 'lucide-react'
import { Badges } from '../components/Badges'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { TiltCard } from '../components/TiltCard'
import { education } from '../data/education'
import './Education.css'

export function Education() {
  return (
    <section id="education" className="section education" aria-labelledby="education-title">
      <div className="container">
        <SectionHeading
          index="05"
          eyebrow="Education"
          id="education-title"
          title="Where the fundamentals come from."
        />

        <ol className="timeline">
          <Reveal as="li" className="timeline__item">
            <span className="timeline__marker" aria-hidden="true">
              <GraduationCap size={20} strokeWidth={1.8} />
            </span>
            <TiltCard className="edu-card glass" maxTilt={3}>
              <p className="edu-card__years mono">
                <time dateTime={String(education.start)}>{education.start}</time>
                <span aria-hidden="true"> — </span>
                <span className="sr-only"> to </span>
                <time dateTime={String(education.end)}>{education.end}</time>
              </p>
              <h3 className="edu-card__school">{education.institution}</h3>
              <p className="edu-card__place">{education.city}, India</p>
              <p className="edu-card__degree">{education.degree}</p>
              <div className="edu-card__coursework">
                <h4 className="edu-card__label mono">Relevant coursework</h4>
                <Badges
                  items={education.coursework}
                  label="Relevant coursework"
                  variant="feature"
                />
              </div>
            </TiltCard>
          </Reveal>
        </ol>
      </div>
    </section>
  )
}
