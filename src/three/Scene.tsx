import { useEffect, useMemo, useState, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { Vector3 } from 'three'
import type { RenderProfile } from '../utils/device'
import { LabelProjector } from './labels'
import { Particles } from './Particles'
import { SystemGraph } from './SystemGraph'

export interface SceneProps {
  frameloop: 'always' | 'demand' | 'never'
  profile: RenderProfile
  reducedMotion: boolean
  /** Element whose pointer events drive parallax and hover (the whole hero, not just the canvas). */
  eventSource: RefObject<HTMLElement | null>
  /** DOM layer holding the node labels that LabelProjector positions each frame. */
  labelLayer: RefObject<HTMLDivElement | null>
  onContextLost: () => void
}

/** Eases the camera toward the pointer and backs it away as the hero scrolls out. */
function CameraRig({ reduced }: { reduced: boolean }) {
  const target = useMemo(() => new Vector3(0, 0, 0), [])
  useFrame((state, delta) => {
    if (reduced) return
    const { camera, pointer } = state
    const k = 1 - Math.exp(-2.4 * delta)
    const scroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1)
    camera.position.x += (pointer.x * 0.75 - camera.position.x) * k
    camera.position.y += (0.4 + pointer.y * 0.45 - camera.position.y) * k
    camera.position.z += (9 + scroll * 2.5 - camera.position.z) * k
    camera.lookAt(target)
  })
  return null
}

/** Drives a frameloop="demand" canvas at a fixed rate instead of every display refresh. */
function FrameLimiter({ fps }: { fps: number }) {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    const interval = 1000 / fps
    let last = 0
    let raf = requestAnimationFrame(function tick(now) {
      raf = requestAnimationFrame(tick)
      if (now - last >= interval - 2) {
        last = now
        invalidate()
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [fps, invalidate])
  return null
}

export default function Scene({
  frameloop,
  profile,
  reducedMotion,
  eventSource,
  labelLayer,
  onContextLost,
}: SceneProps) {
  const [maxDpr, setMaxDpr] = useState(profile.dpr[1])
  // Low-end devices, and any device that cannot hold its frame rate, render at 30 fps.
  const [capped, setCapped] = useState(profile.tier === 'low')
  const limit = frameloop === 'always' && capped

  return (
    <Canvas
      className="hero-canvas"
      frameloop={limit ? 'demand' : frameloop}
      dpr={[profile.dpr[0], maxDpr]}
      camera={{ position: [0, 0.4, 9], fov: 40, near: 0.1, far: 60 }}
      gl={{ antialias: profile.antialias, alpha: true, powerPreference: 'high-performance' }}
      eventSource={eventSource as RefObject<HTMLElement>}
      eventPrefix="client"
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          'webglcontextlost',
          (event) => {
            event.preventDefault()
            onContextLost()
          },
          { once: true },
        )
      }}
    >
      {limit && <FrameLimiter fps={30} />}
      <PerformanceMonitor
        onDecline={() => {
          setMaxDpr(1)
          setCapped(true)
        }}
      />
      <fog attach="fog" args={['#05060a', 9, 24]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 5]} intensity={45} color="#5b8cff" />
      <pointLight position={[-4, -2, 4]} intensity={30} color="#9d6bff" />
      <CameraRig reduced={reducedMotion} />
      <LabelProjector layer={labelLayer}>
        <SystemGraph reduced={reducedMotion} codeTags={profile.codeTags} />
      </LabelProjector>
      <Particles count={profile.particles} reduced={reducedMotion} />
      <gridHelper
        args={[44, 44, '#243056', '#121830']}
        position={[0, -3.1, 0]}
        onUpdate={(grid) => {
          grid.material.transparent = true
          grid.material.opacity = 0.45
        }}
      />
    </Canvas>
  )
}
