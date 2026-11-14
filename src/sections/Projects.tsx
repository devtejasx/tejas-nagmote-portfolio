import { useId, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { ArrowUpRight, ChevronDown, Star } from 'lucide-react'
import { ArchitectureView } from '../components/ArchitectureView'
import { Badges } from '../components/Badges'
import { GitHubIcon } from '../components/BrandIcon'
import { ButtonLink } from '../components/Button'
import { DeployPipeline } from '../components/DeployPipeline'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { TiltCard } from '../components/TiltCard'
import { projectById, projects, type Project } from '../data/projects'
import './Projects.css'

function SourceLink({ project }: { project: Project }) {
  return (
    <ButtonLink href={project.repo} external icon={<GitHubIcon size={18} />}>
      GitHub
    </ButtonLink>
  )
}

/** The resume bullets, behind a "Project details" disclosure. */
function Details({ project }: { project: Project }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <>
      <button
        type="button"
        className="btn btn--secondary"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{open ? 'Hide details' : 'Project details'}</span>
        <ChevronDown size={16} aria-hidden="true" className="project__chevron" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={id}
            key="details"
            className="project__details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="project__bullets">
              {project.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Featured({ project }: { project: Project }) {
  return (
    <article id={`project-${project.id}`} className="project project--featured glass">
      <div className="project__head">
        <div className="project__intro">
          <p className="project__flag mono">
            <Star size={14} aria-hidden="true" /> Featured project
          </p>
          <h3 className="project__title">{project.title}</h3>
          <p className="project__tagline">{project.tagline}</p>
          <p className="project__summary">{project.summary}</p>
          <Badges items={project.tech} label={`${project.title} technologies`} />
          <div className="project__actions">
            <SourceLink project={project} />
            <Details project={project} />
          </div>
        </div>
        <p className="project__tests">
          <span className="project__tests-value gradient-text">413</span>
          <span className="project__tests-label">GoogleTest tests in GitHub Actions CI</span>
        </p>
      </div>

      {project.diagram && (
        <div className="project__architecture">
          <h4 className="project__subhead mono">Architecture</h4>
          <ArchitectureView diagram={project.diagram} />
        </div>
      )}

      <div className="project__lists">
        <div>
          <h4 className="project__subhead mono">What it does</h4>
          <Badges items={project.capabilities ?? []} label="Capabilities" variant="feature" />
        </div>
        <div>
          <h4 className="project__subhead mono">How it is built</h4>
          <ul className="project__checks">
            {(project.engineering ?? []).map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}

function DeployX({ project }: { project: Project }) {
  return (
    <article id={`project-${project.id}`} className="project project--major glass">
      <div className="project__intro">
        <div className="project__meta">
          <span className="status-pill">{project.status}</span>
        </div>
        <h3 className="project__title">
          {project.title} <span className="project__title-sub">— {project.tagline}</span>
        </h3>
        <p className="project__summary">{project.summary}</p>
        <Badges items={project.tech} label={`${project.title} technologies`} />
        <div className="project__actions">
          <SourceLink project={project} />
          <Details project={project} />
        </div>
      </div>

      <div className="project__pipeline">
        <h4 className="project__subhead mono">Deployment pipeline</h4>
        <DeployPipeline />
      </div>

      <div>
        <h4 className="project__subhead mono">Being built</h4>
        <ul className="project__checks project__checks--cols">
          {(project.engineering ?? []).map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function Supporting({ project }: { project: Project }) {
  return (
    <TiltCard as="article" className="project project--supporting glass" maxTilt={2}>
      <div id={`project-${project.id}`} className="project__intro">
        <h3 className="project__title project__title--sm">{project.title}</h3>
        <p className="project__tagline">{project.tagline}</p>
        <p className="project__summary">{project.summary}</p>
        <Badges items={project.tech} label={`${project.title} technologies`} />
        <div className="project__actions">
          <SourceLink project={project} />
        </div>
      </div>
      <ol className="story">
        {(project.story ?? []).map((step, i) => (
          <li key={step.label} className="story__step">
            <span className="story__index mono" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="story__label mono">{step.label}</p>
            <p className="story__text">{step.text}</p>
          </li>
        ))}
      </ol>
    </TiltCard>
  )
}

function Compact({ project }: { project: Project }) {
  return (
    <TiltCard as="article" className="project project--compact glass" maxTilt={4}>
      <h4 className="project__title project__title--xs">{project.title}</h4>
      <p className="project__tagline">{project.tagline}</p>
      <p className="project__summary">{project.summary}</p>
      <Badges items={project.tech} label={`${project.title} technologies`} />
      <div className="project__actions">
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
    </TiltCard>
  )
}

export function Projects() {
  const more = projects.filter((p) => p.tier === 'more')
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
            A distributed C++ backend, a deployment platform in progress, and the testing setup
            behind them. Select any component to see how it works.
          </p>
        </SectionHeading>

        <div className="projects__stack">
          <Reveal>
            <Featured project={projectById('realtime-chat')} />
          </Reveal>
          <Reveal>
            <DeployX project={projectById('deployx')} />
          </Reveal>
          <Reveal>
            <Supporting project={projectById('api-testing')} />
          </Reveal>
          {more.length > 0 && (
            <Reveal className="projects__more">
              <h3 className="projects__more-title">More projects</h3>
              <div className="projects__more-grid">
                {more.map((p) => (
                  <Compact key={p.id} project={p} />
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
