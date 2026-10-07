// The resume's "Projects" block. Diagram node text paraphrases the same bullets.

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
]
