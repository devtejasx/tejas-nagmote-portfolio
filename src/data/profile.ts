// Personal details, taken verbatim from the resume (public/resume.pdf).

export interface ExternalLink {
  id: 'github' | 'linkedin' | 'leetcode' | 'email'
  label: string
  /** What a screen reader hears, e.g. "GitHub profile (devtejasx)". */
  description: string
  href: string
  handle: string
}

export const profile = {
  name: 'Tejas Nagmote',
  role: 'C++ Systems & Backend Engineer',
  location: 'Bangalore, India',
  email: 'tejasnagmote520@gmail.com',
  spokenLanguages: ['English', 'Hindi', 'Marathi'],
  /** Hero one-liner, in Tejas's own words. */
  headline:
    'I build reliable backend systems, distributed services, and contribute to real-world C++ open-source projects.',
  /** Roles Tejas is looking for, shown in the hero and About. */
  seeking: ['SDE', 'Backend', 'Systems', 'C++', 'Distributed systems'],
  /** Resume summary, split into paragraphs for the About section. */
  summary: [
    'Computer Science undergraduate focused on C++ systems and backend engineering, with 57 merged pull requests on GitHub, 41 of them across 8 external open-source projects.',
    'Experienced in debugging concurrency, memory-safety, and correctness bugs in widely used C++ codebases, and in building distributed backends with REST/WebSocket APIs, PostgreSQL, Redis, Docker, and CI/CD.',
  ],
  focusAreas: [
    'Systems engineering',
    'Backend engineering',
    'Open-source contribution',
    'Distributed systems',
    'Concurrency',
    'Memory safety',
  ],
  resumePath: 'resume.pdf',
  resumeFileName: 'Tejas_Nagmote_Resume.pdf',
} as const

export const links: ExternalLink[] = [
  {
    id: 'github',
    label: 'GitHub',
    description: 'GitHub profile',
    href: 'https://github.com/devtejasx',
    handle: 'github.com/devtejasx',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    description: 'LinkedIn profile',
    href: 'https://www.linkedin.com/in/tejas-nagmote-33592823a/',
    handle: 'linkedin.com/in/tejas-nagmote-33592823a',
  },
  {
    id: 'leetcode',
    label: 'LeetCode',
    description: 'LeetCode profile',
    href: 'https://leetcode.com/u/Tejas_Nagmote/',
    handle: 'leetcode.com/u/Tejas_Nagmote',
  },
  {
    id: 'email',
    label: 'Email',
    description: 'Send an email',
    href: `mailto:${profile.email}`,
    handle: profile.email,
  },
]

export function getLink(id: ExternalLink['id']): ExternalLink {
  const link = links.find((l) => l.id === id)
  if (!link) throw new Error(`Unknown link: ${id}`)
  return link
}

export interface Stat {
  value: number
  label: string
  context: string
}

/**
 * Every PR by devtejasx that GitHub reports as merged, as of 2026-11-14
 * (search `author:devtejasx type:pr is:merged`). It is the 41 external merges in
 * pullRequests.ts plus 3 in a PESU coursework repo and 13 in Tejas's own repos.
 */
export const mergedOnGitHub = 57

/** The Impact section. Per-project PR figures match pullRequests.ts. */
export const stats: Stat[] = [
  {
    value: mergedOnGitHub,
    label: 'Merged PRs',
    context: 'On GitHub · 41 merged by external maintainers into 8 projects',
  },
  {
    value: 8,
    label: 'Open-source projects',
    context: 'Upstream repositories, external organizations',
  },
  { value: 413, label: 'GoogleTest tests', context: 'Real-Time Chat Server, in GitHub Actions CI' },
  { value: 13, label: 'ng-log PRs', context: "Successor to Google's glog" },
  { value: 7, label: 'google/benchmark PRs', context: "Google's C++ microbenchmark library" },
]

/** The 15-second summary for recruiters, shown in About. */
export const atAGlance: { key: string; value: string }[] = [
  { key: 'role', value: 'C++ Systems & Backend Engineer' },
  { key: 'builds', value: 'Backend and distributed systems' },
  {
    key: 'differentiator',
    value: '57 merged PRs on GitHub, 41 across 8 external open-source projects',
  },
  { key: 'featured', value: 'Real-Time C++ Chat Server' },
  { key: 'building', value: 'DeployX, a self-service deployment platform' },
  {
    key: 'depth',
    value: 'C++, concurrency, memory safety, distributed systems, PostgreSQL, Redis, Docker, AWS',
  },
]
