import { useMemo, type ReactNode, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3, type Object3D } from 'three'
import { LabelContext, type LabelApi } from './labelContext'

/*
 * Scene labels are plain DOM elements rendered outside the <Canvas> by
 * HeroVisual. Each frame, the projector maps registered 3D anchors to screen
 * space and moves the matching element with a transform. This avoids one
 * React root per label (drei's <Html>) and never re-renders React.
 */

/** Finds (and caches) the DOM element for each label id inside the overlay layer. */
function createElementLookup(layer: RefObject<HTMLDivElement | null>) {
  const cache = new Map<string, HTMLElement>()
  return (id: string) => {
    let el = cache.get(id)
    if (!el || !el.isConnected) {
      el = layer.current?.querySelector<HTMLElement>(`[data-label="${id}"]`) ?? undefined
      if (el) cache.set(id, el)
    }
    return el
  }
}

export function LabelProjector({
  layer,
  children,
}: {
  layer: RefObject<HTMLDivElement | null>
  children: ReactNode
}) {
  const point = useMemo(() => new Vector3(), [])
  const { api, anchors, element } = useMemo(() => {
    const anchors = new Map<string, Object3D>()
    const element = createElementLookup(layer)
    const api: LabelApi = {
      anchor: (id) => (object) => {
        if (object) anchors.set(id, object)
        else anchors.delete(id)
      },
      setActive: (id, active) => element(id)?.classList.toggle('is-active', active),
    }
    return { api, anchors, element }
  }, [layer])

  useFrame(({ camera, size }) => {
    for (const [id, object] of anchors) {
      const el = element(id)
      if (!el) continue
      object.getWorldPosition(point).project(camera)
      const x = (point.x + 1) * 0.5 * size.width
      const y = (1 - point.y) * 0.5 * size.height
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`
      el.dataset.ready = point.z < 1 ? 'true' : 'false'
    }
  })

  return <LabelContext.Provider value={api}>{children}</LabelContext.Provider>
}
