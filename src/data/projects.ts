// Projects on this site. Every claim is taken from the project's own README,
// docs and tests on GitHub (checked 2026-11-21); the case-study pages add the
// detail in caseStudies.ts.

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
  /** Shape and position in the optional 3D view (only the chat server has one). */
  kind3d?: NodeKind
  pos3d?: [number, number, number]
  tone?: 'accent' | 'warn'
}

export interface DiagramEdge {
  from: string
  to: string
  label?: string
  /** Dashed edges are asynchronous, or (warn) paths that are not validated. */
  kind?: 'flow' | 'async' | 'failure'
}

export interface Diagram {
  title: string
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  /** Cross-cutting concerns drawn as a band beneath the graph. */
  band?: string
  /** Shorter band text for the portrait layout. */
  bandNarrow?: string
}

export type ProjectKind = 'case-study' | 'project' | 'lab'

export interface Project {
  /** Also the case-study page slug: projects/<id>/. */
  id: string
  title: string
  tagline: string
  kind: ProjectKind
  status: { label: string; tone: 'ok' | 'warn' | 'accent' | 'neutral' }
  /** What kind of engineering it shows, used to filter the project list. */
  areas: ProjectArea[]
  repo: string
  /** Deployed demo, when there is one. */
  live?: string
  tech: string[]
  summary: string
  /** Up to three short proof points for the card, each traceable to the repo. */
  highlights: string[]
  diagram?: Diagram
}

export const projectAreas = [
  'C++ & systems',
  'Backend',
  'Infrastructure',
  'Full-stack',
  'Robotics',
] as const
export type ProjectArea = (typeof projectAreas)[number]

export const projects: Project[] = [
  {
    id: 'realtime-chat-server',
    title: 'Real-Time Chat Server',
    tagline: 'A C++20 messaging backend that scales out across replicas',
    kind: 'case-study',
    status: { label: 'Complete · CI passing', tone: 'ok' },
    areas: ['C++ & systems', 'Backend'],
    repo: 'https://github.com/devtejasx/realtime-chat-server',
    tech: [
      'C++20',
      'CMake',
      'Crow',
      'WebSockets',
      'PostgreSQL',
      'Redis',
      'Docker',
      'Prometheus',
      'GoogleTest',
    ],
    summary:
      'REST controllers and WebSocket handlers share one service layer, so every message takes one code path. Messages are persisted to PostgreSQL first, then fanned out to every replica through Redis Pub/Sub.',
    highlights: [
      '413 GoogleTest tests across 44 test files, run in GitHub Actions',
      '9 architecture decision records, each with the alternatives it rejected',
      'Load-tested on a 2-replica cluster: 91,220 requests, zero 5xx',
    ],
    diagram: {
      title: 'Real-Time Chat Server architecture',
      band: 'bcrypt · JWT · RBAC · rate limiting · circuit breakers · backoff · Prometheus · W3C tracing',
      bandNarrow: 'auth · resilience · observability',
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
            'Crow REST controllers and WebSocket handlers: the two ways clients reach the backend. Rate limiting and JWT checks happen here.',
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
            'REST controllers and WebSocket handlers share this one service layer, so every message takes the same code path whichever protocol it arrived on.',
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
            'The record. A message is persisted before it is broadcast; a GIN index serves full-text search, and keyset pagination keeps history reads fast at any depth.',
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
            'Each instance republishes events on a shared channel, tagged with its node ID; receivers drop their own, which suppresses loops.',
          wide: [396, 196],
          narrow: [238, 300],
          kind3d: 'redis',
          pos3d: [1.5, -1.1, 0.3],
        },
        {
          id: 'replicas',
          label: 'Other replicas',
          sublabel: 'local delivery',
          detail:
            'A WebSocket is pinned to the instance that accepted it. Peers receive the fanned-out event and deliver it to the sockets they hold.',
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
    tagline: 'A self-service deployment platform with automatic rollback',
    kind: 'case-study',
    status: { label: 'Validated locally · AWS target untested', tone: 'warn' },
    areas: ['Backend', 'Infrastructure'],
    repo: 'https://github.com/devtejasx/DeployX',
    tech: ['Node.js', 'Express 5', 'PostgreSQL', 'Redis', 'BullMQ', 'Docker', 'React 19', 'SSE'],
    summary:
      'Connect a GitHub repository and every push becomes a deployment of that exact commit: built into a Docker image, started, health-checked, and rolled back to the last stable version if it is unhealthy.',
    highlights: [
      'Deployment state machine enforced by a PostgreSQL trigger',
      '382 API + 38 dashboard + 11 Docker end-to-end tests passing',
      'Stable version served 190 of 190 requests through a failed release',
    ],
    diagram: {
      title: 'DeployX architecture',
      band: 'PostgreSQL state machine · HMAC webhooks · SSE live logs · health check + automatic rollback',
      bandNarrow: 'state machine · health check · rollback',
      nodes: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          sublabel: 'React · SSE',
          detail:
            'The React dashboard shows deployment history and streams status and log lines live over Server-Sent Events, resuming with Last-Event-ID after a reconnect.',
          wide: [72, 50],
          narrow: [82, 36],
        },
        {
          id: 'github',
          label: 'GitHub',
          sublabel: 'push webhook',
          detail:
            'A push webhook starts a deployment. Its HMAC signature is verified in constant time on the raw body before it is parsed, and duplicate deliveries are ignored.',
          wide: [72, 150],
          narrow: [238, 36],
        },
        {
          id: 'api',
          label: 'API',
          sublabel: 'Express 5',
          detail:
            'The API never does deployment work: it records the deployment, queues a job whose ID is the deployment ID, and returns in milliseconds.',
          wide: [236, 100],
          narrow: [160, 122],
          tone: 'accent',
        },
        {
          id: 'postgres',
          label: 'PostgreSQL',
          sublabel: 'source of truth',
          detail:
            'Every status change goes through a transition table and a trigger that rejects anything else, so SUCCESS without a passed health check cannot be written by any client.',
          wide: [404, 50],
          narrow: [82, 208],
        },
        {
          id: 'redis',
          label: 'Redis',
          sublabel: 'BullMQ · Pub/Sub',
          detail:
            'BullMQ holds the job queue; Pub/Sub carries status and log events from the worker back to the API, which relays them to browsers.',
          wide: [404, 150],
          narrow: [238, 208],
        },
        {
          id: 'worker',
          label: 'Worker',
          sublabel: 'Node.js',
          detail:
            'Takes jobs two at a time: clones the exact commit, builds the image, starts it, health-checks it, then releases it or restores the last stable version.',
          wide: [568, 100],
          narrow: [160, 294],
          tone: 'accent',
        },
        {
          id: 'docker',
          label: 'App containers',
          sublabel: 'local Docker host',
          detail:
            'Deployed apps run unprivileged: --cap-drop ALL, no mounts, no DeployX variables. The previous version keeps serving until the new one is healthy.',
          wide: [568, 230],
          narrow: [82, 380],
        },
        {
          id: 'aws',
          label: 'AWS ECR/ECS',
          sublabel: 'fakes only',
          detail:
            'The AWS target implements the same publish / deploy / restore interface, but it has only been tested against fake AWS endpoints, never real AWS. That is the gate for a v1.0.0 release.',
          wide: [404, 250],
          narrow: [238, 380],
          tone: 'warn',
        },
      ],
      edges: [
        { from: 'dashboard', to: 'api', label: 'session' },
        { from: 'github', to: 'api', label: 'webhook' },
        { from: 'api', to: 'postgres', label: 'SQL' },
        { from: 'api', to: 'redis', label: 'enqueue' },
        { from: 'redis', to: 'worker', label: 'job', kind: 'async' },
        { from: 'worker', to: 'postgres', label: 'status + logs' },
        { from: 'worker', to: 'docker', label: 'deploy' },
        { from: 'worker', to: 'aws', kind: 'failure' },
      ],
    },
  },
  {
    id: 'codecompass',
    title: 'CodeCompass',
    tagline: 'A learning platform that runs learner code in a sandbox',
    kind: 'case-study',
    status: { label: 'Live', tone: 'ok' },
    areas: ['Full-stack', 'Infrastructure'],
    repo: 'https://github.com/devtejasx/CodeCompass',
    live: 'https://code-compass-dusky.vercel.app',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'PostgreSQL', 'Prisma', 'Auth.js', 'Docker'],
    summary:
      'Guides beginners from choosing a tech career to a roadmap, lessons and 300 coding problems in five languages. Submissions are compiled and run in a throwaway, network-less container; the web app never executes learner code itself.',
    highlights: [
      'A test fails if the execution module gains any way to run code in-process',
      '27-case sandbox suite: network, filesystem, privilege, memory, time limit',
      'Dashboard shell flushes in ~60 ms by streaming slow panels separately',
    ],
    diagram: {
      title: 'CodeCompass code-execution path',
      band: 'learner code never runs in the app process · answer keys never reach the browser · every message scrubbed',
      bandNarrow: 'isolated · fail closed · scrubbed',
      nodes: [
        {
          id: 'browser',
          label: 'Browser',
          sublabel: 'Monaco editor',
          detail:
            'Sends code, problem and language. It only ever receives verdicts, and failure detail for visible test cases.',
          wide: [72, 60],
          narrow: [160, 36],
        },
        {
          id: 'app',
          label: 'Next.js action',
          sublabel: 'server only',
          detail:
            'Hidden tests and the reference solution are read here and go no further. The response is validated and re-keyed against this test list, so a reply that invents or omits cases cannot change the grade.',
          wide: [236, 60],
          narrow: [82, 122],
          tone: 'accent',
        },
        {
          id: 'service',
          label: 'Execution service',
          sublabel: 'bounded queue',
          detail:
            'A separate deployable with no npm dependencies, called over HTTPS with a bearer token and a 20-second abort. It holds the queue and drives the container runtime.',
          wide: [404, 60],
          narrow: [82, 208],
        },
        {
          id: 'sandbox',
          label: 'Runner container',
          sublabel: 'no network · non-root',
          detail:
            'One throwaway container per submission: no network, no secrets, read-only, non-root. It compiles, runs and writes results; it never gets the container runtime.',
          wide: [568, 60],
          narrow: [82, 294],
          tone: 'warn',
        },
        {
          id: 'postgres',
          label: 'PostgreSQL',
          sublabel: 'Prisma',
          detail:
            'Stores the submission and progress after paths, URLs, addresses, container IDs and anything secret-shaped are scrubbed from compiler and runtime output.',
          wide: [236, 180],
          narrow: [238, 122],
        },
      ],
      edges: [
        { from: 'browser', to: 'app', label: 'code' },
        { from: 'app', to: 'service', label: 'HTTPS' },
        { from: 'service', to: 'sandbox', label: 'run', kind: 'async' },
        { from: 'app', to: 'postgres', label: 'verdict' },
      ],
    },
  },
  {
    id: 'rest-api-testing-suite',
    title: 'REST API Testing Suite',
    tagline: 'Reproducible, CI-enforced API regression testing',
    kind: 'project',
    status: { label: 'Complete', tone: 'neutral' },
    areas: ['Backend'],
    repo: 'https://github.com/devtejasx/rest-api-testing-suite',
    tech: ['TypeScript', 'Express', 'PostgreSQL', 'Prisma', 'Postman/Newman', 'Docker'],
    summary:
      'The service and a seeded PostgreSQL test database run in Docker, so every run starts from the same state; schema, status-code and response-time assertions run on every push in GitHub Actions.',
    highlights: [],
  },
  {
    id: 'socket-server',
    title: 'Load-Balanced C++ Socket Server',
    tagline: 'Raw POSIX sockets behind Nginx, deployed by Jenkins',
    kind: 'lab',
    status: { label: 'Course lab', tone: 'neutral' },
    areas: ['C++ & systems', 'Infrastructure'],
    repo: 'https://github.com/devtejasx/cc-lab_6',
    tech: ['C++', 'POSIX sockets', 'Nginx', 'Docker', 'Jenkins'],
    summary:
      'A minimal HTTP server on socket/bind/listen/accept, with no framework; two instances behind an Nginx round-robin upstream, each reply naming the container that served it, built and deployed by a three-stage Jenkins pipeline.',
    highlights: [],
  },
  {
    id: 'cleaning-robot',
    title: 'Autonomous Cleaning Robot',
    tagline: 'ROS 2 coverage and obstacle bypass in Gazebo',
    kind: 'project',
    status: { label: 'Simulation', tone: 'neutral' },
    areas: ['Robotics'],
    repo: 'https://github.com/devtejasx/Autonomous-Room-Cleaning-Robot-Simulation-',
    tech: ['ROS 2', 'Gazebo', 'Python', 'LiDAR', 'URDF/SDF'],
    summary:
      'A ROS 2 control node on a 10 Hz loop sweeps a room row by row from LiDAR and odometry, with a four-step state machine that steps around obstacles and rejoins the row; 16 unit tests cover the state machine.',
    highlights: [],
  },
  {
    id: 'arise',
    title: 'ARISE — Discipline Quest',
    tagline: 'Gamified task and habit tracker',
    kind: 'project',
    status: { label: 'Live', tone: 'ok' },
    areas: ['Full-stack'],
    repo: 'https://github.com/devtejasx/Daily-Task-manager',
    live: 'https://daily-task-manager-frontend-kappa.vercel.app',
    tech: ['React 18', 'Vite', 'Firebase', 'Firestore', 'PWA', 'Vitest'],
    summary:
      'Turns tasks into XP and ranks and rewards consistency over perfection. Firestore cloud sync with offline persistence, installable as a PWA.',
    highlights: [],
  },
]

export const caseStudyProjects = projects.filter((p) => p.kind === 'case-study')
export const otherProjects = projects.filter((p) => p.kind !== 'case-study')

export const projectById = (id: string) => {
  const project = projects.find((p) => p.id === id)
  if (!project) throw new Error(`Unknown project: ${id}`)
  return project
}

/** Path of a case-study page, relative to the site root. */
export const caseStudyPath = (id: string) => `projects/${id}/`
