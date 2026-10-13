import { useRef, useState } from 'react'
import { m } from 'motion/react'
import { ArrowUpRight, GitPullRequest, SearchCode } from 'lucide-react'
import { revealViewport, staggerChildren } from '../animations/variants'
import { Counter } from '../components/Counter'
import { ContributionGraph, type MergeEvent } from '../components/oss/ContributionGraph'
import { PrExplorer } from '../components/oss/PrExplorer'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { TiltCard } from '../components/TiltCard'
import {
  openSourceProjects,
  pullUrl,
  repoUrl,
  totalMergedPullRequests,
  type OpenSourceProject,
} from '../data/openSource'
import { prMatches, type KindFilter } from '../data/prDetails'
import './OpenSource.css'

const featured = openSourceProjects.filter((p) => p.featured)
const maxCount = Math.max(...openSourceProjects.map((p) => p.pullRequests.length))

function Distribution() {
  return (
    <m.ul
      className="oss-bars"
      aria-label="Merged pull requests per project"
      variants={staggerChildren(0.08, 0.2)}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      {openSourceProjects.map((p) => (
        <li key={p.repo} className="oss-bars__row">
          <span className="oss-bars__name">{p.name}</span>
          <span className="oss-bars__track" aria-hidden="true">
            <m.span
              className="oss-bars__fill"
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
              }}
              style={{ width: `${(p.pullRequests.length / maxCount) * 100}%` }}
            />
          </span>
          <span className="oss-bars__count mono">{p.pullRequests.length}</span>
        </li>
      ))}
    </m.ul>
  )
}

function RepoHeader({ project }: { project: OpenSourceProject }) {
  return (
    <div className="repo-card__header">
      <div className="repo-card__title-row">
        <h3 className="repo-card__name">
          <a href={repoUrl(project.repo)} target="_blank" rel="noopener noreferrer">
            {project.name}
            <ArrowUpRight size={20} aria-hidden="true" />
            <span className="sr-only"> repository (opens in a new tab)</span>
          </a>
        </h3>
        <span className="repo-card__count">
          <GitPullRequest size={14} aria-hidden="true" />
          {project.pullRequests.length} merged
        </span>
      </div>
      <p className="repo-card__repo mono">{project.repo}</p>
      <div className="repo-card__tags">
        <span className="repo-card__lang">
          <span
            className={`lang-dot lang-dot--${project.language.replaceAll('+', 'p').toLowerCase()}`}
          />
          {project.language}
        </span>
        <span className="repo-card__type">{project.contributionType}</span>
      </div>
    </div>
  )
}

function FeaturedCard({
  project,
  onInspect,
}: {
  project: OpenSourceProject
  onInspect: (repo: string, pr: number) => void
}) {
  return (
    <TiltCard as="article" className="repo-card repo-card--featured glass" maxTilt={3}>
      <RepoHeader project={project} />
      <p className="repo-card__about">{project.about}</p>
      <ul className="repo-card__highlights">
        {project.highlights.map((h) => (
          <li key={h.pullRequest}>
            <p>{h.text}</p>
            <div className="repo-card__highlight-actions">
              <button
                type="button"
                className="repo-card__inspect"
                onClick={() => onInspect(project.repo, h.pullRequest)}
              >
                <SearchCode size={15} aria-hidden="true" />
                Problem → fix
              </button>
              <a
                href={pullUrl(project.repo, h.pullRequest)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link mono"
              >
                PR #{h.pullRequest}
                <ArrowUpRight size={14} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </TiltCard>
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
      const keep = prMatches(repo, pr, k)
      if (!keep) selectRepo(repo)
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
    <section id="open-source" className="section oss" aria-labelledby="oss-title">
      <div className="oss__glow" aria-hidden="true" />
      <div className="container">
        <SectionHeading
          index="02"
          eyebrow="Open Source"
          id="oss-title"
          title="Open Source Engineering"
        >
          <p>
            <strong className="oss__claim">
              37 merged pull requests across 8 upstream open-source projects
            </strong>{' '}
            maintained by external organizations, fixing concurrency, memory-safety and correctness
            bugs through maintainer code review. 26 of the 37 are in C++ codebases.
          </p>
        </SectionHeading>

        <Reveal className="oss-summary glass">
          <div className="oss-summary__headline">
            <Counter
              value={totalMergedPullRequests}
              className="oss-summary__number gradient-text"
            />
            <div>
              <p className="oss-summary__label">merged pull requests</p>
              <p className="oss-summary__sub">
                across <strong>{openSourceProjects.length}</strong> external open-source projects
              </p>
            </div>
          </div>
          <Distribution />
          <ContributionGraph
            projects={openSourceProjects}
            selectedDate={selectedDate}
            onSelectDay={selectDay}
          />
        </Reveal>

        <div className="oss__featured">
          {featured.map((p, i) => (
            <Reveal key={p.repo} delay={i * 0.1} className="oss__cell">
              <FeaturedCard project={p} onInspect={(r, n) => select(r, n, true)} />
            </Reveal>
          ))}
        </div>

        <Reveal className="oss__explorer">
          <h3 className="oss__explorer-title">
            Every merged PR: <span className="gradient-text">project → PR → problem → fix</span>
          </h3>
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
        </Reveal>
      </div>
    </section>
  )
}
