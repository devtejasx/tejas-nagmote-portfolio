import { useState } from 'react'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { Badges } from '../components/Badges'
import { GitHubIcon } from '../components/BrandIcon'
import { DiagramThumb } from '../components/DiagramThumb'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import {
  caseStudyPath,
  caseStudyProjects,
  otherProjects,
  projectAreas,
  type Project,
  type ProjectArea,
} from '../data/projects'
import './Projects.css'

type Filter = 'All' | ProjectArea

function StatusPill({ project }: { project: Project }) {
  const tone = project.status.tone === 'neutral' ? '' : ` status--${project.status.tone}`
  return <span className={`status${tone}`}>{project.status.label}</span>
}

function RepoLinks({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <>
      <a
        className={`btn btn--ghost${compact ? ' btn--sm' : ''}`}
        href={project.repo}
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHubIcon size={15} />
        Code
        <span className="sr-only"> for {project.title} on GitHub (opens in a new tab)</span>
      </a>
      {project.live && (
        <a
          className={`btn btn--ghost${compact ? ' btn--sm' : ''}`}
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ArrowUpRight size={15} aria-hidden="true" />
          Live demo
          <span className="sr-only"> of {project.title} (opens in a new tab)</span>
        </a>
      )}
    </>
  )
}

function CaseStudyCard({ project }: { project: Project }) {
  const href = caseStudyPath(project.id)
  return (
    <article className="cs-card card" aria-labelledby={`${project.id}-title`}>
      <div className="cs-card__body">
        <div className="cs-card__top">
          <StatusPill project={project} />
          <span className="cs-card__kind mono">Case study</span>
        </div>
        <h3 id={`${project.id}-title`} className="cs-card__title">
          <a href={href}>{project.title}</a>
        </h3>
        <p className="cs-card__tagline">{project.tagline}</p>
        <p className="cs-card__summary">{project.summary}</p>
        <ul className="cs-card__highlights">
          {project.highlights.map((h) => (
            <li key={h}>
              <Check size={15} aria-hidden="true" />
              {h}
            </li>
          ))}
        </ul>
        <Badges items={project.tech} label={`${project.title} technologies`} />
        <div className="cs-card__actions">
          <a className="btn btn--primary" href={href}>
            Read the case study
            <ArrowRight size={15} aria-hidden="true" />
            <span className="sr-only">: {project.title}</span>
          </a>
          <RepoLinks project={project} />
        </div>
      </div>
      {project.diagram && (
        <a className="cs-card__visual" href={href} tabIndex={-1} aria-hidden="true">
          <DiagramThumb diagram={project.diagram} />
        </a>
      )}
    </article>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="p-card card" aria-labelledby={`${project.id}-title`}>
      <div className="p-card__top">
        <span className="p-card__kind mono">
          {project.kind === 'lab' ? 'Course lab' : 'Project'}
        </span>
        <StatusPill project={project} />
      </div>
      <h3 id={`${project.id}-title`} className="p-card__title">
        {project.title}
      </h3>
      <p className="p-card__tagline">{project.tagline}</p>
      <p className="p-card__summary">{project.summary}</p>
      <Badges items={project.tech} label={`${project.title} technologies`} />
      <div className="p-card__actions">
        <RepoLinks project={project} compact />
      </div>
    </article>
  )
}

export function Projects() {
  const [filter, setFilter] = useState<Filter>('All')
  const matches = (p: Project) => filter === 'All' || p.areas.includes(filter)
  const studies = caseStudyProjects.filter(matches)
  const others = otherProjects.filter(matches)

  return (
    <section id="projects" className="section projects" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeading eyebrow="Projects" id="projects-title" title="Selected engineering work">
          <p>
            Three projects written up as case studies: the problem, the architecture, the decisions
            and their trade-offs, and what the tests and measurements show. Every figure comes from
            the project’s own test runs and reports.
          </p>
        </SectionHeading>

        <div className="projects__filters" role="group" aria-label="Filter projects by area">
          {(['All', ...projectAreas] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              className="filter-chip"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          Showing {studies.length + others.length} projects
          {filter === 'All' ? '' : ` in ${filter}`}.
        </p>

        <div className="projects__studies">
          {studies.map((p) => (
            <Reveal key={p.id}>
              <CaseStudyCard project={p} />
            </Reveal>
          ))}
        </div>

        {others.length > 0 && (
          <>
            <h3 className="projects__more-title">More projects</h3>
            <div className="projects__grid">
              {others.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
