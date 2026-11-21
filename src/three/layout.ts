// Shared by the WebGL scenes and their CSS/SVG fallbacks so both draw the same system.

export type NodeKind = 'client' | 'api' | 'service' | 'redis' | 'postgres' | 'replica'

export interface GraphNode {
  id: string
  kind: NodeKind
  label: string
  position: [number, number, number]
  color: string
}

export type GraphEdge = [from: string, to: string]

/**
 * The hero: the Real-Time Chat Server's message path. A client reaches the
 * API, the service persists to PostgreSQL and publishes to Redis, and Redis
 * fans the event out to the other backend replicas.
 */
export const sceneNodes: GraphNode[] = [
  { id: 'client', kind: 'client', label: 'Client', position: [-2.6, 0.9, 0.3], color: '#7cc4ff' },
  { id: 'api', kind: 'api', label: 'REST / WS', position: [-1.1, -0.05, 0.9], color: '#5b8cff' },
  {
    id: 'service',
    kind: 'service',
    label: 'C++ service',
    position: [0.4, 0.8, 0],
    color: '#8a7dff',
  },
  {
    id: 'postgres',
    kind: 'postgres',
    label: 'PostgreSQL',
    position: [0.9, -1.35, 0.4],
    color: '#5b8cff',
  },
  { id: 'redis', kind: 'redis', label: 'Redis', position: [1.85, 1.55, -0.5], color: '#a678ff' },
  {
    id: 'replica-a',
    kind: 'replica',
    label: 'Replica',
    position: [3.2, 2.35, -1.2],
    color: '#7d8cff',
  },
  {
    id: 'replica-b',
    kind: 'replica',
    label: 'Replica',
    position: [3.25, 0.55, -0.9],
    color: '#7d8cff',
  },
]

export const sceneEdges: GraphEdge[] = [
  ['client', 'api'],
  ['api', 'service'],
  ['service', 'postgres'],
  ['service', 'redis'],
  ['redis', 'replica-a'],
  ['redis', 'replica-b'],
]

/** Decorative code fragments floating around the graph (group-local positions). */
export const codeTags: { id: string; text: string; position: [number, number, number] }[] = [
  { id: 'tag-lock', text: 'std::scoped_lock', position: [-3.0, 2.1, -1.2] },
  { id: 'tag-ws', text: '101 Switching Protocols', position: [-1.7, -1.75, 0.4] },
  { id: 'tag-pub', text: 'PUBLISH', position: [2.25, 2.95, -1.6] },
  { id: 'tag-trace', text: 'traceparent: 00-…', position: [0.1, 2.65, -2.2] },
]

export const sceneDescription =
  'An animated system diagram: a client calls the REST and WebSocket API, a C++ service persists to PostgreSQL and publishes to Redis, and Redis fans events out to other backend replicas.'
