// Case-study content for the three featured projects. Sources, all in the
// project repositories (checked 2026-11-21):
//   realtime-chat-server: README, docs/adr/0001-0009, docs/Performance.md,
//     docs/performance/results-2026-08-06.md, tests/, .github/workflows
//   DeployX: README, docs/PROJECT_OVERVIEW.md, docs/PHASE9_VALIDATION.md
//   CodeCompass: README, docs/code-execution.md
// Measurements are quoted with the conditions they were taken under. Nothing
// here is an estimate or a target presented as a result.

export interface Decision {
  title: string
  why: string
  /** What was considered and rejected, when the project records it. */
  rejected?: string
}

export interface Challenge {
  challenge: string
  solution: string
}

export interface Metric {
  value: string
  label: string
}

export interface CaseStudy {
  projectId: string
  /** One paragraph each. */
  overview: string[]
  problem: string[]
  facts: Metric[]
  decisions: Decision[]
  challenges: Challenge[]
  testing: { summary: string; layers: { label: string; detail: string }[] }
  performance?: {
    conditions: string
    metrics: Metric[]
    takeaway: string
  }
  limitations: string[]
  /** Documents in the repository that back this page. */
  sources: { label: string; path: string }[]
}

export const caseStudies: CaseStudy[] = [
  {
    projectId: 'realtime-chat-server',
    overview: [
      'A chat backend in modern C++20, built milestone by milestone: direct and group conversations, presence, typing indicators, read receipts, reactions and PostgreSQL full-text search, over a REST API and a WebSocket protocol.',
      'It runs as N stateless instances behind Nginx with shared PostgreSQL and Redis, and ships with Prometheus metrics, W3C trace propagation, a Grafana/Jaeger observability stack, and Docker Compose files for development, clustering and production.',
    ],
    problem: [
      'A WebSocket connection is pinned to whichever instance accepted it. With more than one replica, the instance that handles a write is usually not the one holding the recipient’s socket.',
      'Nothing errors when that happens: the message is saved, the sender sees it, and the recipient only finds it on reload. Every single-instance test passes. The project had to make cross-replica delivery correct, and make that failure visible in tests, while keeping one code path for REST and WebSocket traffic.',
    ],
    facts: [
      { value: '413', label: 'GoogleTest tests in CI' },
      { value: '9', label: 'architecture decision records' },
      { value: '0', label: '5xx across 91,220 load-test requests' },
      { value: '9.7M', label: 'WebSocket frames delivered in the fan-out test' },
    ],
    decisions: [
      {
        title: 'One service layer under REST and WebSocket',
        why: 'Controllers and socket handlers are thin adapters over the same services, so validation, authorization and persistence happen once for every message, whichever protocol it arrived on.',
      },
      {
        title: 'Redis Pub/Sub for cross-instance fan-out, with node-ID loop suppression',
        why: 'After delivering locally, each instance republishes the event; peers deliver it to the sockets they hold and drop events carrying their own node ID.',
        rejected:
          'Sticky sessions (do nothing for two users on two instances), a durable broker for realtime frames (durability costs latency, and PostgreSQL is already the record), and an instance-to-instance mesh (service discovery and O(n²) links for no gain at this scale).',
      },
      {
        title: 'Persist first, broadcast second',
        why: 'A message is written to PostgreSQL, together with the conversation’s last_message_at in one transaction, before it is broadcast. A reconnecting client re-reads the database, so a lost realtime frame never loses a message.',
      },
      {
        title: 'Authorization read from the database, not the JWT',
        why: 'Roles and ban state are checked against PostgreSQL behind a 30-second cache. A role claim in a token stays valid until the token expires, so a banned user would keep access for the rest of the access-token lifetime.',
        rejected: 'Role claims in the JWT, and a token denylist (a per-request lookup anyway).',
      },
      {
        title: 'Circuit breaker wrapping retry',
        why: 'Bounded exponential backoff with jitter handles blips; a Closed/Open/HalfOpen breaker stops threads piling up on a dependency that is down. Both sit at single choke points: the repository transaction helper and the cache service.',
      },
    ],
    challenges: [
      {
        challenge: 'Cross-replica delivery fails silently',
        solution:
          'Added Redis fan-out with origin-node tagging, and a two-instance test suite: messages, room broadcasts, notifications, presence and cache invalidation must cross to the other instance, and an instance must never re-broadcast what it received.',
      },
      {
        challenge: 'A slow database can take the whole service down',
        solution:
          'Threads blocked on a dead dependency fill the worker pool and stall unrelated endpoints. The breaker opens after consecutive failures and fails fast until a half-open probe succeeds.',
      },
      {
        challenge: 'Knowing where a slow request spent its time across instances',
        solution:
          'Every request carries a W3C traceparent through HTTP and the event bus, log lines are correlated with the trace ID, and Prometheus exposes request, database, cache, WebSocket and background-job metrics.',
      },
      {
        challenge: 'Typing and presence would hit the database on every keystroke',
        solution:
          'A RoomManager routes high-frequency signals to a conversation’s online members in memory, and broadcast payloads are serialised once and reused for every target session.',
      },
    ],
    testing: {
      summary:
        '413 GoogleTest tests across 44 test files run on every push in GitHub Actions, next to coverage, lint, CodeQL and Docker image builds.',
      layers: [
        {
          label: 'Unit',
          detail:
            'Services, JWT, password hashing, RBAC, rate limiter, circuit breaker and retry, event bus, cache store, config.',
        },
        {
          label: 'Integration',
          detail:
            'A live HTTP server, the messaging flow end to end, cluster broadcast across instances, distributed presence.',
        },
        {
          label: 'Contract',
          detail:
            'Request and response payloads are checked against the OpenAPI schemas: required fields, enums and every documented example.',
        },
        {
          label: 'Performance',
          detail:
            'Google Benchmark microbenchmarks for JWT, authorization, cache, event bus and protocol codecs, plus k6 load scenarios for auth, messaging, WebSocket fan-out and uploads.',
        },
      ],
    },
    performance: {
      conditions:
        'First recorded run, 2026-08-06, on a developer laptop (Core i7-1360P): a 2-instance cluster behind Nginx, with PostgreSQL, Redis, the observability stack and the k6 load generator on the same machine. Latency figures from this setup are pessimistic; the throughput ceilings are what it shows.',
      metrics: [
        { value: '91,220', label: 'HTTP requests served, zero 5xx' },
        { value: '24,945/s', label: 'WebSocket frames delivered (9.73M from 59,561 sent)' },
        { value: '~242 req/s', label: 'messaging ceiling, bound by PostgreSQL, not the app' },
        { value: '~65 req/s', label: 'auth ceiling, bound by bcrypt by design' },
        { value: '275 ns', label: 'cached authorization check, vs 1,724 ns cold' },
        { value: '~24 µs', label: 'JWT verification' },
      ],
      takeaway:
        'At saturation PostgreSQL held ~492% CPU while each app instance stayed near 130%, and no event was dropped. The next step recorded in the report is raising the connection pool from 8 per instance and re-running the messaging scenario.',
    },
    limitations: [
      'Measured on one laptop, not a dedicated benchmarking host; the report marks its noisy rows.',
      'Fan-out is at-most-once: an instance that is down when an event is published misses it, and its clients recover by re-reading PostgreSQL.',
    ],
    sources: [
      { label: 'Architecture decision records', path: 'docs/adr' },
      { label: 'Performance results, 2026-08-06', path: 'docs/performance/results-2026-08-06.md' },
      { label: 'Test suite', path: 'tests' },
    ],
  },
  {
    projectId: 'deployx',
    overview: [
      'A self-service deployment platform. A GitHub push, or a click, becomes a deployment of that exact commit: the worker clones it, builds a Docker image, starts it, health-checks it over HTTP, and either releases it or restores the last stable version, streaming every step to a dashboard.',
      'It has accounts, sessions, ADMIN/USER authorization, an audit log, rate limits, Prometheus metrics and alert rules, and was built in nine phases ending in a real-environment validation run.',
    ],
    problem: [
      'Shipping a service repeats the same steps every release: build from the right commit, start it, check that it works, and put the previous version back when it does not. A script that only runs docker run lets a bad release replace a good one, and users see the outage before anyone notices.',
    ],
    facts: [
      { value: '382', label: 'API, worker, security and reliability tests' },
      { value: '11', label: 'Docker end-to-end tests: real clone, build, run, rollback' },
      { value: '78/78', label: 'live security checks against the running stack' },
      { value: '12.85 s', label: 'push to SUCCESS, measured in validation' },
    ],
    decisions: [
      {
        title: 'The API never deploys; a queue and a worker do',
        why: 'Requests return in milliseconds and a slow build never blocks the API. The job ID is the deployment ID, so re-queuing the same deployment is a no-op, and a stalled job is handed to another worker.',
      },
      {
        title: 'The state machine lives in PostgreSQL',
        why: 'A transition table and a trigger reject every other status change. The API, the worker and a manual SQL update all obey the same rules, so SUCCESS without a passed health check is impossible rather than unlikely.',
      },
      {
        title: 'The previous version runs until the new one is healthy',
        why: 'A failed release costs no downtime: rollback verifies the version that never stopped, or restarts it from its image ID, instead of rebuilding anything.',
      },
      {
        title: '“Stable” is derived, not stored',
        why: 'The stable version is the newest successful deployment of a project. There is no flag to keep in sync, and a rollback never rewrites history.',
      },
      {
        title: 'One pipeline, two targets',
        why: 'The local Docker target and the AWS ECS target implement the same publish, deploy and restore interface, so they share the build, health-check and rollback code. AWS deployments of one project are serialised by a PostgreSQL advisory lock.',
      },
    ],
    challenges: [
      {
        challenge: 'Live logs without gaps or duplicates',
        solution:
          'Log lines travel over Redis Pub/Sub to an SSE endpoint. Last-Event-ID resumes a reconnect exactly where it stopped, and the stream re-reads PostgreSQL periodically, so a lost Redis event only delays a line.',
      },
      {
        challenge: 'A status could appear before its log line',
        solution:
          'A reader could see SUCCESS before the line that explained it. Status and log are now written in one SQL statement, so they become visible together.',
      },
      {
        challenge: 'Every input from outside is untrusted',
        solution:
          'Webhook HMACs are checked in constant time on the raw body; only a SHA-256 of each session token is stored; app containers run with --cap-drop ALL, --pull never and no mounts; health checks refuse private and cloud-metadata addresses.',
      },
      {
        challenge: 'Surviving infrastructure failures mid-deployment',
        solution:
          'The validation run killed the worker, PostgreSQL and Redis during deployments, dropped jobs and timed out GitHub. Each case recovered, and the report records how.',
      },
    ],
    testing: {
      summary:
        'Tests run against real PostgreSQL and Redis. Only the edges are faked: HTTP servers stand in for containers, and fake endpoints stand in for AWS.',
      layers: [
        {
          label: 'API & worker',
          detail:
            '382 node:test tests covering routes, the queue, the worker, the state machine, SSE, security and reliability.',
        },
        {
          label: 'Dashboard',
          detail: '38 Vitest + Testing Library tests, including contrast and live-region checks.',
        },
        {
          label: 'End to end',
          detail:
            '11 opt-in Docker tests: a real clone from GitHub, image build, container run, health check and rollback.',
        },
        {
          label: 'Validation',
          detail:
            'Real GitHub webhooks, concurrent deployments, injected outages, SSE reconnects in a browser, backup and restore, and 78 live security checks.',
        },
      ],
    },
    performance: {
      conditions:
        'Phase 9 validation on the local Docker Compose stack, 2026-10-13. API latencies were measured sequentially through Nginx.',
      metrics: [
        { value: '12.85 s', label: 'deployment from queue to SUCCESS' },
        { value: '10 ms', label: 'p95 live-log delivery to the browser' },
        { value: '3.6–7.7 ms', label: 'API p95 for health, projects, deployments, logs' },
        {
          value: '190/190',
          label: 'requests served by the stable version during a failed release',
        },
      ],
      takeaway:
        'The repeatable demo (healthy deploy, failed health check, automatic rollback, stable version still serving) passed three times at 32–33 s each.',
    },
    limitations: [
      'The Amazon ECR/ECS target has only been run against fake endpoints. Real AWS is the release gate, so there is no v1.0.0 yet.',
      'The worker drives the host Docker daemon, which is root-equivalent there. Untrusted code would need a dedicated build host or rootless BuildKit; a socket proxy was tried and breaks BuildKit.',
    ],
    sources: [
      { label: 'Project overview', path: 'docs/PROJECT_OVERVIEW.md' },
      { label: 'Phase 9 validation report', path: 'docs/PHASE9_VALIDATION.md' },
      { label: 'Architecture', path: 'docs/ARCHITECTURE.md' },
    ],
  },
  {
    projectId: 'codecompass',
    overview: [
      'A guided learning platform for people new to tech: choose a career, follow a roadmap of phases and topics, take lessons with knowledge checks, and practise on 300 authored problems (91 easy, 169 medium, 40 hard) across 31 topics in five languages.',
      'Practice submissions are compiled and run for real, each in a throwaway container. Feedback on a wrong answer is rule-based and names the difference, such as values right but in the wrong order, or off by one.',
    ],
    problem: [
      'Grading code means running hostile input. The app had to compile and run submissions in five languages without executing them in its own process, and without hidden test cases or reference solutions ever reaching the browser.',
    ],
    facts: [
      { value: '300', label: 'authored problems, counted from the database by a test' },
      { value: '5', label: 'languages from one problem signature' },
      { value: '27', label: 'sandbox escape and limit cases' },
      { value: '~60 ms', label: 'dashboard shell flush on the production build' },
    ],
    decisions: [
      {
        title: 'Learner code never runs in the application',
        why: 'Code crosses a network boundary to an execution service whose only job is to contain it, and only a verdict comes back. A test reads the execution module’s source and fails on any use of eval, vm, child_process or similar.',
      },
      {
        title: 'Fail closed by default',
        why: 'The default provider runs nothing and the UI disables Run and Submit and says why. The development provider returns clearly labelled simulated verdicts and is refused when NODE_ENV is production.',
      },
      {
        title: 'The grade is decided by the app’s own test list',
        why: 'Service responses are schema-validated and re-keyed against the tests the app sent, so a reply that invents or omits cases cannot change how many tests a learner is graded on.',
      },
      {
        title: 'Answer keys are never fetched for the page',
        why: 'Hidden cases and reference solutions are excluded from every query that feeds a page. The explanation is not fetched until after a first attempt, so “unlocks after your first submission” is true of the payload, not just the UI.',
      },
      {
        title: 'Starter code is generated from one signature',
        why: 'Each problem declares a signature and test cases as JSON, so one authored case runs under every language harness; adding a language is one template.',
      },
    ],
    challenges: [
      {
        challenge: 'The dashboard waited on its slowest query',
        solution:
          'It awaited four reads before rendering anything. It now awaits only the next-step guidance and streams the other panels behind separate Suspense boundaries: the shell flushes at ~60 ms and the full response completes at ~215 ms.',
      },
      {
        challenge: 'Animation code in the bundle for simple fades',
        solution:
          'Four components shipped Framer Motion for opacity and height changes. Two CSS utilities replaced them: /roadmap went from 162 kB to 118 kB and /careers from 166 kB to 122 kB.',
      },
      {
        challenge: 'Every keystroke reconfigured the editor',
        solution:
          'Monaco’s options object was rebuilt on each render and diffed by identity. It is memoised on the two values that can actually change.',
      },
      {
        challenge: 'Compiler output can leak internals',
        solution:
          'Paths, URLs, IP addresses, container IDs and anything shaped like a secret are scrubbed from compiler and runtime messages before they are stored or shown.',
      },
    ],
    testing: {
      summary:
        'Vitest runs against a separate PostgreSQL test database. Tests pin answers and query counts, not durations, so they pass on any machine.',
      layers: [
        {
          label: 'Catalog',
          detail:
            'Problem, topic and language counts are computed from the seeded database, not written by hand.',
        },
        {
          label: 'Isolation rule',
          detail:
            'A source-reading test enforces that the execution module never runs code in-process.',
        },
        {
          label: 'Sandbox',
          detail:
            '27 cases against a live execution service: reaching the network, reading the host filesystem, escalating privileges, exhausting memory, outliving the time limit.',
        },
        {
          label: 'Performance guards',
          detail:
            'An instrumented Prisma client pins the number of queries per page and the shape of each payload.',
        },
      ],
    },
    performance: {
      conditions:
        'Measured against the production build with a local PostgreSQL; the deferred-panel win grows with database latency.',
      metrics: [
        { value: '~60 ms', label: 'dashboard shell flush' },
        { value: '~215 ms', label: 'full dashboard response' },
        { value: '−44 kB', label: '/roadmap and /careers JavaScript each' },
      ],
      takeaway:
        'Each slow path was fixed at its structure (what the page waits on, what ships to the browser, what re-renders) rather than by shaving milliseconds.',
    },
    limitations: [
      'The sandbox suite needs Docker, so it is not part of the CI run; running it against a live service is part of the definition of done for a deployment.',
    ],
    sources: [
      { label: 'Code execution design', path: 'docs/code-execution.md' },
      { label: 'README: coding practice and performance', path: 'README.md' },
    ],
  },
]

export const caseStudyFor = (projectId: string) => {
  const study = caseStudies.find((c) => c.projectId === projectId)
  if (!study) throw new Error(`No case study for ${projectId}`)
  return study
}
