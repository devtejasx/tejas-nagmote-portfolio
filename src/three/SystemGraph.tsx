import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { Group } from 'three'
import { GraphLinks, GraphNodeMesh } from './graph'
import { useLabels } from './labelContext'
import { codeTags, sceneEdges, sceneNodes } from './layout'

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
  // Portrait: shrink with the aspect ratio so the whole graph always fits the width.
  if (aspect < 0.9) {
    const scale = Math.min(0.44, aspect * 0.78)
    return { x: -0.33 * scale, y: 1.6, scale }
  }
  if (aspect < 1.45) return { x: 1.84, y: 0.15, scale: 0.63 }
  return { x: 2.09, y: 0.05, scale: 0.78 }
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
      <GraphLinks nodes={sceneNodes} edges={sceneEdges} reduced={reduced} />
      {sceneNodes.map((node, i) => (
        <GraphNodeMesh key={node.id} node={node} index={i} reduced={reduced} />
      ))}
      {codeTags && <CodeTags reduced={reduced} />}
    </group>
  )
}
