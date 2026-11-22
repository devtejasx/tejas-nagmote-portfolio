// The first three projects are the resume's "Projects" block, in its own
// words. The socket server and CodeCompass come from their repositories' READMEs.

import type { NodeKind } from '../three/layout'

export interface DiagramNode {
  id: string
  label: string
  sublabel: string
  detail: string
  /** Position (node centre) in the landscape SVG layout, viewBox 640 wide. */
  wide: [number, number]
  /** Position in the portrait SVG layout used on narrow screens, viewBox 320 wide. */
  narrow: [number, number]
  /** Shape and position in the 3D architecture view. */
  kind3d: NodeKind
  pos3d: [number, number, number]
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

export interface StoryStep {
  label: string
  text: string
}

export interface Project {
  id: string
  title: string
  tagline: string
  /** featured: the main project; major: full section; supporting / more: smaller cards. */
  tier: 'featured' | 'major' | 'supporting' | 'more'
  status?: 'In Progress'
  repo: string
  /** Deployed demo, when there is one. */
  live?: string
  tech: string[]
  summary: string
  /** The resume bullets, shown under "Project details". */
  bullets: string[]
  /** What users can do. */
  capabilities?: string[]
  /** How it is built. */
  engineering?: string[]
  diagram?: Diagram
  /** Problem → approach → result, for the smaller project. */
  story?: StoryStep[]
}

export const projects: Project[] = [
  {
    id: 'realtime-chat',
    title: 'Real-Time Chat Server',
    tagline: 'C++20 messaging backend, distributed across replicas',
    tier: 'featured',
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
      'A C++20 messaging backend in which REST controllers and WebSocket handlers share one service layer, giving every message one code path, with real-time delivery distributed across replicas through Redis Pub/Sub.',
    bullets: [
      'Architected a C++20 messaging backend in which REST controllers and WebSocket handlers share one service layer, giving every message one code path; supports direct/group chat, presence, typing indicators, read receipts, reactions, and PostgreSQL full-text search.',
      'Distributed real-time delivery across replicas with Redis Pub/Sub fan-out, tagging events with an origin node ID to suppress loops; persisted messages to PostgreSQL before broadcasting.',
      'Secured the API with bcrypt hashing, rotating JWT access/refresh tokens, database-authoritative RBAC, and rate limiting.',
      'Hardened reliability with circuit breakers and exponential-backoff retries; added Prometheus metrics and W3C distributed tracing; validated with 413 GoogleTest tests in GitHub Actions CI.',
    ],
    capabilities: [
      'Direct chat',
      'Group chat',
      'Presence',
      'Typing indicators',
      'Read receipts',
      'Reactions',
      'PostgreSQL full-text search',
    ],
    engineering: [
      'Redis Pub/Sub fan-out across replicas',
      'Origin node ID to suppress loops',
      'Persist to PostgreSQL before broadcasting',
      'bcrypt password hashing',
      'Rotating JWT access/refresh tokens',
      'Database-authoritative RBAC',
      'Rate limiting',
      'Circuit breakers',
      'Exponential-backoff retries',
      'Prometheus metrics',
      'W3C distributed tracing',
      '413 GoogleTest tests in CI',
    ],
    diagram: {
      title: 'Real-Time Chat Server architecture',
      band: 'bcrypt · JWT · RBAC · rate limiting · circuit breakers · backoff · Prometheus · W3C tracing',
      nodes: [
        {
          id: 'clients',
          label: 'Clients',
          sublabel: 'direct · group',
          detail:
            'Clients use direct and group chat, presence, typing indicators, read receipts and reactions.',
          wide: [72, 70],
          narrow: [160, 36],
          kind3d: 'client',
          pos3d: [-3.3, 0.7, 0],
        },
        {
          id: 'gateway',
          label: 'REST / WebSocket',
          sublabel: 'Crow · C++20',
          detail:
            'Crow REST controllers and WebSocket handlers: the two ways clients reach the backend.',
          wide: [226, 70],
          narrow: [160, 122],
          kind3d: 'api',
          pos3d: [-1.6, -0.1, 0.4],
        },
        {
          id: 'service',
          label: 'C++ service layer',
          sublabel: 'one code path',
          detail:
            'REST controllers and WebSocket handlers share this one service layer, so every message takes the same code path.',
          wide: [396, 70],
          narrow: [160, 208],
          kind3d: 'service',
          pos3d: [0.1, 0.6, 0],
          tone: 'accent',
        },
        {
          id: 'postgres',
          label: 'PostgreSQL',
          sublabel: 'persist · search',
          detail:
            'Messages are persisted to PostgreSQL before they are broadcast, and PostgreSQL full-text search powers message search. Passwords are stored as bcrypt hashes.',
          wide: [570, 70],
          narrow: [82, 300],
          kind3d: 'postgres',
          pos3d: [2.0, 1.6, -0.4],
        },
        {
          id: 'redis',
          label: 'Redis Pub/Sub',
          sublabel: 'fan-out',
          detail:
            'Redis Pub/Sub fans each event out across replicas, tagged with an origin node ID so that events do not loop back.',
          wide: [396, 196],
          narrow: [238, 300],
          kind3d: 'redis',
          pos3d: [1.5, -1.1, 0.3],
        },
        {
          id: 'replicas',
          label: 'Other replicas',
          sublabel: 'real-time delivery',
          detail:
            'Other backend replicas receive the fanned-out events, which is how real-time delivery is distributed across replicas.',
          wide: [570, 196],
          narrow: [238, 392],
          kind3d: 'replica',
          pos3d: [3.4, -0.4, -0.3],
        },
      ],
      edges: [
        { from: 'clients', to: 'gateway' },
        { from: 'gateway', to: 'service' },
        { from: 'service', to: 'postgres', label: '1 · persist' },
        { from: 'service', to: 'redis', label: '2 · publish' },
        { from: 'redis', to: 'replicas', label: 'fan-out', kind: 'async' },
      ],
    },
  },
  {
    id: 'deployx',
    title: 'DeployX',
    tagline: 'Self-Service Deployment Platform',
    tier: 'major',
    status: 'In Progress',
    repo: 'https://github.com/devtejasx/DeployX',
    tech: ['React', 'Node.js/Express', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'GitHub Actions'],
    summary:
      'A self-service platform that connects GitHub repositories to automated Docker-based builds and deployments.',
    bullets: [
      'Building a self-service platform that connects GitHub repositories to automated Docker-based builds and deployments.',
      'Designing a Redis-backed job queue for concurrent builds, with retries, failure handling, and deployment state tracking.',
      'Implementing health checks with automatic rollback to the last stable version, plus REST APIs and a dashboard for deployment history, real-time logs, and application status.',
    ],
    engineering: [
      'Redis-backed job queue',
      'Concurrent builds',
      'Retry handling',
      'Failure handling',
      'Deployment state tracking',
      'Health checks',
      'Automatic rollback',
      'REST APIs',
      'Deployment history',
      'Real-time logs',
      'Application status',
    ],
  },
  {
    id: 'api-testing',
    title: 'REST API Testing Suite',
    tagline: 'Reproducible, CI-enforced API regression testing',
    tier: 'supporting',
    repo: 'https://github.com/devtejasx/rest-api-testing-suite',
    tech: ['Node.js', 'PostgreSQL', 'Docker', 'GitHub Actions', 'Postman'],
    summary:
      'API tests are only useful if a failure means the code is wrong. This suite makes every run start from the same state and runs on every push.',
    bullets: [
      'Containerized the service and a seeded PostgreSQL test database with Docker for reproducible runs, eliminating false failures from local data drift.',
      'Automated schema, status-code, and response-time assertions across all endpoints, running on every push in GitHub Actions to catch regressions before merge.',
    ],
    story: [
      { label: 'Problem', text: 'Local data drift produced false test failures.' },
      {
        label: 'Approach',
        text: 'The service and a seeded PostgreSQL test database run in Docker, so every run starts from the same state.',
      },
      {
        label: 'Checks',
        text: 'Schema, status-code and response-time assertions across all endpoints.',
      },
      {
        label: 'Result',
        text: 'The suite runs on every push in GitHub Actions and catches regressions before merge.',
      },
    ],
  },
  {
    id: 'socket-server',
    title: 'Load-Balanced C++ Socket Server',
    tagline: 'Raw POSIX sockets behind an Nginx round-robin load balancer',
    tier: 'supporting',
    repo: 'https://github.com/devtejasx/cc-lab_6',
    tech: ['C++', 'POSIX sockets', 'Linux', 'Docker', 'Nginx', 'Jenkins'],
    summary:
      'An HTTP/1.1 server written on raw POSIX TCP sockets with no framework, run as two identical containers behind an Nginx load balancer and deployed by a Jenkins pipeline.',
    bullets: [
      'Wrote an HTTP/1.1 server on raw POSIX TCP sockets (socket, bind, listen, accept, recv/send) with no framework; it drains each request before replying, so clients never see a connection reset.',
      'Load-balanced two identical backend containers behind an Nginx upstream round-robin reverse proxy on a shared Docker network; each reply names its container (gethostname()), so request distribution is observable from the client.',
      'Automated deployment with an idempotent 3-stage Jenkins declarative pipeline: build image, run both backends, start and reload Nginx; built a custom Jenkins agent image that drives Docker through the host socket.',
    ],
    story: [
      {
        label: 'Server',
        text: 'A C++ HTTP/1.1 server on raw POSIX sockets (socket, bind, listen, accept, recv/send). It reads the whole request before replying, so clients never see a connection reset.',
      },
      {
        label: 'Load balancing',
        text: 'Two identical backend containers sit behind an Nginx upstream round-robin proxy on a shared Docker network.',
      },
      {
        label: 'Observable',
        text: 'Each reply names the container that served it (gethostname()), so the round-robin is visible from the client.',
      },
      {
        label: 'Deployment',
        text: 'An idempotent 3-stage Jenkins pipeline builds the image, runs both backends, and starts and reloads Nginx, from a custom agent image that drives Docker through the host socket.',
      },
    ],
  },
  {
    id: 'codecompass',
    title: 'CodeCompass',
    tagline: 'Guided learning platform for beginners in tech',
    tier: 'more',
    repo: 'https://github.com/devtejasx/CodeCompass',
    live: 'https://code-compass-dusky.vercel.app',
    tech: ['Next.js 15', 'TypeScript', 'PostgreSQL', 'Prisma', 'Auth.js', 'Docker'],
    summary:
      'Helps beginners choose a tech career and shows what to learn next. Its coding practice runs every submission in a throwaway, network-less container, so the app never executes learner code itself.',
    bullets: [],
  },
]

export const projectById = (id: string) => {
  const project = projects.find((p) => p.id === id)
  if (!project) throw new Error(`Unknown project: ${id}`)
  return project
}
