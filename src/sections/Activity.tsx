import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { GitHubIcon } from '../components/BrandIcon'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { useGitHubActivity, type LiveMerge } from '../hooks/useGitHubActivity'
import { openSourceProjects, pullUrl } from '../data/openSource'
import { getLink, profile } from '../data/profile'
import './Activity.css'

const trackedRepos = openSourceProjects.map((p) => p.repo)
const nameFor = (repo: string) =>
  openSourceProjects.find((p) => p.repo.toLowerCase() === repo.toLowerCase())?.name ?? repo

const allMerges = openSourceProjects.flatMap((p) =>
  p.pullRequests.map((pr) => ({ repo: p.repo, ...pr })),
)

/** Merged PRs per calendar month, from the verified list in pullRequests.ts. */
const byMonth = (() => {
  const counts = new Map<string, number>()
  for (const m of allMerges) {
    const key = m.mergedAt.slice(0, 7)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  const keys = [...counts.keys()].sort()
  const months: { key: string; label: string; count: number }[] = []
  const [y0, m0] = keys[0].split('-').map(Number)
  const [y1, m1] = keys[keys.length - 1].split('-').map(Number)
  for (let y = y0, m = m0; y < y1 || (y === y1 && m <= m1); m === 12 ? (y++, (m = 1)) : m++) {
    const key = `${y}-${String(m).padStart(2, '0')}`
    months.push({
      key,
      label: new Date(Date.UTC(y, m - 1, 1)).toLocaleString('en', {
        month: 'short',
        timeZone: 'UTC',
      }),
      count: counts.get(key) ?? 0,
    })
  }
  return months
})()
const maxMonth = Math.max(...byMonth.map((m) => m.count))

const savedLatest: LiveMerge[] = [...allMerges]
  .sort((a, b) => b.mergedAt.localeCompare(a.mergedAt))
  .slice(0, 6)
  .map((m) => ({ ...m, url: pullUrl(m.repo, m.number) }))

const shortDate = (iso: string) =>
  new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso).toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })

const github = getLink('github')

export function Activity() {
  const sectionRef = useRef<HTMLElement>(null)
  const [near, setNear] = useState(false)

  // Ask GitHub only when the section is about to scroll into view.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: '600px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const live = useGitHubActivity(profile.githubUser, trackedRepos, near)
  const merges = live.status === 'ready' && live.merges.length > 0 ? live.merges : savedLatest
  const isLive = live.status === 'ready' && live.merges.length > 0

  return (
    <section
      ref={sectionRef}
      id="activity"
      className="section section--divided"
      aria-labelledby="activity-title"
    >
      <div className="container">
        <SectionHeading eyebrow="Engineering activity" id="activity-title" title="Recent activity">
          <p>
            Monthly merge counts come from the verified pull-request list on this site. The latest
            merges and profile figures load live from the public GitHub API, with the saved list
            shown if it cannot be reached.
          </p>
        </SectionHeading>

        <div className="activity">
          <Reveal className="activity__cell">
            <figure className="act-card card">
              <figcaption className="act-card__head">
                <h3 className="act-card__title">Merged pull requests per month</h3>
                <p className="act-card__note mono">external projects · {allMerges.length} total</p>
              </figcaption>
              <ol className="bars" aria-label="Merged pull requests per month">
                {byMonth.map((m) => (
                  <li key={m.key} className="bars__col">
                    <span className="bars__value mono">{m.count}</span>
                    <span className="bars__track" aria-hidden="true">
                      <span
                        className="bars__fill"
                        style={{ height: `${(m.count / maxMonth) * 100}%` }}
                      />
                    </span>
                    <span className="bars__label mono">
                      {m.label}
                      <span className="sr-only"> {m.key.slice(0, 4)}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </figure>
          </Reveal>

          <Reveal className="activity__cell" delay={0.05}>
            <section className="act-card card" aria-labelledby="latest-title">
              <div className="act-card__head">
                <h3 id="latest-title" className="act-card__title">
                  Latest merged pull requests
                </h3>
                <p className={`act-card__source mono${isLive ? ' is-live' : ''}`} role="status">
                  {live.status === 'loading'
                    ? 'Checking GitHub…'
                    : isLive
                      ? 'Live from GitHub'
                      : 'Saved list · GitHub unavailable'}
                </p>
              </div>
              <ul className="latest">
                {merges.map((m) => (
                  <li key={`${m.repo}#${m.number}`}>
                    <a
                      className="latest__item"
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="latest__top mono">
                        {nameFor(m.repo)} #{m.number}
                        <time dateTime={m.mergedAt.slice(0, 10)}>{shortDate(m.mergedAt)}</time>
                      </span>
                      <span className="latest__title">{m.title}</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal className="activity__cell" delay={0.1}>
            <section className="act-card card act-card--profile" aria-labelledby="profile-title">
              <div className="act-card__head">
                <h3 id="profile-title" className="act-card__title">
                  GitHub profile
                </h3>
                <p className="act-card__note mono">@{profile.githubUser}</p>
              </div>
              {live.status === 'ready' ? (
                <dl className="gh-stats">
                  <div>
                    <dt>Public repositories</dt>
                    <dd>{live.profile.publicRepos}</dd>
                  </div>
                  <div>
                    <dt>Followers</dt>
                    <dd>{live.profile.followers}</dd>
                  </div>
                  <div>
                    <dt>On GitHub since</dt>
                    <dd>{new Date(live.profile.since).getUTCFullYear()}</dd>
                  </div>
                </dl>
              ) : (
                <p className="act-card__fallback">
                  {live.status === 'loading'
                    ? 'Loading profile figures…'
                    : 'Profile figures could not be loaded right now.'}
                </p>
              )}
              <a
                className="btn btn--sm"
                href={github.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon size={15} />
                Open GitHub profile
                <ArrowUpRight size={14} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </section>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
