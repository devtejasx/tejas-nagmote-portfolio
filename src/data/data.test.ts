import { describe, expect, it } from 'vitest'
import { openSourceProjects, totalMergedPullRequests } from './openSource'
import { education } from './education'
import { links, stats } from './profile'
import { projects } from './projects'
import { skillCategories, skillEvidence } from './skills'
import { timeline } from './timeline'

describe('open-source data matches the resume', () => {
  it('counts 29 merged PRs across 7 projects', () => {
    expect(totalMergedPullRequests).toBe(29)
    expect(openSourceProjects).toHaveLength(7)
  })

  it('keeps the per-project counts stated on the resume', () => {
    const counts = Object.fromEntries(
      openSourceProjects.map((p) => [p.name, p.pullRequests.length]),
    )
    expect(counts).toEqual({
      'ng-log': 12,
      'google/benchmark': 6,
      D2MOO: 5,
      'grafana-pathfinder-app': 3,
      coverport: 1,
      MicroPython: 1,
      PySTAC: 1,
    })
  })

  it('only highlights PRs that are in the merged list', () => {
    for (const project of openSourceProjects) {
      const numbers = new Set(project.pullRequests.map((pr) => pr.number))
      for (const h of project.highlights) expect(numbers).toContain(h.pullRequest)
    }
  })

  it('agrees with the headline stats', () => {
    expect(stats.find((s) => s.label === 'Merged PRs')?.value).toBe(totalMergedPullRequests)
    expect(stats.find((s) => s.label === 'Open-source projects')?.value).toBe(
      openSourceProjects.length,
    )
  })
})

describe('project diagrams', () => {
  it.each(projects.map((p) => [p.id, p.diagram] as const))(
    '%s edges reference real nodes',
    (_, d) => {
      const ids = d.nodes.map((n) => n.id)
      expect(new Set(ids).size).toBe(ids.length)
      for (const e of d.edges) {
        expect(ids).toContain(e.from)
        expect(ids).toContain(e.to)
      }
    },
  )

  it('marks only DeployX as in progress', () => {
    expect(projects.filter((p) => p.status === 'In Progress').map((p) => p.id)).toEqual(['deployx'])
  })
})

describe('links and skills', () => {
  it('uses https or mailto links only', () => {
    for (const l of links) expect(l.href).toMatch(/^(https:\/\/|mailto:)/)
    for (const p of projects) expect(p.repo).toMatch(/^https:\/\/github\.com\/devtejasx\//)
    for (const p of projects) if (p.live) expect(p.live).toMatch(/^https:\/\//)
  })

  it('has no duplicate skills inside a category', () => {
    for (const c of skillCategories) expect(new Set(c.skills).size).toBe(c.skills.length)
  })
})

describe('education', () => {
  it('lists university, HSC and ICSE, newest first', () => {
    expect(education.map((e) => e.end)).toEqual([2027, 2023, 2020])
    expect(education[0].institution).toBe('PES University')
  })
})

describe('impact stats', () => {
  const statFor = (label: string) => stats.find((s) => s.label === label)?.value
  const prsIn = (name: string) =>
    openSourceProjects.find((p) => p.name === name)?.pullRequests.length

  it('matches the per-project PR data', () => {
    expect(statFor('ng-log PRs')).toBe(prsIn('ng-log'))
    expect(statFor('google/benchmark PRs')).toBe(prsIn('google/benchmark'))
  })

  it('shows exactly the five resume figures', () => {
    expect(stats.map((s) => s.value)).toEqual([29, 7, 413, 12, 6])
  })
})

describe('skill evidence', () => {
  const known = new Set([
    ...projects.map((p) => p.title),
    ...openSourceProjects.map((p) => p.name),
    '29 merged open-source PRs',
  ])

  it('only points at real projects and repositories', () => {
    for (const [skill, where] of Object.entries(skillEvidence)) {
      expect(
        skillCategories.some((c) => c.skills.includes(skill)),
        skill,
      ).toBe(true)
      for (const w of where) expect(known, `${skill} -> ${w}`).toContain(w)
    }
  })
})

describe('timeline', () => {
  it('uses only years from the education data, plus "Now"', () => {
    const years = new Set(
      education
        .flatMap((e) => [e.start, e.end])
        .filter(Boolean)
        .map(String),
    )
    for (const stop of timeline) expect(stop.when === 'Now' || years.has(stop.when)).toBe(true)
  })
})
