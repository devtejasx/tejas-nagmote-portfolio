// Types shared by the optional 3D architecture view and the project data.

export type NodeKind = 'client' | 'api' | 'service' | 'redis' | 'postgres' | 'replica'

export interface GraphNode {
  id: string
  kind: NodeKind
  label: string
  position: [number, number, number]
  color: string
}

export type GraphEdge = [from: string, to: string]
