import { lazy, Suspense, useEffect, useId, useMemo, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { Box, Network } from 'lucide-react'
import type { Diagram } from '../data/projects'
import { useMediaQuery, usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { getWebGLSupport } from '../utils/webgl'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import { ErrorBoundary } from './ErrorBoundary'
import { SceneLoader } from './SceneLoader'
import './ArchitectureView.css'

const ArchitectureScene = lazy(() => import('../three/ArchitectureScene'))

const colors: Record<string, string> = {
  client: '#7cc4ff',
  api: '#5b8cff',
  service: '#8a7dff',
  postgres: '#5b8cff',
  redis: '#a678ff',
  replica: '#7d8cff',
}

const canRun3D = () =>
  getWebGLSupport() === 'hardware' ||
  (getWebGLSupport() === 'software' &&
    new URLSearchParams(window.location.search).get('3d') === 'force')

/**
 * Interactive architecture: a 3D scene on capable desktops, the SVG diagram
 * everywhere else (phones, no GPU, render failure), plus a toggle between the
 * two. The component list and explanation below work in both modes.
 */
export function ArchitectureView({ diagram }: { diagram: Diagram }) {
  const [supported] = useState(canRun3D)
  const wideEnough = useMediaQuery('(min-width: 768px)')
  const reduced = usePrefersReducedMotion()
  const [mode, setMode] = useState<'3d' | '2d'>('3d')
  const [failed, setFailed] = useState(false)
  const [selected, setSelected] = useState(diagram.nodes[2]?.id ?? diagram.nodes[0].id)
  const [near, setNear] = useState(false)
  const [onScreen, setOnScreen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const labelLayer = useRef<HTMLDivElement>(null)
  const detailId = useId()

  const show3D = supported && wideEnough && !failed && mode === '3d'

  const { nodes, edges } = useMemo(
    () => ({
      nodes: diagram.nodes.map((n) => ({
        id: n.id,
        kind: n.kind3d,
        label: n.label,
        position: n.pos3d,
        color: colors[n.kind3d],
      })),
      edges: diagram.edges.map((e) => [e.from, e.to] as [string, string]),
    }),
    [diagram],
  )

  // Load the scene shortly before it scrolls into view; render only while visible.
  useEffect(() => {
    const el = box.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting)
        if (entry.isIntersecting) setNear(true)
      },
      { rootMargin: '300px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [show3D])

  if (!show3D) {
    return (
      <div className="arch3d arch3d--flat">
        {supported && wideEnough && !failed && <ModeToggle mode={mode} onChange={setMode} />}
        <ArchitectureDiagram diagram={diagram} />
      </div>
    )
  }

  const current = diagram.nodes.find((n) => n.id === selected) ?? diagram.nodes[0]

  return (
    <div className="arch3d">
      <ModeToggle mode={mode} onChange={setMode} />
      <div ref={box} className="arch3d__stage">
        <p className="sr-only">
          {diagram.title}:{' '}
          {diagram.edges
            .map(
              (e) =>
                `${diagram.nodes.find((n) => n.id === e.from)?.label} to ${
                  diagram.nodes.find((n) => n.id === e.to)?.label
                }`,
            )
            .join(', ')}
          .
        </p>
        <ErrorBoundary
          name="architecture-scene"
          fallback={<FailSignal onFail={() => setFailed(true)} />}
        >
          <Suspense fallback={<SceneLoader label="Loading 3D architecture" />}>
            {near && (
              <ArchitectureScene
                nodes={nodes}
                edges={edges}
                selected={selected}
                onSelect={setSelected}
                frameloop={!onScreen ? 'never' : reduced ? 'demand' : 'always'}
                reducedMotion={reduced}
                labelLayer={labelLayer}
              />
            )}
          </Suspense>
        </ErrorBoundary>
        {!near && <SceneLoader label="Loading 3D architecture" />}
        <div ref={labelLayer} className="scene-labels" aria-hidden="true">
          {diagram.nodes.map((n) => (
            <span key={n.id} data-label={n.id} className="scene-label">
              {n.label}
            </span>
          ))}
        </div>
        <p className="arch3d__hint mono" aria-hidden="true">
          move the pointer to orbit · click a component
        </p>
        <FailureWatch onFail={() => setFailed(true)} />
      </div>
      {diagram.band && <p className="arch3d__band mono">{diagram.band}</p>}

      <div className="arch__caption">
        <div className="arch__buttons" role="group" aria-label={`${diagram.title} components`}>
          {diagram.nodes.map((node) => (
            <button
              key={node.id}
              type="button"
              className="arch__button"
              aria-pressed={node.id === selected}
              aria-controls={detailId}
              onClick={() => setSelected(node.id)}
            >
              {node.label}
            </button>
          ))}
        </div>
        <div id={detailId} className="arch__detail" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <m.p
              key={current.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <strong>{current.label}.</strong> {current.detail}
            </m.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function ModeToggle({ mode, onChange }: { mode: '3d' | '2d'; onChange: (m: '3d' | '2d') => void }) {
  return (
    <div className="arch3d__toggle" role="group" aria-label="Architecture view">
      <button type="button" aria-pressed={mode === '3d'} onClick={() => onChange('3d')}>
        <Box size={15} aria-hidden="true" /> 3D
      </button>
      <button type="button" aria-pressed={mode === '2d'} onClick={() => onChange('2d')}>
        <Network size={15} aria-hidden="true" /> Diagram
      </button>
    </div>
  )
}

/** Rendered by the error boundary: tells the view to fall back to the diagram. */
function FailSignal({ onFail }: { onFail: () => void }) {
  useEffect(() => onFail(), [onFail])
  return null
}

/** Falls back to the diagram if the browser drops the 3D scene's GPU context. */
function FailureWatch({ onFail }: { onFail: () => void }) {
  useEffect(() => {
    const onLost = (e: Event) => {
      if ((e.target as HTMLElement | null)?.closest?.('.arch3d__stage')) onFail()
    }
    window.addEventListener('webglcontextlost', onLost, true)
    return () => window.removeEventListener('webglcontextlost', onLost, true)
  }, [onFail])
  return null
}
