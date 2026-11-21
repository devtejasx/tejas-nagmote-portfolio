import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  type Points,
} from 'three'

/** A soft round sprite drawn once on a 64px canvas, so points are not square. */
function makeDotTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.35, 'rgba(255,255,255,0.55)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
  }
  return new CanvasTexture(canvas)
}

// Deterministic pseudo-random numbers keep the field identical between renders.
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function Particles({ count, reduced }: { count: number; reduced: boolean }) {
  const ref = useRef<Points>(null)
  const texture = useMemo(() => makeDotTexture(), [])
  const geometry = useMemo(() => {
    const rand = mulberry32(7)
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 22
      positions[i * 3 + 1] = (rand() - 0.5) * 12
      positions[i * 3 + 2] = -rand() * 10 + 2
    }
    const geo = new BufferGeometry()
    geo.setAttribute('position', new BufferAttribute(positions, 3))
    return geo
  }, [count])

  useEffect(() => () => texture.dispose(), [texture])
  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((_, delta) => {
    if (!reduced && ref.current) ref.current.rotation.y += delta * 0.012
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        map={texture}
        size={0.07}
        sizeAttenuation
        color="#8fa8ff"
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  )
}
