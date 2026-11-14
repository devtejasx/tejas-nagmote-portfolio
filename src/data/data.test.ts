import { describe, expect, it } from 'vitest'
import { openSourceProjects, totalMergedPullRequests } from './openSource'
import { education } from './education'
import { prDetails, prKey } from './prDetails'
import { links, mergedOnGitHub, stats } from './profile'
import { projects } from './projects'
import { skillCategories, skillEvidence } from './skills'
import { timeline } from './timeline'

describe('open-source data matches GitHub', () => {
  it('counts 41 merged PRs across 8 projects', () => {
    expect(totalMergedPullRequests).toBe(41)
    expect(openSourceProjects).toHaveLength(8)
  })

  it('keeps the per-project merged counts', () => {
    const counts = Object.fromEntries(
      openSourceProjects.map((p) => [p.name, p.pullRequests.length]),
    )
    expect(counts).toEqual({
      'ng-log': 13,
      'google/benchmark': 7,
      D2MOO: 8,
      'grafana-pathfinder-app': 7,
      Kornia: 2,
      coverport: 1,
      MicroPython: 1,
      PySTAC: 2,
    })
  })

  it('only highlights PRs that are in the merged list', () => {
    for (const project of openSourceProjects) {
      const numbers = new Set(project.pullRequests.map((pr) => pr.number))
      for (const h of project.highlights) expect(numbers).toContain(h.pullRequest)
    }
  })

  it('agrees with the headline stats', () => {
    expect(stats.find((s) => s.label === 'Merged PRs')?.value).toBe(mergedOnGitHub)
    expect(mergedOnGitHub).toBeGreaterThanOrEqual(totalMergedPullRequests)
    expect(stats.find((s) => s.label === 'Open-source projects')?.value).toBe(
      openSourceProjects.length,
    )
  })
})

describe('project diagrams', () => {
  const withDiagrams = projects.flatMap((p) => (p.diagram ? [[p.id, p.diagram] as const] : []))

  it.each(withDiagrams)('%s edges reference real nodes', (_, d) => {
    const ids = d.nodes.map((n) => n.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const e of d.edges) {
      expect(ids).toContain(e.from)
      expect(ids).toContain(e.to)
    }
  })

  it('features the chat server and shows its architecture', () => {
    const featured = projects.filter((p) => p.tier === 'featured')
    expect(featured.map((p) => p.id)).toEqual(['realtime-chat'])
    expect(featured[0].diagram?.nodes.map((n) => n.id)).toEqual([
      'clients',
      'gateway',
      'service',
      'postgres',
      'redis',
      'replicas',
    ])
  })

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
    expect(stats.map((s) => s.value)).toEqual([57, 8, 413, 13, 7])
  })
})

describe('skill evidence', () => {
  const known = new Set([
    ...projects.map((p) => p.title),
    ...openSourceProjects.map((p) => p.name),
    '41 merged open-source PRs',
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

describe('pull request details', () => {
  it('explain every merged PR, and nothing else', () => {
    const keys = openSourceProjects.flatMap((p) =>
      p.pullRequests.map((x) => prKey(p.repo, x.number)),
    )
    expect(Object.keys(prDetails).sort()).toEqual([...keys].sort())
    for (const k of keys) {
      expect(prDetails[k].problem.length, k).toBeGreaterThan(20)
      expect(prDetails[k].fix.length, k).toBeGreaterThan(20)
    }
  })

  it('tags the resume highlights correctly', () => {
    expect(prDetails[prKey('ng-log/ng-log', 37)].kind).toBe('Concurrency')
    expect(prDetails[prKey('google/benchmark', 2265)].kind).toBe('Memory safety')
  })
})
