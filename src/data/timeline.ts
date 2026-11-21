import { education } from './education'
import { openSourceProjects, totalMergedPullRequests } from './openSource'
import { kornia } from './recognition'

export type TimelineKind = 'employment' | 'open-source' | 'recognition' | 'education'

export const kindLabels: Record<TimelineKind, string> = {
  employment: 'Employment',
  'open-source': 'Open source',
  recognition: 'Recognition',
  education: 'Education',
}

export interface TimelineEntry {
  id: string
  kind: TimelineKind
  /** Display date or range. */
  when: string
  title: string
  org: string
  orgHref?: string
  points: string[]
  /** Renders the 7XLabs client cards under this entry. */
  showClients?: boolean
}

const [university, hsc, icse] = education

const monthYear = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

const firstMerge = openSourceProjects
  .flatMap((p) => p.pullRequests.map((pr) => pr.mergedAt))
  .sort()[0]

const perProject = [...openSourceProjects]
  .sort((a, b) => b.pullRequests.length - a.pullRequests.length)
  .map((p) => `${p.name} ${p.pullRequests.length}`)
  .join(' · ')

/** Newest first. Employment, open source and education stay clearly labelled. */
export const timeline: TimelineEntry[] = [
  {
    id: 'xerj',
    kind: 'recognition',
    when: monthYear(kornia.selectedAt),
    title: `Kornia #${kornia.pullRequest} selected for the ${kornia.venue.name}`,
    org: kornia.venue.name,
    orgHref: 'https://hub.xerj.org/contributors/devtejasx',
    points: [
      'The merged fix was chosen as a worked example in a reference collection of real-world implementations, credited to its author and repository.',
    ],
  },
  {
    id: 'kornia',
    kind: 'open-source',
    when: monthYear(kornia.mergedAt),
    title: 'Breaking-change fix merged into Kornia',
    org: kornia.repo,
    orgHref: `https://github.com/${kornia.repo}/pull/${kornia.pullRequest}`,
    points: [
      'Shape-changing augmentations now reject a per-sample gate with a clear ValueError instead of returning images that no longer match their labels; tests, docs and the audit tool updated to match.',
    ],
  },
  {
    id: '7xlabs',
    kind: 'employment',
    when: 'Aug 2026 – Present',
    title: 'Backend Developer Intern',
    org: '7XLabs',
    orgHref: 'https://7xllabs.com',
    points: [
      'Backend systems for live client products, with Node.js, Next.js, TypeScript and Firebase.',
    ],
    showClients: true,
  },
  {
    id: 'oss',
    kind: 'open-source',
    when: `${monthYear(firstMerge)} – Present`,
    title: `${totalMergedPullRequests} merged pull requests across ${openSourceProjects.length} external projects`,
    org: 'Upstream open source',
    points: [
      'Concurrency, memory-safety and correctness fixes reviewed and merged by each project’s maintainers.',
      perProject,
    ],
  },
  {
    id: 'btech',
    kind: 'education',
    when: `${university.start} – ${university.end}`,
    title: university.credential,
    org: `${university.institution}, ${university.place}`,
    points: [`Graduating ${university.end}. Coursework: ${university.coursework?.join(', ')}.`],
  },
  {
    id: 'school',
    kind: 'education',
    when: `${icse.end} · ${hsc.end}`,
    title: 'ICSE and Higher Secondary (Science)',
    org: `${icse.institution} · ${hsc.institution}`,
    points: [],
  },
]
