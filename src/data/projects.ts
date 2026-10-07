// The first three projects are the resume's "Projects" block. CodeCompass and
// ARISE come from their repositories' own READMEs and docs. Diagram node text
// paraphrases the same sources.

export interface DiagramNode {
  id: string
  label: string
  sublabel: string
  detail: string
  /** Position (node centre) in the landscape layout, viewBox 640 × 300. */
  wide: [number, number]
  /** Position in the portrait layout used on narrow screens, viewBox 320 × 520. */
  narrow: [number, number]
  tone?: 'accent' | 'warn'
}

export interface DiagramEdge {
  from: string
  to: string
  label?: string
  /** Dashed edges are asynchronous or failure paths. */
  kind?: 'flow' | 'async' | 'failure'
}

export interface Diagram {
  title: string
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  /** Cross-cutting concerns drawn as a band beneath the graph. */
  band?: string
}

export interface Project {
  id: string
  title: string
  tagline: string
  status?: 'In Progress'
  repo: string
  /** Deployed demo, when there is one. */
  live?: string
  tech: string[]
  summary: string
  bullets: string[]
  features: string[]
  diagram: Diagram
}

export const projects: Project[] = [
  {
    id: 'realtime-chat',
    title: 'Real-Time Chat Server',
    tagline: 'C++20 messaging backend, distributed across replicas',
    repo: 'https://github.com/devtejasx/realtime-chat-server',
    tech: [
      'C++20',
      'CMake',
      'Crow',
      'WebSockets',
      'PostgreSQL',
      'Redis',
      'Docker',
      'GitHub Actions',
    ],
    summary:
      'A C++20 messaging backend in which REST controllers and WebSocket handlers share one service layer, giving every message one code path.',
    bullets: [
      'Supports direct/group chat, presence, typing indicators, read receipts, reactions, and PostgreSQL full-text search.',
      'Distributes real-time delivery across replicas with Redis Pub/Sub fan-out, tagging events with an origin node ID to suppress loops; messages are persisted to PostgreSQL before broadcasting.',
      'Secured with bcrypt hashing, rotating JWT access/refresh tokens, database-authoritative RBAC, and rate limiting.',
      'Hardened with circuit breakers and exponential-backoff retries; Prometheus metrics and W3C distributed tracing; validated with 413 GoogleTest tests in GitHub Actions CI.',
    ],
    features: [
      'REST + WebSocket service layer',
      'Direct & group chat',
      'Presence',
      'Typing indicators',
      'Read receipts',
      'Reactions',
      'PostgreSQL full-text search',
      'Redis Pub/Sub',
      'JWT authentication',
      'RBAC',
      'Rate limiting',
      'Circuit breakers',
      'Exponential backoff',
      'Prometheus',
      'W3C distributed tracing',
      '413 GoogleTest tests',
    ],
    diagram: {
      title: 'Message path through the chat server',
      band: 'JWT · RBAC · rate limiting · circuit breakers · backoff · Prometheus · W3C tracing',
      nodes: [
        {
          id: 'clients',
          label: 'Clients',
          sublabel: 'REST · WebSocket',
          detail:
            'Clients use REST and WebSockets for direct and group chat, presence, typing indicators, read receipts and reactions.',
          wide: [72, 130],
          narrow: [160, 40],
        },
        {
          id: 'crow',
          label: 'Crow · C++20',
          sublabel: 'REST + WS handlers',
          detail:
            'REST controllers and WebSocket handlers share one service layer, so every message takes one code path.',
          wide: [228, 130],
          narrow: [160, 140],
        },
        {
          id: 'service',
          label: 'Service layer',
          sublabel: 'one code path',
          detail:
            'Secured with bcrypt hashing, rotating JWT access/refresh tokens, database-authoritative RBAC and rate limiting; hardened with circuit breakers and exponential-backoff retries.',
          wide: [384, 130],
          narrow: [160, 240],
          tone: 'accent',
        },
        {
          id: 'postgres',
          label: 'PostgreSQL',
          sublabel: 'persist · search',
          detail:
            'Messages are persisted to PostgreSQL before they are broadcast. PostgreSQL full-text search powers message search.',
          wide: [576, 52],
          narrow: [82, 360],
        },
        {
          id: 'redis',
          label: 'Redis Pub/Sub',
          sublabel: 'replica fan-out',
          detail:
            'Redis Pub/Sub fans real-time events out across replicas, each tagged with an origin node ID to suppress loops.',
          wide: [576, 208],
          narrow: [238, 360],
        },
      ],
      edges: [
        { from: 'clients', to: 'crow' },
        { from: 'crow', to: 'service' },
        { from: 'service', to: 'postgres', label: '1 · persist' },
        { from: 'service', to: 'redis', label: '2 · publish' },
      ],
    },
  },
  {
    id: 'deployx',
    title: 'DeployX',
    tagline: 'Self-Service Deployment Platform',
    status: 'In Progress',
    repo: 'https://github.com/devtejasx/DeployX',
    tech: ['React', 'Node.js/Express', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'GitHub Actions'],
    summary:
      'A self-service platform that connects GitHub repositories to automated Docker-based builds and deployments.',
    bullets: [
      'Redis-backed job queue for concurrent builds, with retries, failure handling, and deployment state tracking.',
      'Health checks with automatic rollback to the last stable version.',
      'REST APIs and a dashboard for deployment history, real-time logs, and application status.',
    ],
    features: [
      'GitHub repository integration',
      'Automated Docker builds',
      'Deployment pipeline',
      'Redis-backed job queue',
      'Concurrent builds',
      'Retries',
      'Failure handling',
      'Deployment state tracking',
      'Health checks',
      'Automatic rollback',
      'Deployment dashboard',
      'Real-time logs',
    ],
    diagram: {
      title: 'DeployX deployment pipeline',
      nodes: [
        {
          id: 'repo',
          label: 'GitHub repo',
          sublabel: 'connected project',
          detail: 'A GitHub repository is connected to the platform as a deployable project.',
          wide: [70, 100],
          narrow: [82, 36],
        },
        {
          id: 'queue',
          label: 'Job queue',
          sublabel: 'Redis · retries',
          detail:
            'A Redis-backed job queue runs concurrent builds, with retries, failure handling and deployment state tracking.',
          wide: [200, 100],
          narrow: [82, 120],
        },
        {
          id: 'build',
          label: 'Docker build',
          sublabel: 'automated image',
          detail: 'Each deployment is built automatically into a Docker image.',
          wide: [330, 100],
          narrow: [82, 204],
        },
        {
          id: 'deploy',
          label: 'Deploy',
          sublabel: 'state tracked',
          detail: 'The image is deployed, with every state change tracked for the deployment.',
          wide: [460, 100],
          narrow: [82, 288],
          tone: 'accent',
        },
        {
          id: 'health',
          label: 'Health check',
          sublabel: 'gate to stable',
          detail: 'Health checks decide whether the new version becomes the stable one.',
          wide: [590, 100],
          narrow: [82, 372],
        },
        {
          id: 'rollback',
          label: 'Rollback',
          sublabel: 'last stable',
          detail: 'A failed health check rolls back automatically to the last stable version.',
          wide: [590, 228],
          narrow: [246, 372],
          tone: 'warn',
        },
        {
          id: 'dashboard',
          label: 'Dashboard',
          sublabel: 'history · logs',
          detail:
            'REST APIs and a dashboard show deployment history, real-time logs and application status.',
          wide: [460, 228],
          narrow: [246, 288],
        },
      ],
      edges: [
        { from: 'repo', to: 'queue' },
        { from: 'queue', to: 'build' },
        { from: 'build', to: 'deploy' },
        { from: 'deploy', to: 'health' },
        { from: 'health', to: 'rollback', label: 'unhealthy', kind: 'failure' },
        { from: 'deploy', to: 'dashboard', label: 'status + logs', kind: 'async' },
      ],
    },
  },
  {
    id: 'api-testing',
    title: 'REST API Testing Suite',
    tagline: 'Reproducible, CI-enforced API regression testing',
    repo: 'https://github.com/devtejasx/rest-api-testing-suite',
    tech: ['Node.js', 'PostgreSQL', 'Docker', 'GitHub Actions', 'Postman'],
    summary:
      'Automated API checks that run against a reproducible, containerized environment on every push.',
    bullets: [
      'Containerized the service and a seeded PostgreSQL test database with Docker for reproducible runs, eliminating false failures from local data drift.',
      'Automated schema, status-code, and response-time assertions across all endpoints, running on every push in GitHub Actions to catch regressions before merge.',
    ],
    features: [
      'Dockerized service',
      'Seeded PostgreSQL test database',
      'Schema assertions',
      'Status-code assertions',
      'Response-time assertions',
      'GitHub Actions CI',
      'Regression detection',
    ],
    diagram: {
      title: 'API test pipeline',
      nodes: [
        {
          id: 'push',
          label: 'git push',
          sublabel: 'every commit',
          detail: 'Every push starts the full suite.',
          wide: [70, 130],
          narrow: [160, 40],
        },
        {
          id: 'ci',
          label: 'GitHub Actions',
          sublabel: 'CI pipeline',
          detail: 'GitHub Actions runs the whole suite on every push.',
          wide: [200, 130],
          narrow: [160, 140],
        },
        {
          id: 'docker',
          label: 'Docker',
          sublabel: 'service + test DB',
          detail:
            'The service and a seeded PostgreSQL test database run in Docker, so results never depend on local data drift.',
          wide: [330, 130],
          narrow: [160, 240],
          tone: 'accent',
        },
        {
          id: 'assert',
          label: 'Assertions',
          sublabel: 'schema/status/time',
          detail: 'Schema, status-code and response-time assertions run across all endpoints.',
          wide: [460, 130],
          narrow: [160, 340],
        },
        {
          id: 'gate',
          label: 'Merge gate',
          sublabel: 'regressions caught',
          detail: 'A failing assertion fails the CI run, catching the regression before merge.',
          wide: [590, 130],
          narrow: [160, 440],
        },
      ],
      edges: [
        { from: 'push', to: 'ci' },
        { from: 'ci', to: 'docker' },
        { from: 'docker', to: 'assert' },
        { from: 'assert', to: 'gate' },
      ],
    },
  },
  {
    id: 'codecompass',
    title: 'CodeCompass',
    tagline: 'Guided learning platform for beginners in tech',
    repo: 'https://github.com/devtejasx/CodeCompass',
    live: 'https://code-compass-dusky.vercel.app',
    tech: [
      'Next.js 15',
      'React 19',
      'TypeScript',
      'PostgreSQL',
      'Prisma',
      'Auth.js',
      'Tailwind CSS',
      'Docker',
    ],
    summary:
      'A guided technology-learning platform that helps beginners choose a tech career, then shows them what to learn next, in what order, and what to build along the way.',
    bullets: [
      'Career explorer, a roadmap engine with phases, topics and prerequisites, lessons with knowledge checks, project milestones and a personalisation engine built around one rule: never let a beginner wonder what to learn next.',
      'Coding practice with 300 authored problems across 31 DSA topics in five languages (JavaScript, TypeScript, Python, Java, C++), graded by a separate execution service that compiles and runs each submission in a throwaway container with no network, no secrets, a read-only filesystem and a non-root user.',
      'The Next.js app never executes learner code: a test reads the execution module and fails on any eval, vm or child_process use, and a 27-case sandbox suite probes network access, host filesystem reads, privilege escalation, memory exhaustion and time limits.',
      'Auth.js credentials sign-in with bcrypt (cost 12) and identical responses for unknown emails and wrong passwords, so the login form cannot be used to enumerate accounts.',
    ],
    features: [
      'Career explorer',
      'Roadmap engine',
      'Lessons & knowledge checks',
      '300 practice problems',
      '5 languages',
      'Sandboxed code execution',
      'Project milestones',
      'Git & GitHub Academy',
      'AI Tools Academy',
      'Personalisation engine',
      'Public techie profile',
      'Auth.js + bcrypt',
    ],
    diagram: {
      title: 'How a practice submission is graded',
      nodes: [
        {
          id: 'browser',
          label: 'Browser',
          sublabel: 'code + language',
          detail:
            'The learner writes a solution in the Monaco editor and submits it in one of five languages.',
          wide: [70, 100],
          narrow: [82, 36],
        },
        {
          id: 'app',
          label: 'Next.js action',
          sublabel: 'hidden tests here',
          detail:
            'A server action reads the hidden tests and reference solution on the server, where they stay. The application itself never executes learner code.',
          wide: [225, 100],
          narrow: [82, 128],
          tone: 'accent',
        },
        {
          id: 'executor',
          label: 'Executor',
          sublabel: 'bounded queue',
          detail:
            'A separate execution service holds a bounded queue, generates a test harness for the language and drives the container runtime.',
          wide: [395, 100],
          narrow: [82, 220],
        },
        {
          id: 'sandbox',
          label: 'Sandbox',
          sublabel: 'no net · non-root',
          detail:
            'Each submission compiles and runs in a throwaway container: no network, no secrets, read-only, non-root. Only a verdict and timings come back.',
          wide: [565, 100],
          narrow: [82, 312],
          tone: 'warn',
        },
        {
          id: 'db',
          label: 'PostgreSQL',
          sublabel: 'Prisma · progress',
          detail:
            "The app stores the submission and updates the learner's progress in PostgreSQL through Prisma.",
          wide: [225, 228],
          narrow: [246, 128],
        },
      ],
      edges: [
        { from: 'browser', to: 'app' },
        { from: 'app', to: 'executor', label: 'HTTPS' },
        { from: 'executor', to: 'sandbox', label: 'compile · run' },
        { from: 'app', to: 'db', label: 'verdict', kind: 'async' },
      ],
    },
  },
  {
    id: 'arise',
    title: 'ARISE — Discipline Quest',
    tagline: 'Gamified task and habit tracker (Daily-Task-manager)',
    repo: 'https://github.com/devtejasx/Daily-Task-manager',
    live: 'https://daily-task-manager-frontend-kappa.vercel.app',
    tech: ['React 18', 'Vite', 'Tailwind CSS', 'Firebase Auth', 'Firestore', 'PWA', 'Vitest'],
    summary:
      'A task and habit tracker that turns missions into XP and ranks, designed to reward consistency rather than perfection: a missed day is absorbed by a Streak Shield instead of wiping progress.',
    bullets: [
      'Mission board with difficulty tiers, recurring missions (daily, weekly, monthly or every N days), drag-and-drop ordering with pointer, touch and keyboard support, deadlines, reminders and composable filters.',
      'Progression through daily quests, XP and levels, hunter ranks earned by streak and achievements; the Resolve system spends a Streak Shield or holds the streak for a day, so nothing earned is ever taken away.',
      'Habit tracker, productivity analytics (completion rate, XP curve, four-month activity heatmap), a Pomodoro timer and a month/week calendar.',
      'Firebase Auth (email/password and Google) with Firestore cloud sync and offline persistence; installable PWA with guest and demo modes, JSON/CSV export and import, and 283 Vitest tests.',
    ],
    features: [
      'Recurring missions',
      'Drag & drop',
      'Reminders',
      'XP & levels',
      'Streak shields',
      'Habit tracker',
      'Analytics heatmap',
      'Pomodoro timer',
      'Calendar',
      'Offline sync',
      'Installable PWA',
      'Guest & demo modes',
      'JSON/CSV export',
      '283 Vitest tests',
    ],
    diagram: {
      title: 'How ARISE saves progress',
      nodes: [
        {
          id: 'ui',
          label: 'React app',
          sublabel: 'missions · habits',
          detail:
            'React and Vite front end: mission board, habits, calendar, analytics and a Pomodoro timer. Guest mode explores everything signed out.',
          wide: [70, 100],
          narrow: [82, 36],
        },
        {
          id: 'progression',
          label: 'Progression',
          sublabel: 'XP · ranks · streak',
          detail:
            'Clearing missions earns XP and levels. Daily quests extend the streak, every 7th day forges a Streak Shield, and a missed day is absorbed instead of resetting progress.',
          wide: [235, 100],
          narrow: [82, 128],
          tone: 'accent',
        },
        {
          id: 'local',
          label: 'Local mirror',
          sublabel: 'IndexedDB · offline',
          detail:
            'Firestore IndexedDB persistence plus a local mirror: edits work offline and sync when the connection returns.',
          wide: [400, 100],
          narrow: [82, 220],
        },
        {
          id: 'firestore',
          label: 'Firestore',
          sublabel: 'one doc per user',
          detail: 'Cloud sync keeps one save document per user in Cloud Firestore.',
          wide: [570, 100],
          narrow: [82, 312],
        },
        {
          id: 'auth',
          label: 'Firebase Auth',
          sublabel: 'email · Google',
          detail: 'Sign-in with Firebase Auth, by email and password or with Google.',
          wide: [70, 228],
          narrow: [246, 36],
        },
      ],
      edges: [
        { from: 'ui', to: 'progression', label: 'clear' },
        { from: 'progression', to: 'local', label: 'save' },
        { from: 'local', to: 'firestore', label: 'sync', kind: 'async' },
        { from: 'ui', to: 'auth', label: 'sign in' },
      ],
    },
  },
]
