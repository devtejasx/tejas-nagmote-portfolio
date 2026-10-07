import { motion } from 'motion/react'
import { ArrowUpRight, GitPullRequest } from 'lucide-react'
import { fadeUp, revealViewport, staggerChildren } from '../animations/variants'
import { Counter } from '../components/Counter'
import { PullRequestList } from '../components/PullRequestList'
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
import './OpenSource.css'

const featured = openSourceProjects.filter((p) => p.featured)
const others = openSourceProjects.filter((p) => !p.featured)
const maxCount = Math.max(...openSourceProjects.map((p) => p.pullRequests.length))

/* Every merge date, for the timeline strip. */
const allMerges = openSourceProjects
  .flatMap((p) => p.pullRequests.map((pr) => ({ ...pr, project: p.name })))
  .sort((a, b) => a.mergedAt.localeCompare(b.mergedAt))
const DAY = 86_400_000
const firstDay = Date.parse(allMerges[0].mergedAt)
const lastDay = Date.parse(allMerges[allMerges.length - 1].mergedAt)
const span = Math.max(lastDay - firstDay, DAY)
const formatDay = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })

function timelineDots() {
  const perDay = new Map<string, number>()
  return allMerges.map((m) => {
    const stack = perDay.get(m.mergedAt) ?? 0
    perDay.set(m.mergedAt, stack + 1)
    return { ...m, x: ((Date.parse(m.mergedAt) - firstDay) / span) * 100, stack }
  })
}

function monthTicks() {
  const ticks: { label: string; x: number }[] = []
  const d = new Date(firstDay)
  d.setUTCDate(1)
  d.setUTCMonth(d.getUTCMonth() + 1)
  while (d.getTime() <= lastDay) {
    ticks.push({
      label: d.toLocaleString('en', { month: 'short', timeZone: 'UTC' }),
      x: ((d.getTime() - firstDay) / span) * 100,
    })
    d.setUTCMonth(d.getUTCMonth() + 1)
  }
  return ticks
}

function Distribution() {
  return (
    <motion.ul
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
            <motion.span
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
    </motion.ul>
  )
}

function Timeline() {
  const dots = timelineDots()
  return (
    <figure className="oss-timeline">
      <figcaption className="oss-timeline__caption mono">
        Merge dates · {formatDay(allMerges[0].mergedAt)} →{' '}
        {formatDay(allMerges[allMerges.length - 1].mergedAt)}
      </figcaption>
      <div className="oss-timeline__track" aria-hidden="true">
        {monthTicks().map((t) => (
          <span key={t.label} className="oss-timeline__tick mono" style={{ left: `${t.x}%` }}>
            {t.label}
          </span>
        ))}
        {dots.map((d) => (
          <span
            key={`${d.project}-${d.number}`}
            className="oss-timeline__dot"
            style={{ left: `${d.x}%`, bottom: `${10 + d.stack * 12}px` }}
            data-tip={`${d.project} #${d.number}`}
          />
        ))}
      </div>
    </figure>
  )
}

function RepoHeader({ project, size }: { project: OpenSourceProject; size: 'lg' | 'sm' }) {
  const count = project.pullRequests.length
  return (
    <div className={`repo-card__header repo-card__header--${size}`}>
      <div className="repo-card__title-row">
        <h3 className="repo-card__name">
          <a href={repoUrl(project.repo)} target="_blank" rel="noopener noreferrer">
            {project.name}
            <ArrowUpRight size={size === 'lg' ? 20 : 16} aria-hidden="true" />
            <span className="sr-only"> repository (opens in a new tab)</span>
          </a>
        </h3>
        <span className="repo-card__count">
          <GitPullRequest size={14} aria-hidden="true" />
          {count} merged
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

function FeaturedCard({ project }: { project: OpenSourceProject }) {
  return (
    <TiltCard as="article" className="repo-card repo-card--featured glass" maxTilt={3}>
      <RepoHeader project={project} size="lg" />
      <p className="repo-card__about">{project.about}</p>
      <ul className="repo-card__highlights">
        {project.highlights.map((h) => (
          <li key={h.pullRequest}>
            <p>{h.text}</p>
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
          </li>
        ))}
      </ul>
      <PullRequestList repo={project.repo} pullRequests={project.pullRequests} />
    </TiltCard>
  )
}

function CompactCard({ project }: { project: OpenSourceProject }) {
  return (
    <TiltCard as="article" className="repo-card glass" maxTilt={4}>
      <RepoHeader project={project} size="sm" />
      <p className="repo-card__about">{project.about}</p>
      <PullRequestList repo={project.repo} pullRequests={project.pullRequests} collapseAfter={1} />
    </TiltCard>
  )
}

export function OpenSource() {
  return (
    <section id="open-source" className="section oss" aria-labelledby="oss-title">
      <div className="oss__glow" aria-hidden="true" />
      <div className="container">
        <SectionHeading
          index="03"
          eyebrow="Open Source"
          id="oss-title"
          title="Open Source Engineering"
        >
          <p>
            Pull requests to upstream projects maintained by external organizations, fixing
            concurrency, memory-safety, and correctness bugs through maintainer code review.
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
          <Timeline />
        </Reveal>

        <div className="oss__featured">
          {featured.map((p, i) => (
            <Reveal key={p.repo} delay={i * 0.1} className="oss__cell">
              <FeaturedCard project={p} />
            </Reveal>
          ))}
        </div>

        <motion.div
          className="oss__others"
          variants={staggerChildren(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {others.map((p) => (
            <motion.div key={p.repo} variants={fadeUp} className="oss__cell">
              <CompactCard project={p} />
            </motion.div>
          ))}
        </motion.div>

        <p className="oss__footnote">
          Every pull request listed here links to the merged PR on GitHub.
        </p>
      </div>
    </section>
  )
}
