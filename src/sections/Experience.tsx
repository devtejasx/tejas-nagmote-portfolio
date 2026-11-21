import { ArrowUpRight, Award, Briefcase, GitMerge, GraduationCap } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { experience } from '../data/experience'
import { kindLabels, timeline, type TimelineKind } from '../data/timeline'
import './Experience.css'

const icons: Record<TimelineKind, typeof Briefcase> = {
  employment: Briefcase,
  'open-source': GitMerge,
  recognition: Award,
  education: GraduationCap,
}

function Clients() {
  const [job] = experience
  return (
    <ul className="exp-clients" aria-label={`Client work at ${job.company}`}>
      {job.clients.map((c) => (
        <li key={c.client} className="exp-client">
          <p className="exp-client__area mono">{c.area}</p>
          <h4 className="exp-client__name">
            <a href={c.site} target="_blank" rel="noreferrer">
              {c.client}
              <ArrowUpRight size={13} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </h4>
          <p className="exp-client__about">{c.about}</p>
          <ul className="exp-client__scale" aria-label={`${c.client} usage`}>
            {c.scale.map((s) => (
              <li key={s} className="mono">
                {s}
              </li>
            ))}
          </ul>
          <p className="exp-client__summary">{c.summary}</p>
        </li>
      ))}
    </ul>
  )
}

export function Experience() {
  return (
    <section
      id="experience"
      className="section section--divided"
      aria-labelledby="experience-title"
    >
      <div className="container">
        <SectionHeading eyebrow="Experience & education" id="experience-title" title="Timeline">
          <p>
            Employment, open-source work and education, each labelled for what it is. Open-source
            contributions are volunteer work on public projects, not employment.
          </p>
        </SectionHeading>

        <ol className="tl">
          {timeline.map((t) => {
            const Icon = icons[t.kind]
            return (
              <Reveal as="li" key={t.id} className={`tl__item tl__item--${t.kind}`}>
                <p className="tl__when mono">{t.when}</p>
                <span className="tl__marker" aria-hidden="true">
                  <Icon size={14} />
                </span>
                <div className="tl__body">
                  <p className="tl__kind mono">{kindLabels[t.kind]}</p>
                  <h3 className="tl__title">{t.title}</h3>
                  <p className="tl__org">
                    {t.orgHref ? (
                      <a
                        className="text-link"
                        href={t.orgHref}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t.org}
                        <ArrowUpRight size={13} aria-hidden="true" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      t.org
                    )}
                  </p>
                  {t.points.length > 0 && (
                    <ul className="tl__points">
                      {t.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}
                  {t.showClients && <Clients />}
                </div>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
