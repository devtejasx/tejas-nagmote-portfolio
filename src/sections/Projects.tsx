import { useId, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { ArchitectureDiagram } from '../components/ArchitectureDiagram'
import { Badges } from '../components/Badges'
import { GitHubIcon } from '../components/BrandIcon'
import { ButtonLink } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { projects, type Project } from '../data/projects'
import './Projects.css'

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const detailsId = useId()
  const titleId = useId()

  return (
    <article className="project glass">
      <div className="project__info">
        <div className="project__meta">
          <span className="project__index mono">{String(index + 1).padStart(2, '0')}</span>
          {project.status && <span className="status-pill">{project.status}</span>}
        </div>

        <h3 id={titleId} className="project__title">
          {project.title}
        </h3>
        <p className="project__tagline">{project.tagline}</p>
        <p className="project__summary">{project.summary}</p>

        <Badges items={project.tech} label={`${project.title} technologies`} />

        <div className="project__actions">
          <button
            type="button"
            className="btn btn--secondary"
            aria-expanded={expanded}
            aria-controls={detailsId}
            onClick={() => setExpanded((e) => !e)}
          >
            <span>{expanded ? 'Hide details' : 'Show details'}</span>
            <ChevronDown size={16} aria-hidden="true" className="project__chevron" />
          </button>
          <ButtonLink href={project.repo} external variant="ghost" icon={<GitHubIcon size={18} />}>
            Source
          </ButtonLink>
          {project.live && (
            <ButtonLink
              href={project.live}
              external
              variant="ghost"
              icon={<ArrowUpRight size={18} aria-hidden="true" />}
            >
              Live demo
            </ButtonLink>
          )}
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <m.div
              id={detailsId}
              key="details"
              className="project__details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="project__details-inner">
                <ul className="project__bullets">
                  {project.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <h4 className="project__features-title mono">Highlights</h4>
                <Badges
                  items={project.features}
                  label={`${project.title} highlights`}
                  variant="feature"
                />
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <div className="project__diagram">
        <ArchitectureDiagram diagram={project.diagram} />
      </div>
    </article>
  )
}

export function Projects() {
  return (
    <section id="projects" className="section projects" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeading
          index="04"
          eyebrow="Projects"
          id="projects-title"
          title="Things I've built."
        >
          <p>
            Backends, platforms and full-stack apps, each shown with the architecture behind it.
            Hover or tap a component to see what it does.
          </p>
        </SectionHeading>

        <ul className="projects__list">
          {projects.map((project, i) => (
            <Reveal key={project.id} as="li">
              <ProjectCard project={project} index={i} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
