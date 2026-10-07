import { useId, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { ChevronDown, GitMerge } from 'lucide-react'
import { pullUrl } from '../data/openSource'
import type { MergedPullRequest } from '../data/pullRequests'

interface PullRequestListProps {
  repo: string
  pullRequests: MergedPullRequest[]
  /** Lists at or under this length are shown open, with no toggle. */
  collapseAfter?: number
}

const dateFormat = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})
const formatDate = (iso: string) => dateFormat.format(new Date(`${iso}T00:00:00`))

function Items({ repo, pullRequests }: Omit<PullRequestListProps, 'collapseAfter'>) {
  return (
    <ul className="pr-list">
      {pullRequests.map((pr) => (
        <li key={pr.number}>
          <a
            href={pullUrl(repo, pr.number)}
            target="_blank"
            rel="noopener noreferrer"
            className="pr-item"
          >
            <GitMerge size={15} aria-hidden="true" className="pr-item__icon" />
            <span className="pr-item__title">{pr.title}</span>
            <span className="pr-item__meta mono">
              #{pr.number} · <time dateTime={pr.mergedAt}>{formatDate(pr.mergedAt)}</time>
            </span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export function PullRequestList({ repo, pullRequests, collapseAfter = 1 }: PullRequestListProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const sorted = [...pullRequests].sort((a, b) => b.mergedAt.localeCompare(a.mergedAt))

  if (sorted.length <= collapseAfter) return <Items repo={repo} pullRequests={sorted} />

  return (
    <div className="pr-disclosure">
      <button
        type="button"
        className="pr-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <span>
          {open ? 'Hide' : 'Show'} all {sorted.length} merged PRs
        </span>
        <ChevronDown size={16} aria-hidden="true" className="pr-toggle__chevron" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={panelId}
            key="panel"
            className="pr-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Items repo={repo} pullRequests={sorted} />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
