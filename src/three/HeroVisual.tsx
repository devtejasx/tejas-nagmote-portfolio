import { lazy, Suspense, useEffect, useRef, useState, type RefObject } from 'react'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { HeroFallback } from '../components/HeroFallback'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { getRenderProfile } from '../utils/device'
import { isWebGLAvailable } from '../utils/webgl'
import { codeTags, sceneNodes } from './layout'

// three.js and R3F live in this chunk; it downloads only when WebGL is usable.
const Scene = lazy(() => import('./Scene'))

interface HeroVisualProps {
  eventSource: RefObject<HTMLElement | null>
}

/**
 * Chooses between the WebGL scene and the CSS fallback, and pauses rendering
 * whenever the hero is scrolled out of view or the tab is hidden.
 */
export function HeroVisual({ eventSource }: HeroVisualProps) {
  const [supported] = useState(isWebGLAvailable)
  const [profile] = useState(getRenderProfile)
  const [failed, setFailed] = useState(false)
  const [onScreen, setOnScreen] = useState(true)
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const labelLayer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      rootMargin: '80px 0px',
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [supported, failed])

  if (!supported || failed) return <HeroFallback />

  const frameloop = !onScreen ? 'never' : reduced ? 'demand' : 'always'

  return (
    <div ref={ref} className="hero-visual">
      <ErrorBoundary name="hero-scene" fallback={<HeroFallback />}>
        <Suspense fallback={null}>
          <Scene
            frameloop={frameloop}
            profile={profile}
            reducedMotion={reduced}
            eventSource={eventSource}
            labelLayer={labelLayer}
            onContextLost={() => setFailed(true)}
          />
        </Suspense>
      </ErrorBoundary>
      <div ref={labelLayer} className="scene-labels" aria-hidden="true">
        {sceneNodes.map((n) => (
          <span key={n.id} data-label={n.id} className="scene-label">
            {n.label}
          </span>
        ))}
        {profile.codeTags &&
          codeTags.map((t) => (
            <span key={t.id} data-label={t.id} className="scene-code">
              {t.text}
            </span>
          ))}
      </div>
    </div>
  )
}
