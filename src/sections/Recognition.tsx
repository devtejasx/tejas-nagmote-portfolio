import {
  ArrowUpRight,
  BadgeCheck,
  FileCode2,
  GitCommitHorizontal,
  Library,
  Rows3,
  type LucideIcon,
} from 'lucide-react'
import { Badges } from '../components/Badges'
import { GitHubIcon } from '../components/BrandIcon'
import { ButtonLink } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { TiltCard } from '../components/TiltCard'
import { kornia, type RecognitionStat } from '../data/recognition'
import './Recognition.css'

const statIcons: Record<RecognitionStat['icon'], LucideIcon> = {
  corpus: Library,
  commit: GitCommitHorizontal,
  files: FileCode2,
  lines: Rows3,
}

const longDate = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })

/** One open-source contribution, and where it was selected for publication. */
export function Recognition() {
  const r = kornia
  return (
    <section id="recognition" className="section recognition" aria-labelledby="recognition-title">
      <div className="container">
        <SectionHeading
          index="03"
          eyebrow="Recognition"
          id="recognition-title"
          title="Publications & Open-Source Recognition"
        >
          <p>
            A merged contribution to Kornia, later selected for the XERJ Corpus Hub, where AI coding
            agents can find it as a worked example.
          </p>
        </SectionHeading>

        <Reveal>
          <TiltCard as="article" className="rec-card glass" maxTilt={2}>
            <header className="rec-card__head">
              <div className="rec-card__project">
                <p className="rec-card__repo mono">{r.repo}</p>
                <h3 className="rec-card__name">{r.project} — Open-Source Contribution</h3>
                <p className="rec-card__about">{r.projectAbout}</p>
              </div>
              <p className="rec-card__label">
                <BadgeCheck size={16} strokeWidth={2} aria-hidden="true" />
                Published in {r.venue.name}
              </p>
            </header>

            <dl className="rec-card__meta mono">
              <div>
                <dt>PR</dt>
                <dd>#{r.pullRequest}</dd>
              </div>
              <div>
                <dt>Merged</dt>
                <dd>
                  <time dateTime={r.mergedAt}>{longDate(r.mergedAt)}</time>
                </dd>
              </div>
              <div>
                <dt>Selected</dt>
                <dd>
                  <time dateTime={r.selectedAt}>{longDate(r.selectedAt)}</time>
                </dd>
              </div>
              <div>
                <dt>Contributor</dt>
                <dd>
                  {r.contributor.name} (@{r.contributor.handle})
                </dd>
              </div>
            </dl>

            <div className="rec-card__body">
              <div className="rec-card__contribution">
                <h4 className="rec-card__label-heading mono">The contribution</h4>
                <p className="rec-card__title">
                  {r.title}
                  {r.breaking && <span className="rec-card__breaking mono">breaking change</span>}
                </p>
                <ul className="rec-card__summary">
                  {r.summary.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <Badges items={r.touched} label="Areas" />
              </div>

              <aside className="rec-venue" aria-labelledby="rec-venue-title">
                <h4 id="rec-venue-title" className="rec-card__label-heading mono">
                  {r.venue.name}
                </h4>
                <p className="rec-venue__about">{r.venue.about}</p>
                <ul className="rec-stats" aria-label="Publication statistics">
                  {r.stats.map((s) => {
                    const Icon = statIcons[s.icon]
                    return (
                      <li key={s.label} className="rec-stat">
                        <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                        <span className="rec-stat__value">{s.value}</span>
                        <span className="rec-stat__label">{s.label}</span>
                      </li>
                    )
                  })}
                </ul>
                <p className="rec-venue__note">As counted on the XERJ contributor profile.</p>
              </aside>
            </div>

            <ul className="rec-card__links" aria-label="Links">
              {r.links.map((l) => (
                <li key={l.href}>
                  <ButtonLink
                    href={l.href}
                    external
                    variant={l.kind === 'xerj' ? 'secondary' : 'ghost'}
                    className="rec-link"
                    icon={
                      l.kind === 'github' ? (
                        <GitHubIcon size={16} />
                      ) : (
                        <ArrowUpRight size={16} aria-hidden="true" />
                      )
                    }
                  >
                    {l.label}
                  </ButtonLink>
                </li>
              ))}
            </ul>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  )
}
