import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { skillCategories } from '../data/skills'
import './Skills.css'

export function Skills() {
  return (
    <section id="skills" className="section section--divided" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading eyebrow="Skills" id="skills-title" title="Technical skills">
          <p>
            Grouped by area, with where each one is used. No ratings or percentages: the projects
            and merged pull requests above are the evidence.
          </p>
        </SectionHeading>

        <div className="skills">
          {skillCategories.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.04} className="skills__cell">
              <section className="skill-card card" aria-labelledby={`skills-${c.id}`}>
                <h3 id={`skills-${c.id}`} className="skill-card__title">
                  {c.title}
                </h3>
                <ul className="skill-card__list">
                  {c.skills.map((s) => (
                    <li key={s.name} className="skill">
                      <span className="skill__name">{s.name}</span>
                      {s.evidence && (
                        <span className="skill__evidence">
                          <span className="sr-only">Used in: </span>
                          {s.evidence.join(' · ')}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
