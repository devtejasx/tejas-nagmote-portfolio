import { useRef, useState } from 'react'
import { ArrowUpRight, Award, GitMerge, GitPullRequest } from 'lucide-react'
import { ContributionGraph, type MergeEvent } from '../components/oss/ContributionGraph'
import { PrExplorer } from '../components/oss/PrExplorer'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import {
  openSourceProjects,
  pullUrl,
  repoUrl,
  totalMergedPullRequests,
  type OpenSourceProject,
} from '../data/openSource'
import { prMatches, type KindFilter } from '../data/prDetails'
import { kornia } from '../data/recognition'
import './OpenSource.css'

const longDate = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })

const cppCount = openSourceProjects
  .filter((p) => p.language === 'C++')
  .reduce((n, p) => n + p.pullRequests.length, 0)

function KorniaSpotlight() {
  const pr = kornia.links.find((l) => l.href.endsWith(`/pull/${kornia.pullRequest}`))!
  const commit = kornia.links.find((l) => l.href.includes('/commit/'))!
  const xerj = kornia.links.filter((l) => l.kind === 'xerj')
  const files = kornia.stats.find((s) => s.icon === 'files')?.value
  const lines = kornia.stats.find((s) => s.icon === 'lines')?.value

  return (
    <article id="kornia" className="spotlight card" aria-labelledby="kornia-title">
      <div className="spotlight__main">
        <p className="spotlight__eyebrow mono">
          <GitMerge size={14} aria-hidden="true" />
          Featured contribution · {kornia.repo}
        </p>
        <h3 id="kornia-title" className="spotlight__title">
          {kornia.title}
        </h3>
        <p className="spotlight__meta">
          <span className="status status--ok">Merged {longDate(kornia.mergedAt)}</span>
          <span className="status">Breaking change</span>
          <span className="mono spotlight__pr">PR #{kornia.pullRequest}</span>
        </p>
        <p className="spotlight__about">{kornia.projectAbout}</p>
        <ul className="spotlight__points">
          {kornia.summary.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="spotlight__links">
          <a className="btn btn--sm" href={pr.href} target="_blank" rel="noopener noreferrer">
            <GitPullRequest size={15} aria-hidden="true" />
            {pr.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a
            className="btn btn--sm btn--ghost"
            href={commit.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {commit.label}
            <ArrowUpRight size={14} aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>

      <aside className="spotlight__recognition" aria-labelledby="xerj-title">
        <p className="spotlight__badge mono">
          <Award size={14} aria-hidden="true" />
          External recognition
        </p>
        <h4 id="xerj-title" className="spotlight__venue">
          Selected for the {kornia.venue.name}
        </h4>
        <p className="spotlight__venue-about">{kornia.venue.about}</p>
        <dl className="spotlight__facts">
          <div>
            <dt>Listed</dt>
            <dd>{longDate(kornia.selectedAt)}</dd>
          </div>
          <div>
            <dt>Commit</dt>
            <dd className="mono">{kornia.commit.slice(0, 7)}</dd>
          </div>
          {files !== undefined && lines !== undefined && (
            <div>
              <dt>Scope</dt>
              <dd>
                {files} files · {lines} lines
                <span className="spotlight__note">, as XERJ counts</span>
              </dd>
            </div>
          )}
        </dl>
        <ul className="spotlight__xerj-links">
          {xerj.map((l) => (
            <li key={l.href}>
              <a className="text-link" href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
                <ArrowUpRight size={13} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </article>
  )
}

function RepoCard({ project }: { project: OpenSourceProject }) {
  return (
    <article className="repo card">
      <header className="repo__head">
        <h4 className="repo__name">
          <a href={repoUrl(project.repo)} target="_blank" rel="noopener noreferrer">
            {project.name}
            <span className="sr-only"> repository (opens in a new tab)</span>
          </a>
        </h4>
        <span className="repo__count mono">{project.pullRequests.length} merged</span>
      </header>
      <p className="repo__meta mono">
        <span
          className={`lang-dot lang-dot--${project.language.replaceAll('+', 'p').toLowerCase()}`}
        />
        <span>
          {project.language} · {project.contributionType}
        </span>
      </p>
      <p className="repo__about">{project.about}</p>
      {project.highlights.length > 0 && (
        <ul className="repo__highlights">
          {project.highlights.map((h) => (
            <li key={h.pullRequest}>
              {h.text}{' '}
              <a
                className="repo__pr mono"
                href={pullUrl(project.repo, h.pullRequest)}
                target="_blank"
                rel="noopener noreferrer"
              >
                #{h.pullRequest}
                <span className="sr-only"> on GitHub (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export function OpenSource() {
  const [repo, setRepo] = useState('ng-log/ng-log')
  const [pr, setPr] = useState(37)
  const [filter, setFilter] = useState<KindFilter>('All')
  const explorer = useRef<HTMLDivElement>(null)

  const projectFor = (r: string) => openSourceProjects.find((p) => p.repo === r)
  const selectedDate = projectFor(repo)?.pullRequests.find((x) => x.number === pr)?.mergedAt

  const select = (r: string, n: number, reveal = false) => {
    setRepo(r)
    setPr(n)
    if (!prMatches(r, n, filter)) setFilter('All')
    if (reveal) {
      explorer.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      explorer.current?.focus({ preventScroll: true })
    }
  }

  const selectRepo = (r: string) => {
    const first = [...(projectFor(r)?.pullRequests ?? [])]
      .filter((x) => prMatches(r, x.number, filter))
      .sort((a, b) => b.mergedAt.localeCompare(a.mergedAt))[0]
    setRepo(r)
    if (first) setPr(first.number)
  }

  const applyFilter = (k: KindFilter) => {
    setFilter(k)
    const inRepo = projectFor(repo)?.pullRequests.some((x) => prMatches(repo, x.number, k))
    if (inRepo) {
      if (!prMatches(repo, pr, k)) selectRepo(repo)
      return
    }
    const next = openSourceProjects.find((p) =>
      p.pullRequests.some((x) => prMatches(p.repo, x.number, k)),
    )
    if (next) {
      const first = next.pullRequests.find((x) => prMatches(next.repo, x.number, k))
      setRepo(next.repo)
      if (first) setPr(first.number)
    }
  }

  const selectDay = (events: MergeEvent[]) => {
    const first = events[0]
    if (first) select(first.repo, first.number, true)
  }

  return (
    <section id="open-source" className="section section--divided oss" aria-labelledby="oss-title">
      <div className="container">
        <SectionHeading
          eyebrow="Open source"
          id="oss-title"
          title="Fixes merged into established codebases"
        >
          <p>
            <strong>
              {totalMergedPullRequests} merged pull requests across {openSourceProjects.length}{' '}
              external projects
            </strong>
            , each reviewed and merged by the project’s maintainers: concurrency, memory-safety and
            correctness fixes in C++ libraries such as ng-log and google/benchmark, plus Python,
            TypeScript and embedded C. {cppCount} of the {totalMergedPullRequests} are in C++.
          </p>
        </SectionHeading>

        <Reveal>
          <KorniaSpotlight />
        </Reveal>

        <h3 className="oss__subhead">By project</h3>
        <div className="oss__repos">
          {openSourceProjects.map((p) => (
            <RepoCard key={p.repo} project={p} />
          ))}
        </div>

        <h3 className="oss__subhead">Every merged pull request</h3>
        <p className="oss__subcopy">
          Pick a project, then a pull request, to see the problem it fixed and how. Days in the
          calendar open the PRs merged that day.
        </p>
        <div className="oss__calendar card">
          <ContributionGraph
            projects={openSourceProjects}
            selectedDate={selectedDate}
            onSelectDay={selectDay}
          />
        </div>
        <PrExplorer
          ref={explorer}
          projects={openSourceProjects}
          repo={repo}
          pr={pr}
          filter={filter}
          onSelectRepo={selectRepo}
          onSelectPr={setPr}
          onFilter={applyFilter}
        />
      </div>
    </section>
  )
}
