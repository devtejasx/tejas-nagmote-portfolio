// Publications & Open-Source Recognition.
//
// Facts checked on 2026-11-14 against GitHub (kornia/kornia#5473, merged
// 2026-10-06 as commit 584251cd) and the XERJ Corpus Hub pages linked below.
// This is an open-source contribution selected for a reference collection,
// not an academic paper: keep the wording that way.

export interface RecognitionStat {
  value: number
  label: string
  icon: 'corpus' | 'commit' | 'files' | 'lines'
}

export interface RecognitionLink {
  label: string
  href: string
  kind: 'github' | 'xerj'
}

export interface Recognition {
  id: string
  project: string
  repo: string
  projectAbout: string
  pullRequest: number
  commit: string
  title: string
  mergedAt: string
  /** First day the XERJ contributor profile lists. */
  selectedAt: string
  breaking: boolean
  contributor: { name: string; handle: string }
  summary: string[]
  touched: string[]
  venue: { name: string; about: string }
  /** As reported on the XERJ contributor profile, which counts differently from GitHub's diff stats. */
  stats: RecognitionStat[]
  links: RecognitionLink[]
}

export const kornia: Recognition = {
  id: 'kornia-5473',
  project: 'Kornia',
  repo: 'kornia/kornia',
  projectAbout: 'Open-source geometric computer vision library built on PyTorch.',
  pullRequest: 5473,
  commit: '584251cd694a4421385750a51898890161df8885',
  title: 'Reject a mixed gate on shape-changing augmentations',
  mergedAt: '2026-10-06',
  selectedAt: '2026-10-14',
  breaking: true,
  contributor: { name: 'Tejas Anil Nagmote', handle: 'devtejasx' },
  summary: [
    'Fixed a bug in the data augmentation module: a per-sample gate on a shape-changing augmentation such as RandomCrop or Resize could still transform the images it was meant to skip.',
    'Those skipped images no longer matched their labels, and inverse() could fail with a shape mismatch.',
    'Unsupported mixed-gate cases now raise a clear ValueError instead of silently returning wrong data; whole-batch gates and shape-preserving augmentations behave as before.',
    'Updated the augmentation audit tool, tests and documentation to match, and shipped it as a deliberate breaking change.',
  ],
  touched: ['Python', 'PyTorch', 'Data augmentation', 'Breaking change'],
  venue: {
    name: 'XERJ Corpus Hub',
    about:
      'A reference collection that AI coding agents search for real-world implementations. When an agent meets a similar problem, it gets this commit back as a worked example, credited to its author and repository.',
  },
  stats: [
    { value: 1, label: 'published corpus', icon: 'corpus' },
    { value: 1, label: 'selected commit', icon: 'commit' },
    { value: 6, label: 'files', icon: 'files' },
    { value: 237, label: 'lines of code', icon: 'lines' },
  ],
  links: [
    {
      label: 'Pull request #5473',
      href: 'https://github.com/kornia/kornia/pull/5473',
      kind: 'github',
    },
    {
      label: 'Selected commit 584251c',
      href: 'https://github.com/kornia/kornia/commit/584251cd694a4421385750a51898890161df8885',
      kind: 'github',
    },
    {
      label: 'XERJ contributor profile',
      href: 'https://hub.xerj.org/contributors/devtejasx',
      kind: 'xerj',
    },
    {
      label: 'Published corpus',
      href: 'https://hub.xerj.org/corpus/kornia--kornia',
      kind: 'xerj',
    },
    { label: '@devtejasx on GitHub', href: 'https://github.com/devtejasx', kind: 'github' },
  ],
}
