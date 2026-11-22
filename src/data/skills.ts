// The resume's "Technical Skills" (Downloads/Tejas_Nagmote_SDE_Resume.pdf,
// 2026-11-22), in its own seven groups, plus a few skills the site already
// showed. Each skill can list where it is demonstrated on this site
// ("evidence"); the test suite checks that every evidence entry names a real
// project, open-source repository or the internship.

export interface SkillCategory {
  id: string
  title: string
  /** Short mono-font tag shown on the card. */
  tag: string
  skills: string[]
}

/** In grid order: the first two cards are wide, the last spans the row. */
export const skillCategories: SkillCategory[] = [
  {
    id: 'systems',
    title: 'Systems & OS',
    tag: 'sys',
    skills: [
      'Linux',
      'Multithreading',
      'Synchronization',
      'Thread Safety',
      'Memory management (RAII)',
      'Data races',
      'Use-after-free',
      'Undefined behavior',
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Databases',
    tag: 'api',
    skills: [
      'Node.js',
      'Express.js',
      'Next.js',
      'Firebase',
      'REST APIs',
      'API Design',
      'JWT Authentication',
      'PostgreSQL',
      'Redis',
      'MongoDB',
      'MySQL',
    ],
  },
  {
    id: 'languages',
    title: 'Languages',
    tag: 'lang',
    skills: ['C++17/20', 'Python', 'SQL', 'TypeScript', 'JavaScript (ES6+)'],
  },
  {
    id: 'networking',
    title: 'Networking',
    tag: 'net',
    skills: [
      'TCP/IP',
      'POSIX sockets',
      'HTTP',
      'WebSockets',
      'Client–server design',
      'Nginx load balancing',
      'Redis Pub/Sub',
    ],
  },
  {
    id: 'embedded',
    title: 'Embedded',
    tag: 'mcu',
    skills: ['MicroPython (C) on ESP32', 'Board definitions', 'Flash & bootloader layout'],
  },
  {
    id: 'fundamentals',
    title: 'CS Fundamentals',
    tag: 'cs',
    skills: [
      'Data Structures & Algorithms',
      'OOP',
      'Operating Systems',
      'Computer Networks',
      'DBMS',
      'System Design',
    ],
  },
  {
    id: 'tools',
    title: 'Tools & DevOps',
    tag: 'ops',
    skills: [
      'GCC',
      'Clang',
      'clang-tidy',
      'CMake',
      'GoogleTest',
      'Git',
      'GitHub',
      'GitHub Actions',
      'Jenkins',
      'Docker',
      'AWS EC2',
      'AWS RDS',
      'Prometheus',
      'Observability',
      'Distributed Tracing',
      'Postman',
    ],
  },
]

const CHAT = 'Real-Time Chat Server'
const DEPLOYX = 'DeployX'
const API_SUITE = 'REST API Testing Suite'
const CODECOMPASS = 'CodeCompass'
const SOCKET = 'Load-Balanced C++ Socket Server'
export const INTERNSHIP = '7XLabs internship'

/**
 * Where each skill shows up in the work on this page, from the project,
 * open-source and experience descriptions. Skills with no entry are on the
 * resume but not tied to a specific piece of work shown here.
 */
export const skillEvidence: Record<string, string[]> = {
  // Systems & OS
  Linux: [CHAT, SOCKET],
  Multithreading: ['ng-log'],
  Synchronization: ['ng-log', 'google/benchmark'],
  'Thread Safety': ['ng-log', 'google/benchmark'],
  'Memory management (RAII)': [CHAT],
  'Data races': ['ng-log'],
  'Use-after-free': ['google/benchmark'],
  'Undefined behavior': ['google/benchmark', 'ng-log'],
  // Backend & Databases
  'Node.js': [DEPLOYX, API_SUITE, INTERNSHIP],
  'Express.js': [DEPLOYX],
  'Next.js': [CODECOMPASS, INTERNSHIP],
  Firebase: [INTERNSHIP],
  'REST APIs': [CHAT, DEPLOYX, API_SUITE],
  'API Design': [CHAT],
  'JWT Authentication': [CHAT],
  PostgreSQL: [CHAT, DEPLOYX, API_SUITE],
  Redis: [CHAT, DEPLOYX],
  // Languages
  'C++17/20': [CHAT, 'ng-log', 'google/benchmark', 'D2MOO'],
  Python: ['Kornia', 'PySTAC'],
  SQL: [CHAT, DEPLOYX],
  TypeScript: [CODECOMPASS, 'grafana-pathfinder-app', INTERNSHIP],
  'JavaScript (ES6+)': [DEPLOYX],
  // Networking
  HTTP: [CHAT],
  'POSIX sockets': [SOCKET],
  WebSockets: [CHAT],
  'Client–server design': [CHAT],
  'Nginx load balancing': [CHAT, SOCKET],
  'Redis Pub/Sub': [CHAT],
  // Embedded
  'MicroPython (C) on ESP32': ['MicroPython'],
  'Board definitions': ['MicroPython'],
  'Flash & bootloader layout': ['MicroPython'],
  // Tools & DevOps
  'clang-tidy': [CHAT, 'D2MOO'],
  CMake: [CHAT, 'ng-log'],
  GoogleTest: [CHAT],
  Docker: [CHAT, DEPLOYX, API_SUITE, SOCKET],
  'GitHub Actions': [CHAT, DEPLOYX, API_SUITE],
  Prometheus: [CHAT],
  Observability: [CHAT],
  'Distributed Tracing': [CHAT],
  Jenkins: [SOCKET],
  Postman: [API_SUITE],
  Git: ['41 merged open-source PRs'],
  GitHub: ['41 merged open-source PRs'],
}
