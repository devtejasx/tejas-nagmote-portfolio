import { useMemo, useRef, useState } from 'react'
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
import { codeTags, sceneEdges, sceneNodes, type SceneNode } from './layout'

type BezierLineRef = { material: { dashOffset: number } } | null

const PACKETS_PER_EDGE = 2

function edgeCurve(from: SceneNode, to: SceneNode) {
  const start = new Vector3(...from.position)
  const end = new Vector3(...to.position)
  const mid = start
    .clone()
    .lerp(end, 0.5)
    .add(new Vector3(0, 0.55, 0.35))
  return new QuadraticBezierCurve3(start, mid, end)
}

function SystemNode({
  node,
  index,
  reduced,
}: {
  node: SceneNode
  index: number
  reduced: boolean
}) {
  const ref = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const invalidate = useThree((s) => s.invalidate)
  const labels = useLabels()

  useFrame((state, delta) => {
    const g = ref.current
    if (!g) return
    const bob = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.9 + index * 1.3) * 0.09
    g.position.set(node.position[0], node.position[1] + bob, node.position[2])
    const target = hovered ? 1.15 : 1
    g.scale.setScalar(reduced ? target : MathUtils.damp(g.scale.x, target, 8, delta))
    if (!reduced) g.rotation.y += delta * (hovered ? 0.7 : 0.22)
  })

  const setHover = (value: boolean) => {
    setHovered(value)
    labels.setActive(node.id, value)
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
    >
      <NodeShape kind={node.id} color={node.color} hovered={hovered} />
      <group position={[0, -0.82, 0]} ref={labels.anchor(node.id)} />
    </group>
  )
}

function Connections({ reduced }: { reduced: boolean }) {
  const byId = useMemo(() => new Map(sceneNodes.map((n) => [n.id, n])), [])
  const curves = useMemo(
    () => sceneEdges.map(([a, b]) => edgeCurve(byId.get(a)!, byId.get(b)!)),
    [byId],
  )
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
    curves.forEach((curve, i) => {
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
      {curves.map((curve, i) => (
        <QuadraticBezierLine
          key={i}
          ref={(el) => {
            lines.current[i] = el as unknown as BezierLineRef
          }}
          start={curve.v0}
          mid={curve.v1}
          end={curve.v2}
          color="#6f8fff"
          lineWidth={1.3}
          dashed
          dashSize={0.16}
          gapSize={0.1}
          transparent
          opacity={0.55}
        />
      ))}
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

function CodeTags({ reduced }: { reduced: boolean }) {
  const refs = useRef<(Group | null)[]>([])
  const labels = useLabels()
  useFrame((state) => {
    if (reduced) return
    const t = state.clock.elapsedTime
    refs.current.forEach((g, i) => {
      if (g) g.position.y = codeTags[i].position[1] + Math.sin(t * 0.6 + i * 2) * 0.12
    })
  })
  return (
    <>
      {codeTags.map((tag, i) => (
        <group
          key={tag.id}
          position={tag.position}
          ref={(el) => {
            refs.current[i] = el
            labels.anchor(tag.id)(el)
          }}
        />
      ))}
    </>
  )
}

/** Frames the graph for the canvas shape: right of the copy on wide screens, centred above it on phones. */
function useLayout() {
  const { width, height } = useThree((s) => s.size)
  const aspect = width / Math.max(height, 1)
  if (aspect < 0.9) return { x: 0.06, y: 1.6, scale: 0.44 }
  if (aspect < 1.45) return { x: 1.55, y: 0.25, scale: 0.7 }
  return { x: 2.05, y: 0.1, scale: 0.86 }
}

export function SystemGraph({ reduced, codeTags }: { reduced: boolean; codeTags: boolean }) {
  const group = useRef<Group>(null)
  const layout = useLayout()
  const intro = useRef(reduced ? 1 : 0)

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    intro.current = Math.min(1, intro.current + delta / 1.8)
    const e = 1 - Math.pow(1 - intro.current, 3)
    g.scale.setScalar(layout.scale * (0.82 + 0.18 * e))
    g.position.set(layout.x, layout.y - (1 - e) * 0.8, 0)
    g.rotation.y = reduced ? -0.12 : -0.12 + Math.sin(state.clock.elapsedTime * 0.12) * 0.1
  })

  return (
    <group ref={group} position={[layout.x, layout.y, 0]} scale={layout.scale}>
      <Connections reduced={reduced} />
      {sceneNodes.map((node, i) => (
        <SystemNode key={node.id} node={node} index={i} reduced={reduced} />
      ))}
      {codeTags && <CodeTags reduced={reduced} />}
    </group>
  )
}
