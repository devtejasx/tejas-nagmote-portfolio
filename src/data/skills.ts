// The resume's "Technical Skills", grouped the way Tejas asked for them. Each
// skill can list where it is demonstrated on this site ("evidence"); the
// test suite checks that every evidence entry names a real project or
// open-source repository.

export interface SkillCategory {
  id: string
  title: string
  /** Short mono-font tag shown on the card. */
  tag: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'systems',
    title: 'Systems & Concurrency',
    tag: 'sys',
    skills: [
      'C++20',
      'Multithreading',
      'Synchronization',
      'Thread Safety',
      'RAII',
      'Linux',
      'CMake',
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    tag: 'api',
    skills: [
      'Node.js',
      'Express.js',
      'JavaScript (ES6+)',
      'REST APIs',
      'API Design',
      'WebSockets',
      'JWT Authentication',
    ],
  },
  {
    id: 'distributed',
    title: 'Distributed Systems',
    tag: 'dist',
    skills: ['Redis Pub/Sub', 'Observability', 'Prometheus', 'Distributed Tracing'],
  },
  {
    id: 'databases',
    title: 'Databases',
    tag: 'db',
    skills: ['PostgreSQL', 'Redis', 'SQL', 'MongoDB', 'MySQL'],
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps',
    tag: 'ops',
    skills: ['Docker', 'GitHub Actions', 'AWS EC2', 'AWS RDS'],
  },
  {
    id: 'testing',
    title: 'Testing & Tools',
    tag: 'test',
    skills: ['GoogleTest', 'Postman', 'Git', 'GitHub'],
  },
  {
    id: 'fundamentals',
    title: 'CS Fundamentals',
    tag: 'cs',
    skills: [
      'Data Structures & Algorithms',
      'OOP',
      'Operating Systems',
      'DBMS',
      'Computer Networks',
      'System Design',
    ],
  },
]

const CHAT = 'Real-Time Chat Server'
const DEPLOYX = 'DeployX'
const API_SUITE = 'REST API Testing Suite'

/**
 * Where each skill shows up in the work on this page, from the resume's
 * project and open-source descriptions. Skills with no entry are listed on
 * the resume but not tied to a specific project here.
 */
export const skillEvidence: Record<string, string[]> = {
  'C++20': [CHAT],
  Multithreading: ['ng-log'],
  Synchronization: ['ng-log', 'google/benchmark'],
  'Thread Safety': ['ng-log', 'google/benchmark'],
  CMake: [CHAT, 'ng-log'],
  'Node.js': [DEPLOYX, API_SUITE],
  'Express.js': [DEPLOYX],
  'REST APIs': [CHAT, DEPLOYX, API_SUITE],
  'API Design': [CHAT],
  WebSockets: [CHAT],
  'JWT Authentication': [CHAT],
  'Redis Pub/Sub': [CHAT],
  Observability: [CHAT],
  Prometheus: [CHAT],
  'Distributed Tracing': [CHAT],
  PostgreSQL: [CHAT, DEPLOYX, API_SUITE],
  Redis: [CHAT, DEPLOYX],
  Docker: [CHAT, DEPLOYX, API_SUITE],
  'GitHub Actions': [CHAT, DEPLOYX, API_SUITE],
  GoogleTest: [CHAT],
  Postman: [API_SUITE],
  Git: ['29 merged open-source PRs'],
  GitHub: ['29 merged open-source PRs'],
}
