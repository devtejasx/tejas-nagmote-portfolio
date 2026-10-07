import { useMemo, useState, type RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { Vector3 } from 'three'
import { GraphLinks, GraphNodeMesh } from './graph'
import { LabelProjector } from './labels'
import type { GraphEdge, GraphNode } from './layout'

export interface ArchitectureSceneProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  selected: string
  onSelect: (id: string) => void
  frameloop: 'always' | 'demand' | 'never'
  reducedMotion: boolean
  labelLayer: RefObject<HTMLDivElement | null>
}

/** A gentle orbit that follows the pointer while it is over the canvas. */
function OrbitRig({ reduced }: { reduced: boolean }) {
  const target = useMemo(() => new Vector3(0.1, 0.2, 0), [])
  useFrame((state, delta) => {
    if (reduced) return
    const { camera, pointer } = state
    const k = 1 - Math.exp(-2.2 * delta)
    camera.position.x += (pointer.x * 1.4 - camera.position.x) * k
    camera.position.y += (1.2 + pointer.y * 0.9 - camera.position.y) * k
    camera.lookAt(target)
  })
  return null
}

/**
 * The chat server's architecture in 3D: click a component to read what it
 * does. Shares nodes, links and labels with the hero scene.
 */
export default function ArchitectureScene({
  nodes,
  edges,
  selected,
  onSelect,
  frameloop,
  reducedMotion,
  labelLayer,
}: ArchitectureSceneProps) {
  const [maxDpr, setMaxDpr] = useState(1.75)

  return (
    <Canvas
      className="arch3d__canvas"
      frameloop={frameloop}
      dpr={[1, maxDpr]}
      camera={{ position: [0, 1.2, 6.9], fov: 42, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <PerformanceMonitor onDecline={() => setMaxDpr(1)} />
      <ambientLight intensity={0.45} />
      <pointLight position={[3, 4, 5]} intensity={40} color="#5b8cff" />
      <pointLight position={[-4, -2, 4]} intensity={26} color="#9d6bff" />
      <OrbitRig reduced={reducedMotion} />
      <LabelProjector layer={labelLayer}>
        <GraphLinks nodes={nodes} edges={edges} reduced={reducedMotion} highlight={selected} />
        {nodes.map((node, i) => (
          <GraphNodeMesh
            key={node.id}
            node={node}
            index={i}
            reduced={reducedMotion}
            selected={node.id === selected}
            onSelect={onSelect}
          />
        ))}
      </LabelProjector>
      <gridHelper
        args={[24, 24, '#243056', '#121830']}
        position={[0, -2.4, 0]}
        onUpdate={(grid) => {
          grid.material.transparent = true
          grid.material.opacity = 0.35
        }}
      />
    </Canvas>
  )
}
