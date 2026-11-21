import { ArrowLeft, ArrowRight, ArrowUpRight, FileText } from 'lucide-react'
import { ArchitectureView } from '../components/ArchitectureView'
import { Badges } from '../components/Badges'
import { GitHubIcon } from '../components/BrandIcon'
import { Reveal } from '../components/Reveal'
import { Guard, Shell } from '../components/Shell'
import { caseStudies, type CaseStudy } from '../data/caseStudies'
import { caseStudyProjects, projectById, type Project } from '../data/projects'
import './CaseStudyPage.css'

const ROOT = '../../'

const sourceUrl = (repo: string, path: string) =>
  `${repo}/${/\.[a-z]+$/i.test(path) ? 'blob' : 'tree'}/main/${path}`

function sectionsFor(study: CaseStudy, project: Project) {
  return [
    { id: 'overview', label: 'Overview', show: true },
    { id: 'problem', label: 'Problem', show: true },
    { id: 'architecture', label: 'Architecture', show: !!project.diagram },
    { id: 'decisions', label: 'Design decisions', show: true },
    { id: 'challenges', label: 'Challenges', show: true },
    { id: 'testing', label: 'Testing', show: true },
    { id: 'performance', label: 'Performance', show: !!study.performance },
    { id: 'limits', label: 'Limitations', show: study.limitations.length > 0 },
  ].filter((s) => s.show)
}

function NotFound() {
  return (
    <section className="cs-page container">
      <h1 className="cs-page__title">Case study not found</h1>
      <p className="muted">
        <a className="text-link" href={`${ROOT}#projects`}>
          Back to all projects
        </a>
      </p>
    </section>
  )
}

function Body({ project, study }: { project: Project; study: CaseStudy }) {
  const toc = sectionsFor(study, project)
  const index = caseStudyProjects.findIndex((p) => p.id === project.id)
  const next = caseStudyProjects[(index + 1) % caseStudyProjects.length]
  const tone = project.status.tone === 'neutral' ? '' : ` status--${project.status.tone}`

  return (
    <article className="cs-page" aria-labelledby="cs-title">
      <header className="cs-hero">
        <div className="grid-backdrop" aria-hidden="true" />
        <div className="container">
          <a className="cs-hero__back" href={`${ROOT}#projects`}>
            <ArrowLeft size={15} aria-hidden="true" />
            All projects
          </a>
          <p className="cs-hero__meta">
            <span className="eyebrow">Case study</span>
            <span className={`status${tone}`}>{project.status.label}</span>
          </p>
          <h1 id="cs-title" className="cs-hero__title">
            {project.title}
          </h1>
          <p className="cs-hero__tagline">{project.tagline}</p>
          <p className="cs-hero__summary">{project.summary}</p>
          <div className="cs-hero__actions">
            <a
              className="btn btn--primary"
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon size={16} />
              View the code
              <span className="sr-only"> on GitHub (opens in a new tab)</span>
            </a>
            {project.live && (
              <a className="btn" href={project.live} target="_blank" rel="noopener noreferrer">
                <ArrowUpRight size={16} aria-hidden="true" />
                Live demo
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
          <Badges items={project.tech} label={`${project.title} technologies`} />
          <dl className="facts cs-hero__facts">
            {study.facts.map((f) => (
              <div key={f.label} className="fact">
                <dt className="fact__label">{f.label}</dt>
                <dd className="fact__value">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="container cs-layout">
        <nav className="cs-toc" aria-label="On this page">
          <p className="cs-toc__title mono">On this page</p>
          <ol>
            {toc.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="cs-content">
          <section id="overview" className="cs-section" aria-labelledby="overview-h">
            <h2 id="overview-h">Overview</h2>
            {study.overview.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          <section id="problem" className="cs-section" aria-labelledby="problem-h">
            <h2 id="problem-h">The problem</h2>
            {study.problem.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          {project.diagram && (
            <section id="architecture" className="cs-section" aria-labelledby="architecture-h">
              <h2 id="architecture-h">Architecture</h2>
              <p>Select a component to see what it does and how it connects to the others.</p>
              <div className="cs-diagram card">
                <Guard name="architecture">
                  <ArchitectureView diagram={project.diagram} />
                </Guard>
              </div>
            </section>
          )}

          <section id="decisions" className="cs-section" aria-labelledby="decisions-h">
            <h2 id="decisions-h">Design decisions</h2>
            <ol className="decisions">
              {study.decisions.map((d, i) => (
                <Reveal as="li" key={d.title} className="decision card">
                  <span className="decision__n mono" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="decision__body">
                    <h3>{d.title}</h3>
                    <p>{d.why}</p>
                    {d.rejected && (
                      <p className="decision__rejected">
                        <span className="mono">Rejected</span> {d.rejected}
                      </p>
                    )}
                  </div>
                </Reveal>
              ))}
            </ol>
          </section>

          <section id="challenges" className="cs-section" aria-labelledby="challenges-h">
            <h2 id="challenges-h">Challenges and how they were solved</h2>
            <ul className="challenges">
              {study.challenges.map((c) => (
                <li key={c.challenge} className="challenge">
                  <h3 className="challenge__q">{c.challenge}</h3>
                  <p className="challenge__a">{c.solution}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="testing" className="cs-section" aria-labelledby="testing-h">
            <h2 id="testing-h">Testing strategy</h2>
            <p>{study.testing.summary}</p>
            <dl className="layers">
              {study.testing.layers.map((l) => (
                <div key={l.label} className="layer card">
                  <dt className="mono">{l.label}</dt>
                  <dd>{l.detail}</dd>
                </div>
              ))}
            </dl>
          </section>

          {study.performance && (
            <section id="performance" className="cs-section" aria-labelledby="performance-h">
              <h2 id="performance-h">Performance measurements</h2>
              <p className="cs-conditions">
                <strong>Conditions.</strong> {study.performance.conditions}
              </p>
              <dl className="facts">
                {study.performance.metrics.map((m) => (
                  <div key={m.label} className="fact">
                    <dt className="fact__label">{m.label}</dt>
                    <dd className="fact__value">{m.value}</dd>
                  </div>
                ))}
              </dl>
              <p>{study.performance.takeaway}</p>
            </section>
          )}

          {study.limitations.length > 0 && (
            <section id="limits" className="cs-section" aria-labelledby="limits-h">
              <h2 id="limits-h">Limitations and what is not done</h2>
              <ul className="cs-list">
                {study.limitations.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="cs-section cs-sources" aria-labelledby="sources-h">
            <h2 id="sources-h">Sources in the repository</h2>
            <ul>
              {study.sources.map((s) => (
                <li key={s.path}>
                  <a
                    className="text-link"
                    href={sourceUrl(project.repo, s.path)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText size={14} aria-hidden="true" />
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <span className="mono cs-sources__path">{s.path}</span>
                </li>
              ))}
            </ul>
          </section>

          {next.id !== project.id && (
            <a className="cs-next card" href={`${ROOT}projects/${next.id}/`}>
              <span className="mono cs-next__label">Next case study</span>
              <span className="cs-next__title">
                {next.title}
                <ArrowRight size={18} aria-hidden="true" />
              </span>
              <span className="cs-next__tagline">{next.tagline}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export function CaseStudyPage({ id }: { id: string }) {
  const study = caseStudies.find((c) => c.projectId === id)
  const project = study ? projectById(id) : undefined
  return (
    <Shell root={ROOT}>
      {project && study ? <Body project={project} study={study} /> : <NotFound />}
    </Shell>
  )
}
