// Technical skills, from the resume's "Technical Skills" block (2026-11-21),
// grouped into the six categories the site uses. A skill names where it is
// demonstrated ("evidence"): a project on this site, an open-source
// repository with merged work, or the internship. The test suite checks that
// every evidence entry resolves to one of those.

export interface Skill {
  name: string
  evidence?: string[]
}

export interface SkillCategory {
  id: string
  title: string
  skills: Skill[]
}

export const CHAT = 'Real-Time Chat Server'
export const DEPLOYX = 'DeployX'
export const CODECOMPASS = 'CodeCompass'
export const SOCKETS = 'Load-Balanced C++ Socket Server'
export const INTERNSHIP = '7XLabs internship'
export const ROBOT = 'Autonomous Cleaning Robot'

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Programming languages',
    skills: [
      { name: 'C++ (17/20)', evidence: [CHAT, 'ng-log', 'google/benchmark', 'D2MOO'] },
      { name: 'Python', evidence: ['Kornia', 'PySTAC', ROBOT] },
      { name: 'TypeScript', evidence: [CODECOMPASS, 'grafana-pathfinder-app', INTERNSHIP] },
      { name: 'JavaScript (ES6+)', evidence: [DEPLOYX] },
      { name: 'SQL', evidence: [CHAT, DEPLOYX] },
    ],
  },
  {
    id: 'backend',
    title: 'Backend engineering',
    skills: [
      { name: 'REST API design', evidence: [CHAT, DEPLOYX] },
      { name: 'WebSockets', evidence: [CHAT] },
      { name: 'Node.js · Express', evidence: [DEPLOYX, INTERNSHIP] },
      { name: 'Next.js', evidence: [CODECOMPASS, INTERNSHIP] },
      { name: 'Auth: JWT, sessions, RBAC', evidence: [CHAT, DEPLOYX] },
      { name: 'Job queues · Redis Pub/Sub', evidence: [DEPLOYX, CHAT] },
      { name: 'Firebase', evidence: [INTERNSHIP] },
    ],
  },
  {
    id: 'systems',
    title: 'Systems programming',
    skills: [
      { name: 'Multithreading & synchronization', evidence: ['ng-log', 'google/benchmark'] },
      { name: 'Memory safety: RAII, use-after-free, UB', evidence: ['google/benchmark', 'ng-log'] },
      { name: 'Linux', evidence: [CHAT, 'ng-log'] },
      { name: 'POSIX sockets · TCP/IP · HTTP', evidence: [SOCKETS] },
      { name: 'Nginx load balancing', evidence: [SOCKETS, CHAT] },
      { name: 'Embedded: MicroPython on ESP32', evidence: ['MicroPython'] },
      { name: 'Robotics: ROS 2 · Gazebo', evidence: [ROBOT] },
    ],
  },
  {
    id: 'databases',
    title: 'Databases',
    skills: [
      { name: 'PostgreSQL', evidence: [CHAT, DEPLOYX, CODECOMPASS] },
      { name: 'Redis', evidence: [CHAT, DEPLOYX] },
      { name: 'Prisma', evidence: [CODECOMPASS] },
      { name: 'MongoDB' },
      { name: 'MySQL' },
    ],
  },
  {
    id: 'tools',
    title: 'Developer tools',
    skills: [
      { name: 'CMake · GCC · Clang · clang-tidy', evidence: [CHAT, 'ng-log'] },
      { name: 'GoogleTest · Google Benchmark · k6', evidence: [CHAT, 'google/benchmark'] },
      { name: 'Docker · Docker Compose', evidence: [CHAT, DEPLOYX, CODECOMPASS] },
      { name: 'GitHub Actions · Jenkins', evidence: [CHAT, SOCKETS] },
      { name: 'Prometheus', evidence: [CHAT, DEPLOYX] },
      { name: 'Git · code review', evidence: ['41 merged open-source PRs'] },
      { name: 'AWS (EC2, RDS)' },
    ],
  },
  {
    id: 'fundamentals',
    title: 'CS fundamentals',
    skills: [
      { name: 'Data structures & algorithms' },
      { name: 'Operating systems' },
      { name: 'Computer networks' },
      { name: 'DBMS' },
      { name: 'Object-oriented design' },
      { name: 'System design', evidence: [CHAT, DEPLOYX] },
    ],
  },
]

/** Engineering interests, shown separately from skills: these are directions, not claims. */
export const focusAreas = [
  'C++ engineering',
  'Backend development',
  'Systems programming',
  'Embedded software',
  'Networking',
  'Performance engineering',
]
