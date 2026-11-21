import { useId, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import type { Diagram, DiagramNode } from '../data/projects'
import { useMediaQuery } from '../hooks/useMediaQuery'
import './ArchitectureDiagram.css'

const NODE = { wide: { w: 116, h: 54 }, narrow: { w: 128, h: 54 } }
const WIDTH = { wide: 640, narrow: 320 }
const BAND_HEIGHT = 40

type Layout = keyof typeof NODE

/** Shortens the segment a→b so it starts and ends on the node rectangles, not their centres. */
function clipToBoxes(a: [number, number], b: [number, number], box: { w: number; h: number }) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const t = Math.min(
    dx === 0 ? Infinity : box.w / 2 / Math.abs(dx),
    dy === 0 ? Infinity : box.h / 2 / Math.abs(dy),
  )
  const pad = 6 / Math.hypot(dx, dy)
  const s = t + pad
  return {
    x1: a[0] + dx * s,
    y1: a[1] + dy * s,
    x2: b[0] - dx * s,
    y2: b[1] - dy * s,
  }
}

/**
 * Puts an edge label beside its line: right of vertical edges, above
 * horizontal ones, and on the outer side of diagonals so that two edges
 * fanning out of the same node do not stack their labels.
 */
function labelPlacement(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  if (Math.abs(dx) < 4) return { x: mx + 8, y: my, textAnchor: 'start' as const }
  if (Math.abs(dy) < 4) return { x: mx, y: my - 8, textAnchor: 'middle' as const }
  return dx < 0
    ? { x: mx - 6, y: my, textAnchor: 'end' as const }
    : { x: mx + 6, y: my, textAnchor: 'start' as const }
}

interface ArchitectureDiagramProps {
  diagram: Diagram
}

/**
 * An animated SVG graph of a project's architecture. Hovering a node or
 * pressing its button below the drawing shows what that component does; the
 * buttons make the same information reachable by keyboard and touch.
 */
export function ArchitectureDiagram({ diagram }: ArchitectureDiagramProps) {
  const narrow = useMediaQuery('(max-width: 600px)')
  const layout: Layout = narrow ? 'narrow' : 'wide'
  const [selected, setSelected] = useState(diagram.nodes[0].id)
  const markerId = useId()
  const detailId = useId()

  const box = NODE[layout]
  const pos = (n: DiagramNode) => n[layout]
  const byId = new Map(diagram.nodes.map((n) => [n.id, n]))
  const maxY = Math.max(...diagram.nodes.map((n) => pos(n)[1]))
  const graphHeight = maxY + box.h / 2 + 16
  const height = graphHeight + (diagram.band ? BAND_HEIGHT + 8 : 0)
  const current = byId.get(selected) ?? diagram.nodes[0]

  return (
    <figure className="arch">
      <svg
        className="arch__svg"
        viewBox={`0 0 ${WIDTH[layout]} ${height}`}
        role="img"
        aria-label={`${diagram.title}: ${diagram.edges
          .map((e) => `${byId.get(e.from)?.label} to ${byId.get(e.to)?.label}`)
          .join(', ')}.`}
      >
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" className="arch__arrow" />
          </marker>
        </defs>

        {diagram.edges.map((edge) => {
          const from = byId.get(edge.from)!
          const to = byId.get(edge.to)!
          const { x1, y1, x2, y2 } = clipToBoxes(pos(from), pos(to), box)
          const kind = edge.kind ?? 'flow'
          const active = selected === edge.from || selected === edge.to
          return (
            <g
              key={`${edge.from}-${edge.to}`}
              className={`arch__edge arch__edge--${kind}${active ? ' is-active' : ''}`}
            >
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className="arch__line"
                markerEnd={`url(#${markerId})`}
              />
              <line x1={x1} y1={y1} x2={x2} y2={y2} className="arch__flow" />
              {edge.label && Math.hypot(x2 - x1, y2 - y1) > 50 && (
                <text {...labelPlacement(x1, y1, x2, y2)} className="arch__edge-label">
                  {edge.label}
                </text>
              )}
            </g>
          )
        })}

        {diagram.nodes.map((node) => {
          const [x, y] = pos(node)
          const isSelected = node.id === selected
          return (
            <g
              key={node.id}
              transform={`translate(${x - box.w / 2} ${y - box.h / 2})`}
              className={`arch__node arch__node--${node.tone ?? 'default'}${isSelected ? ' is-selected' : ''}`}
              onPointerEnter={() => setSelected(node.id)}
            >
              <rect width={box.w} height={box.h} rx={12} />
              <text x={box.w / 2} y={23} textAnchor="middle" className="arch__label">
                {node.label}
              </text>
              <text x={box.w / 2} y={40} textAnchor="middle" className="arch__sublabel">
                {node.sublabel}
              </text>
            </g>
          )
        })}

        {diagram.band && (
          <g transform={`translate(8 ${graphHeight})`} className="arch__band">
            <rect width={WIDTH[layout] - 16} height={BAND_HEIGHT} rx={10} />
            <text x={(WIDTH[layout] - 16) / 2} y={BAND_HEIGHT / 2 + 4} textAnchor="middle">
              {narrow ? 'auth · resilience · observability' : diagram.band}
            </text>
          </g>
        )}
      </svg>

      <figcaption className="arch__caption">
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
      </figcaption>
    </figure>
  )
}
