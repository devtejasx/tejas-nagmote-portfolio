import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { QuadraticBezierLine } from '@react-three/drei'
import {
  MathUtils,
  Object3D,
  QuadraticBezierCurve3,
  Vector3,
  type Group,
  type InstancedMesh,
} from 'three'
import { useLabels } from './labelContext'
import { NodeShape } from './NodeShape'
import type { GraphEdge, GraphNode } from './layout'

type BezierLineRef = { material: { dashOffset: number } } | null

const PACKETS_PER_EDGE = 2

function edgeCurve(from: GraphNode, to: GraphNode) {
  const start = new Vector3(...from.position)
  const end = new Vector3(...to.position)
  const mid = start
    .clone()
    .lerp(end, 0.5)
    .add(new Vector3(0, 0.55, 0.35))
  return new QuadraticBezierCurve3(start, mid, end)
}

interface NodeProps {
  node: GraphNode
  index: number
  reduced: boolean
  selected?: boolean
  /** Makes the node clickable (pointer cursor, click selects). */
  onSelect?: (id: string) => void
}

/** One floating system component with hover and (optionally) click-to-select. */
export function GraphNodeMesh({ node, index, reduced, selected = false, onSelect }: NodeProps) {
  const ref = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const { invalidate, gl } = useThree()
  const labels = useLabels()
  const lit = hovered || selected

  // Keep the DOM label's highlight in step with hover and selection.
  useEffect(() => {
    labels.setActive(node.id, lit)
    invalidate()
  }, [labels, node.id, lit, invalidate])

  useFrame((state, delta) => {
    const g = ref.current
    if (!g) return
    const bob = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.9 + index * 1.3) * 0.09
    g.position.set(node.position[0], node.position[1] + bob, node.position[2])
    const target = lit ? 1.15 : 1
    g.scale.setScalar(reduced ? target : MathUtils.damp(g.scale.x, target, 8, delta))
    if (!reduced) g.rotation.y += delta * (lit ? 0.7 : 0.22)
  })

  const setHover = (value: boolean) => {
    setHovered(value)
    if (onSelect) gl.domElement.style.cursor = value ? 'pointer' : ''
    invalidate()
  }

  return (
    <group
      ref={ref}
      position={node.position}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHover(true)
      }}
      onPointerOut={() => setHover(false)}
      onClick={
        onSelect
          ? (e) => {
              e.stopPropagation()
              onSelect(node.id)
            }
          : undefined
      }
    >
      <NodeShape kind={node.kind} color={node.color} hovered={lit} />
      <group position={[0, -0.82, 0]} ref={labels.anchor(node.id)} />
    </group>
  )
}

/** Dashed links between nodes, with packets travelling along each one. */
export function GraphLinks({
  nodes,
  edges,
  reduced,
  highlight,
}: {
  nodes: GraphNode[]
  edges: GraphEdge[]
  reduced: boolean
  /** Node id whose links draw brighter. */
  highlight?: string
}) {
  const curves = useMemo(() => {
    const byId = new Map(nodes.map((n) => [n.id, n]))
    return edges.map(([a, b]) => ({ a, b, curve: edgeCurve(byId.get(a)!, byId.get(b)!) }))
  }, [nodes, edges])
  const lines = useRef<BezierLineRef[]>([])
  const packets = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const point = useMemo(() => new Vector3(), [])

  useFrame((state, delta) => {
    if (!reduced) {
      for (const line of lines.current) if (line) line.material.dashOffset -= delta * 0.6
    }
    const mesh = packets.current
    if (!mesh) return
    const t = reduced ? 0.35 : state.clock.elapsedTime
    curves.forEach(({ curve }, i) => {
      for (let k = 0; k < PACKETS_PER_EDGE; k++) {
        const p = (t * 0.24 + k / PACKETS_PER_EDGE + i * 0.17) % 1
        curve.getPoint(p, point)
        dummy.position.copy(point)
        dummy.scale.setScalar(0.5 + Math.sin(p * Math.PI) * 0.8)
        dummy.updateMatrix()
        mesh.setMatrixAt(i * PACKETS_PER_EDGE + k, dummy.matrix)
      }
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      {curves.map(({ a, b, curve }, i) => {
        const bright = highlight !== undefined && (a === highlight || b === highlight)
        return (
          <QuadraticBezierLine
            key={`${a}-${b}`}
            ref={(el) => {
              lines.current[i] = el as unknown as BezierLineRef
            }}
            start={curve.v0}
            mid={curve.v1}
            end={curve.v2}
            color={bright ? '#b9cbff' : '#6f8fff'}
            lineWidth={bright ? 2 : 1.3}
            dashed
            dashSize={0.16}
            gapSize={0.1}
            transparent
            opacity={bright ? 0.95 : 0.55}
          />
        )
      })}
      <instancedMesh
        ref={packets}
        args={[undefined, undefined, curves.length * PACKETS_PER_EDGE]}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#d6e4ff" toneMapped={false} />
      </instancedMesh>
    </group>
  )
}
