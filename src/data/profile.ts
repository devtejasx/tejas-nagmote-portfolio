// Personal details. Facts here come from the resume (public/resume.pdf) and
// the visitor-facing copy Tejas wrote for the hero.

export interface ExternalLink {
  id: 'github' | 'linkedin' | 'leetcode' | 'email'
  label: string
  /** What a screen reader hears, e.g. "GitHub profile". */
  description: string
  href: string
  handle: string
}

export const profile = {
  name: 'Tejas Nagmote',
  role: 'Software Engineer · C++, Backend & Systems',
  location: 'Bangalore, India',
  email: 'tejasnagmote520@gmail.com',
  university: 'PES University',
  degree: 'B.Tech, Computer Science and Engineering',
  graduation: 2027,
  headline: ['Engineering Reliable Software.', 'Building Systems That Scale.'],
  intro:
    'I’m Tejas Nagmote, a Computer Science undergraduate focused on C++, backend engineering and systems programming. I enjoy solving complex engineering problems and contributing to real-world software projects.',
  objective:
    'Looking for software engineering internships and graduate roles at product companies.',
  resumePath: 'resume.pdf',
  resumeFileName: 'Tejas_Nagmote_Resume.pdf',
  githubUser: 'devtejasx',
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

export interface Proof {
  value: string
  label: string
  /** Section anchor or relative page path. */
  href: string
}

/** The hero's proof strip: verified facts, each linking to where it is shown in full. */
export const proof: Proof[] = [
  { value: '41', label: 'merged PRs across 8 external open-source projects', href: '#open-source' },
  {
    value: 'Kornia #5473',
    label: 'selected for the XERJ Corpus Hub',
    href: '#kornia',
  },
  {
    value: '413',
    label: 'GoogleTest tests behind the C++20 chat server',
    href: 'projects/realtime-chat-server/',
  },
  { value: '7XLabs', label: 'backend developer intern since Aug 2026', href: '#experience' },
]
