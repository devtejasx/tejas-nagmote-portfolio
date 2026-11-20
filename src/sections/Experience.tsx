import { ArrowUpRight, Briefcase } from 'lucide-react'
import { Badges } from '../components/Badges'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { TiltCard } from '../components/TiltCard'
import { experience } from '../data/experience'
import './Experience.css'

export function Experience() {
  return (
    <section id="experience" className="section experience" aria-labelledby="experience-title">
      <div className="container">
        <SectionHeading
          index="02"
          eyebrow="Experience"
          id="experience-title"
          title="Backend work for real clients."
        />

        {experience.map((job) => (
          <Reveal key={job.id} className="exp">
            <span className="exp__marker" aria-hidden="true">
              <Briefcase size={22} strokeWidth={1.8} />
            </span>
            <TiltCard className="exp-card glass" maxTilt={3}>
              <p className="exp-card__dates mono">
                <time dateTime={job.start}>{job.startLabel}</time>
                <span aria-hidden="true"> — </span>
                <span className="sr-only"> to </span>
                {job.end ? <time dateTime={job.end}>{job.endLabel}</time> : job.endLabel}
              </p>
              <h3 className="exp-card__role">{job.role}</h3>
              <p className="exp-card__company">
                <a href={job.companySite} target="_blank" rel="noreferrer">
                  {job.company}
                  <ArrowUpRight size={16} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <span className="exp-card__about"> · {job.companyAbout}</span>
              </p>
              <p className="exp-card__intro">{job.intro}</p>

              <ul className="exp-clients" aria-label={`Client work at ${job.company}`}>
                {job.clients.map((c) => (
                  <li key={c.client} className="exp-client">
                    <p className="exp-client__area mono">{c.area}</p>
                    <h4 className="exp-client__name">
                      <a href={c.site} target="_blank" rel="noreferrer">
                        {c.client}
                        <ArrowUpRight size={14} aria-hidden="true" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </h4>
                    <p className="exp-client__about">{c.about}</p>
                    <p className="exp-client__summary">{c.summary}</p>
                  </li>
                ))}
              </ul>

              <div className="exp-card__stack">
                <Badges items={job.stack} label={`Stack at ${job.company}`} />
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
