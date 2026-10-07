// Shared by the WebGL scene and its CSS/SVG fallback so both draw the same system.

export type SceneNodeId = 'client' | 'api' | 'service' | 'redis' | 'postgres'

export interface SceneNode {
  id: SceneNodeId
  label: string
  position: [number, number, number]
  color: string
}

export const sceneNodes: SceneNode[] = [
  { id: 'client', label: 'Client', position: [-2.7, 1.0, 0.3], color: '#7cc4ff' },
  { id: 'api', label: 'API', position: [-1.0, 0.0, 0.9], color: '#5b8cff' },
  { id: 'service', label: 'Service', position: [0.8, 0.85, 0], color: '#8a7dff' },
  { id: 'redis', label: 'Redis', position: [2.45, 1.75, -0.7], color: '#a678ff' },
  { id: 'postgres', label: 'PostgreSQL', position: [2.3, -1.1, 0.25], color: '#5b8cff' },
]

/** Requests flow client → API → service, which persists to PostgreSQL and publishes to Redis. */
export const sceneEdges: [SceneNodeId, SceneNodeId][] = [
  ['client', 'api'],
  ['api', 'service'],
  ['service', 'redis'],
  ['service', 'postgres'],
]

/** Decorative code fragments floating around the graph (group-local positions). */
export const codeTags: { id: string; text: string; position: [number, number, number] }[] = [
  { id: 'tag-lock', text: 'std::scoped_lock', position: [-3.3, 2.15, -1.2] },
  { id: 'tag-ws', text: '101 Switching Protocols', position: [-2.5, -1.55, 0.4] },
  { id: 'tag-pub', text: 'PUBLISH', position: [3.15, 2.55, -1.6] },
  { id: 'tag-sql', text: 'INSERT … RETURNING', position: [3.2, -2.15, -0.6] },
  { id: 'tag-trace', text: 'traceparent: 00-…', position: [0.6, 2.75, -2.2] },
]

export const sceneDescription =
  'An animated system diagram: a client calls an API, which hands off to a service that publishes to Redis and persists to PostgreSQL.'
