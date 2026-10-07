import { lazy, Suspense, useEffect, useRef, useState, type RefObject } from 'react'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { HeroFallback } from '../components/HeroFallback'
import { useIdle } from '../hooks/useIdle'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { getRenderProfile } from '../utils/device'
import { getWebGLSupport } from '../utils/webgl'
import { codeTags, sceneNodes } from './layout'

// three.js and R3F live in this chunk; it downloads only when the scene will run.
const Scene = lazy(() => import('./Scene'))

/** `?3d=force` runs the scene even on a CPU-only WebGL renderer (for testing and screenshots). */
const forced = () => new URLSearchParams(window.location.search).get('3d') === 'force'

/** Hardware WebGL runs the scene; CPU-emulated WebGL would cost seconds of main-thread time. */
function canRunScene() {
  const support = getWebGLSupport()
  return support === 'hardware' || (support === 'software' && forced())
}

interface HeroVisualProps {
  eventSource: RefObject<HTMLElement | null>
}

/**
 * Chooses between the WebGL scene and the CSS fallback. The scene starts only
 * once the page is idle, so it never competes with first paint, and it stops
 * rendering whenever the hero is scrolled out of view.
 */
export function HeroVisual({ eventSource }: HeroVisualProps) {
  const [supported] = useState(canRunScene)
  const [profile] = useState(getRenderProfile)
  const [failed, setFailed] = useState(false)
  const [onScreen, setOnScreen] = useState(true)
  const reduced = usePrefersReducedMotion()
  const idle = useIdle()
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
          {idle && (
            <Scene
              frameloop={frameloop}
              profile={profile}
              reducedMotion={reduced}
              eventSource={eventSource}
              labelLayer={labelLayer}
              onContextLost={() => setFailed(true)}
            />
          )}
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
