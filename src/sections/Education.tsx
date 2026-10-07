import { GraduationCap, School } from 'lucide-react'
import { Badges } from '../components/Badges'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { TiltCard } from '../components/TiltCard'
import { education, type EducationEntry } from '../data/education'
import './Education.css'

function Years({ start, end }: Pick<EducationEntry, 'start' | 'end'>) {
  return (
    <p className="edu-card__years mono">
      {start !== undefined && (
        <>
          <time dateTime={String(start)}>{start}</time>
          <span aria-hidden="true"> — </span>
          <span className="sr-only"> to </span>
        </>
      )}
      <time dateTime={String(end)}>{end}</time>
    </p>
  )
}

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
          {education.map((entry, i) => {
            const primary = i === 0
            const Icon = primary ? GraduationCap : School
            return (
              <Reveal key={entry.institution} as="li" className="timeline__item" delay={i * 0.08}>
                <span className="timeline__marker" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <TiltCard
                  className={`edu-card glass${primary ? '' : ' edu-card--compact'}`}
                  maxTilt={3}
                >
                  <Years start={entry.start} end={entry.end} />
                  <h3 className="edu-card__school">{entry.institution}</h3>
                  {entry.place && <p className="edu-card__place">{entry.place}</p>}
                  <p className="edu-card__degree">{entry.credential}</p>
                  {entry.coursework && (
                    <div className="edu-card__coursework">
                      <h4 className="edu-card__label mono">Relevant coursework</h4>
                      <Badges
                        items={entry.coursework}
                        label="Relevant coursework"
                        variant="feature"
                      />
                    </div>
                  )}
                </TiltCard>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
