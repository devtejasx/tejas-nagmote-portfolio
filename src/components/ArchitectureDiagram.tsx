import { useId, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import type { Diagram, DiagramNode } from '../data/projects'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { clipToBoxes, labelPlacement } from './diagramGeometry'
import './ArchitectureDiagram.css'

const NODE = { wide: { w: 116, h: 54 }, narrow: { w: 128, h: 54 } }
const WIDTH = { wide: 640, narrow: 320 }
const BAND_HEIGHT = 40

type Layout = keyof typeof NODE

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
                <text
                  {...labelPlacement(x1, y1, x2, y2, WIDTH[layout], edge.label.length * 7)}
                  className="arch__edge-label"
                >
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
              {narrow ? (diagram.bandNarrow ?? diagram.band) : diagram.band}
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
