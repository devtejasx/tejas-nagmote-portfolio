import { useMemo } from 'react'
import type { OpenSourceProject } from '../../data/openSource'

export interface MergeEvent {
  repo: string
  project: string
  number: number
  title: string
  mergedAt: string
}

interface ContributionGraphProps {
  projects: OpenSourceProject[]
  /** Date (YYYY-MM-DD) of the currently selected PR, outlined in the grid. */
  selectedDate?: string
  onSelectDay: (events: MergeEvent[]) => void
}

const DAY = 86_400_000
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const iso = (t: number) => new Date(t).toISOString().slice(0, 10)
const longDate = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
const level = (n: number) => (n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : 3)

/**
 * A GitHub-style contribution grid of merge dates: one column per week, one
 * row per weekday. Days with merges are buttons that open those PRs below.
 */
export function ContributionGraph({ projects, selectedDate, onSelectDay }: ContributionGraphProps) {
  const { weeks, months, total } = useMemo(() => {
    const events: MergeEvent[] = projects.flatMap((p) =>
      p.pullRequests.map((pr) => ({ repo: p.repo, project: p.name, ...pr })),
    )
    const byDay = new Map<string, MergeEvent[]>()
    for (const e of events) byDay.set(e.mergedAt, [...(byDay.get(e.mergedAt) ?? []), e])

    const times = events.map((e) => Date.parse(`${e.mergedAt}T00:00:00Z`))
    const first = Math.min(...times)
    const last = Math.max(...times)
    const start = first - new Date(first).getUTCDay() * DAY // Sunday on or before
    const end = last + (6 - new Date(last).getUTCDay()) * DAY // Saturday on or after

    const weeks: { date: string; events: MergeEvent[] }[][] = []
    const months: { label: string; column: number }[] = []
    for (let t = start, column = 0; t <= end; t += 7 * DAY, column++) {
      const week = Array.from({ length: 7 }, (_, d) => {
        const date = iso(t + d * DAY)
        return { date, events: byDay.get(date) ?? [] }
      })
      const firstOfMonth = week.find((day) => day.date.endsWith('-01'))
      if (column === 0 || firstOfMonth) {
        const ref = firstOfMonth?.date ?? week[0].date
        months.push({
          label: new Date(`${ref}T00:00:00Z`).toLocaleString('en', {
            month: 'short',
            timeZone: 'UTC',
          }),
          column,
        })
      }
      weeks.push(week)
    }
    return { weeks, months, total: events.length }
  }, [projects])

  return (
    <figure className="cgraph">
      <figcaption className="cgraph__caption">
        <span className="mono">{total} merged PRs</span> · select a highlighted day to open its PRs
      </figcaption>
      <div className="cgraph__scroll">
        <div className="cgraph__grid" style={{ '--weeks': weeks.length } as never}>
          <div className="cgraph__months" aria-hidden="true">
            {months.map((m) => (
              <span key={`${m.label}-${m.column}`} style={{ gridColumn: m.column + 1 }}>
                {m.label}
              </span>
            ))}
          </div>
          <div className="cgraph__weekdays" aria-hidden="true">
            {WEEKDAYS.map((d, i) => (
              <span key={d}>{i % 2 === 1 ? d : ''}</span>
            ))}
          </div>
          <div className="cgraph__cells">
            {weeks.map((week) =>
              week.map((day) => {
                const n = day.events.length
                const cls = `cgraph__cell cgraph__cell--l${level(n)}${
                  day.date === selectedDate ? ' is-selected' : ''
                }`
                if (n === 0) return <span key={day.date} className={cls} aria-hidden="true" />
                const names = day.events.map((e) => `${e.project} #${e.number}`).join(', ')
                return (
                  <button
                    key={day.date}
                    type="button"
                    className={cls}
                    title={`${longDate(day.date)}: ${names}`}
                    aria-label={`${n} PR${n > 1 ? 's' : ''} merged on ${longDate(day.date)}: ${names}`}
                    aria-pressed={day.date === selectedDate}
                    onClick={() => onSelectDay(day.events)}
                  />
                )
              }),
            )}
          </div>
        </div>
      </div>
      <div className="cgraph__legend" aria-hidden="true">
        <span>Less</span>
        {[0, 1, 2, 3].map((l) => (
          <span key={l} className={`cgraph__cell cgraph__cell--l${l}`} />
        ))}
        <span>More</span>
      </div>
    </figure>
  )
}
