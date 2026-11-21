import { mergedPullRequests, type MergedPullRequest } from './pullRequests'

export interface Highlight {
  /** One sentence from the resume describing the fix. */
  text: string
  pullRequest: number
}

export interface OpenSourceProject {
  /** GitHub owner/name. */
  repo: string
  name: string
  language: string
  /** The repository's own GitHub description, shortened. */
  about: string
  contributionType: string
  featured: boolean
  highlights: Highlight[]
  pullRequests: MergedPullRequest[]
}

function prs(repo: string): MergedPullRequest[] {
  return mergedPullRequests[repo] ?? []
}

export const openSourceProjects: OpenSourceProject[] = [
  {
    repo: 'ng-log/ng-log',
    name: 'ng-log',
    language: 'C++',
    about: "C++ library for application-level logging — the successor to Google's glog.",
    contributionType: 'Concurrency · Correctness',
    featured: true,
    highlights: [
      {
        text: 'Fixed a data race between EnableLogCleaner and active logging threads.',
        pullRequest: 37,
      },
    ],
    pullRequests: prs('ng-log/ng-log'),
  },
  {
    repo: 'google/benchmark',
    name: 'google/benchmark',
    language: 'C++',
    about: "Google's microbenchmark support library for C++.",
    contributionType: 'Memory safety · Correctness',
    featured: true,
    highlights: [
      { text: 'Fixed a use-after-free in the default reporter.', pullRequest: 2265 },
      {
        text: 'Made --benchmark_list_tests respect the configured output format.',
        pullRequest: 2245,
      },
    ],
    pullRequests: prs('google/benchmark'),
  },
  {
    repo: 'ThePhrozenKeep/D2MOO',
    name: 'D2MOO',
    language: 'C++',
    about: 'Reimplementation of the Diablo II game code, with patching facilities for modders.',
    contributionType: 'Game-logic fixes · Server robustness · CI',
    featured: false,
    highlights: [
      {
        text: 'Fixed a UTF-8 buffer sized at exactly 3 bytes per character, which emptied short names and wrote through a null pointer.',
        pullRequest: 240,
      },
    ],
    pullRequests: prs('ThePhrozenKeep/D2MOO'),
  },
  {
    repo: 'grafana/grafana-pathfinder-app',
    name: 'grafana-pathfinder-app',
    language: 'TypeScript',
    about: 'Grafana Interactive Learning: contextual docs and tutorials inside Grafana.',
    contributionType: 'Bug fixes',
    featured: false,
    highlights: [
      {
        text: 'Kept the element picker from saving a selector that no longer matched the element that was picked.',
        pullRequest: 2268,
      },
    ],
    pullRequests: prs('grafana/grafana-pathfinder-app'),
  },
  {
    repo: 'kornia/kornia',
    name: 'Kornia',
    language: 'Python',
    about: 'Geometric computer vision library for spatial AI, built on PyTorch.',
    contributionType: 'Augmentation correctness',
    featured: false,
    highlights: [
      {
        text: 'Made shape-changing augmentations reject a per-sample gate instead of returning images that no longer match their labels.',
        pullRequest: 5473,
      },
    ],
    pullRequests: prs('kornia/kornia'),
  },
  {
    repo: 'stac-utils/pystac',
    name: 'PySTAC',
    language: 'Python',
    about: 'Python library for working with SpatioTemporal Asset Catalogs (STAC).',
    contributionType: 'Bug fix · Feature',
    featured: false,
    highlights: [
      {
        text: 'Converted nested property values recursively, so deeply nested objects serialize to JSON.',
        pullRequest: 1804,
      },
    ],
    pullRequests: prs('stac-utils/pystac'),
  },
  {
    repo: 'fullsend-ai/coverport',
    name: 'coverport',
    language: 'Python',
    about: 'Coverage collection for containerized applications running in Kubernetes.',
    contributionType: 'Testing',
    featured: false,
    highlights: [
      {
        text: 'Added unit tests and a regression guard for the Jira task URL helpers, run in CI.',
        pullRequest: 113,
      },
    ],
    pullRequests: prs('fullsend-ai/coverport'),
  },
  {
    repo: 'micropython/micropython',
    name: 'MicroPython',
    language: 'C',
    about: 'A lean and efficient Python implementation for microcontrollers.',
    contributionType: 'Board configuration fix',
    featured: false,
    highlights: [
      {
        text: 'Fixed the ESP32-C5 board’s flash offset, which left the bootloader looping on an invalid header.',
        pullRequest: 19709,
      },
    ],
    pullRequests: prs('micropython/micropython'),
  },
]

export const repoUrl = (repo: string) => `https://github.com/${repo}`
export const pullUrl = (repo: string, n: number) => `https://github.com/${repo}/pull/${n}`

export const totalMergedPullRequests = openSourceProjects.reduce(
  (sum, p) => sum + p.pullRequests.length,
  0,
)
