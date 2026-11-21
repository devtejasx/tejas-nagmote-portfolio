import { useId } from 'react'
import { ArrowRight } from 'lucide-react'
import './MessagePath.css'

const W = 96
const H = 36

const nodes = [
  { id: 'a', x: 60, y: 36, label: 'Client A' },
  { id: 'api', x: 180, y: 36, label: 'REST · WS' },
  { id: 'svc', x: 300, y: 36, label: 'Service', accent: true },
  { id: 'redis', x: 180, y: 132, label: 'Redis Pub/Sub' },
  { id: 'pg', x: 300, y: 132, label: 'PostgreSQL' },
  { id: 'peer', x: 60, y: 132, label: 'Replica B' },
  { id: 'b', x: 60, y: 228, label: 'Client B' },
] as const

type Pt = [number, number]
const edges: {
  from: Pt
  to: Pt
  label?: string
  lx?: number
  ly?: number
  end?: boolean
  dashed?: boolean
}[] = [
  { from: [108, 36], to: [132, 36] },
  { from: [228, 36], to: [252, 36] },
  { from: [300, 54], to: [300, 114], label: '1 persist', lx: 308, ly: 88 },
  { from: [276, 54], to: [204, 114], label: '2 publish', lx: 226, ly: 92, end: true },
  { from: [132, 132], to: [108, 132], dashed: true },
  { from: [60, 150], to: [60, 210], label: 'deliver', lx: 68, ly: 184 },
]

/**
 * The hero visual: the Real-Time Chat Server's actual message path, drawn
 * small. Two dots trace a message being persisted, then fanned out to a
 * socket held by another replica. Motion stops for reduced-motion visitors.
 */
export function MessagePath() {
  const marker = useId()
  return (
    <figure className="mpath card">
      <figcaption className="mpath__bar">
        <span className="mono">realtime-chat-server</span>
        <span className="mpath__kind mono">message path</span>
      </figcaption>

      <svg
        className="mpath__svg"
        viewBox="0 0 360 260"
        role="img"
        aria-label="Message path: Client A to the REST and WebSocket gateway to the service layer, which persists to PostgreSQL first, then publishes on Redis Pub/Sub; replica B receives it and delivers to Client B."
      >
        <defs>
          <marker
            id={marker}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" className="mpath__arrow" />
          </marker>
        </defs>

        {edges.map((e, i) => (
          <g key={i}>
            <line
              x1={e.from[0]}
              y1={e.from[1]}
              x2={e.to[0]}
              y2={e.to[1]}
              className={`mpath__edge${e.dashed ? ' mpath__edge--dashed' : ''}`}
              markerEnd={`url(#${marker})`}
            />
            {e.label && (
              <text
                x={e.lx}
                y={e.ly}
                textAnchor={e.end ? 'end' : 'start'}
                className="mpath__edge-label"
              >
                {e.label}
              </text>
            )}
          </g>
        ))}

        {nodes.map((n) => (
          <g
            key={n.id}
            transform={`translate(${n.x - W / 2} ${n.y - H / 2})`}
            className={`mpath__node${'accent' in n ? ' mpath__node--accent' : ''}`}
          >
            <rect width={W} height={H} rx={7} />
            <text x={W / 2} y={H / 2 + 4} textAnchor="middle">
              {n.label}
            </text>
          </g>
        ))}

        <circle r="3.5" className="mpath__packet mpath__packet--persist" />
        <circle r="3.5" className="mpath__packet mpath__packet--fanout" />
      </svg>

      <div className="mpath__foot">
        <p>
          Persist first, then publish: each replica delivers to the sockets it holds. Load-tested at
          <strong> 9.7M frames delivered, zero 5xx</strong> on a two-replica cluster.
        </p>
        <a className="arrow-link" href="projects/realtime-chat-server/">
          Read the case study
          <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
    </figure>
  )
}
