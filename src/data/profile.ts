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
  /** Hero one-liner, condensed from the resume summary. */
  headline:
    'Building distributed backends with REST/WebSocket APIs, PostgreSQL, Redis and Docker — and fixing concurrency, memory-safety and correctness bugs in widely used C++ codebases.',
  /** Resume summary, split into paragraphs for the About section. */
  summary: [
    'Computer Science undergraduate focused on C++ systems and backend engineering, with 29 merged pull requests across 7 external open-source projects.',
    'Experienced in debugging concurrency, memory-safety, and correctness bugs in widely used C++ codebases, and in building distributed backends with REST/WebSocket APIs, PostgreSQL, Redis, Docker, and CI/CD.',
  ],
  focusAreas: [
    'C++20 systems',
    'Backend engineering',
    'Distributed backends',
    'Concurrency debugging',
    'Memory safety',
    'Open-source contribution',
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

/** Only figures stated on the resume. */
export const stats: Stat[] = [
  {
    value: 29,
    label: 'Merged pull requests',
    context: 'Reviewed and merged by external maintainers',
  },
  {
    value: 7,
    label: 'Open-source projects',
    context: 'Upstream repositories, external organizations',
  },
  {
    value: 413,
    label: 'GoogleTest tests',
    context: 'Real-Time Chat Server, run in GitHub Actions CI',
  },
]
