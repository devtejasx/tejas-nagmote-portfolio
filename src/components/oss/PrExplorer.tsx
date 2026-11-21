import { forwardRef } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { ArrowDown, ArrowUpRight, ChevronRight } from 'lucide-react'
import { pullUrl, type OpenSourceProject } from '../../data/openSource'
import {
  prDetails,
  prKey,
  prMatches as matches,
  type KindFilter,
  type PrKind,
} from '../../data/prDetails'

interface PrExplorerProps {
  projects: OpenSourceProject[]
  repo: string
  pr: number
  filter: KindFilter
  onSelectRepo: (repo: string) => void
  onSelectPr: (pr: number) => void
  onFilter: (filter: KindFilter) => void
}

const KINDS: PrKind[] = [
  'Concurrency',
  'Memory safety',
  'Undefined behaviour',
  'Correctness',
  'Build & CI',
  'Testing',
  'Feature',
  'Docs',
]

const kindClass = (kind: PrKind) => `kind kind--${kind.toLowerCase().replace(/[^a-z]+/g, '-')}`

const longDate = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })

/**
 * Project → pull request → problem → fix. Every level is a set of real
 * buttons, so the whole walk works by keyboard and on touch screens.
 */
export const PrExplorer = forwardRef<HTMLDivElement, PrExplorerProps>(function PrExplorer(
  { projects, repo, pr, filter, onSelectRepo, onSelectPr, onFilter },
  ref,
) {
  const all = projects.flatMap((p) => p.pullRequests.map((x) => ({ repo: p.repo, ...x })))
  const project = projects.find((p) => p.repo === repo) ?? projects[0]
  const visible = [...project.pullRequests]
    .filter((x) => matches(project.repo, x.number, filter))
    .sort((a, b) => b.mergedAt.localeCompare(a.mergedAt))
  const current = project.pullRequests.find((x) => x.number === pr) ?? visible[0]
  const detail = current ? prDetails[prKey(project.repo, current.number)] : undefined

  return (
    <div ref={ref} className="explorer card" tabIndex={-1} aria-label="Pull request explorer">
      <ol className="explorer__trail mono" aria-label="Current selection">
        <li>{project.name}</li>
        <li aria-hidden="true">
          <ChevronRight size={14} />
        </li>
        <li>{current ? `#${current.number}` : 'no PR'}</li>
        <li aria-hidden="true">
          <ChevronRight size={14} />
        </li>
        <li>problem</li>
        <li aria-hidden="true">
          <ChevronRight size={14} />
        </li>
        <li>fix</li>
      </ol>

      <div className="explorer__filters" role="group" aria-label="Filter by kind of fix">
        {(['All', ...KINDS] as KindFilter[]).map((k) => {
          const count = all.filter((x) => matches(x.repo, x.number, k)).length
          if (count === 0) return null
          return (
            <button
              key={k}
              type="button"
              className="explorer__filter"
              aria-pressed={filter === k}
              onClick={() => onFilter(k)}
            >
              {k} <span className="mono">{count}</span>
            </button>
          )
        })}
      </div>

      <div className="explorer__panes">
        <div className="explorer__pane explorer__projects">
          <h3 className="explorer__label mono">Project</h3>
          <ul>
            {projects.map((p) => {
              const n = p.pullRequests.filter((x) => matches(p.repo, x.number, filter)).length
              return (
                <li key={p.repo}>
                  <button
                    type="button"
                    className="explorer__project"
                    aria-pressed={p.repo === project.repo}
                    disabled={n === 0}
                    onClick={() => onSelectRepo(p.repo)}
                  >
                    <span className="explorer__project-name">{p.name}</span>
                    <span className="explorer__project-meta mono">
                      {p.language} · {n}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="explorer__pane explorer__prs">
          <h3 className="explorer__label mono">
            Pull requests <span className="explorer__count">({visible.length})</span>
          </h3>
          <ul>
            {visible.map((x) => {
              const kind = prDetails[prKey(project.repo, x.number)]?.kind
              return (
                <li key={x.number}>
                  <button
                    type="button"
                    className="explorer__pr"
                    aria-pressed={current?.number === x.number}
                    onClick={() => onSelectPr(x.number)}
                  >
                    <span className="explorer__pr-top mono">
                      #{x.number}
                      {kind && <span className={kindClass(kind)}>{kind}</span>}
                    </span>
                    <span className="explorer__pr-title">{x.title}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="explorer__pane explorer__detail" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {current && detail && (
              <m.article
                key={`${project.repo}#${current.number}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
              >
                <p className="explorer__detail-meta mono">
                  <span className={kindClass(detail.kind)}>{detail.kind}</span>
                  {project.repo}#{current.number} · merged {longDate(current.mergedAt)}
                </p>
                <h3 className="explorer__detail-title">{current.title}</h3>
                <div className="explorer__step">
                  <p className="explorer__step-label mono">Problem</p>
                  <p>{detail.problem}</p>
                </div>
                <ArrowDown className="explorer__arrow" size={18} aria-hidden="true" />
                <div className="explorer__step explorer__step--fix">
                  <p className="explorer__step-label mono">Fix</p>
                  <p>{detail.fix}</p>
                </div>
                <a
                  className="text-link explorer__link"
                  href={pullUrl(project.repo, current.number)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read the merged PR on GitHub
                  <ArrowUpRight size={14} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </m.article>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
})
