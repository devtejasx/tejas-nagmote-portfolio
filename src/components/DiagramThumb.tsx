import { useId } from 'react'
import type { Diagram } from '../data/projects'
import { clipToBoxes } from './diagramGeometry'
import './DiagramThumb.css'

const BOX = { w: 116, h: 54 }

/**
 * A small, non-interactive rendering of a project's architecture diagram for
 * project cards. The case-study page has the interactive version.
 */
export function DiagramThumb({ diagram }: { diagram: Diagram }) {
  const marker = useId()
  const byId = new Map(diagram.nodes.map((n) => [n.id, n]))
  const maxY = Math.max(...diagram.nodes.map((n) => n.wide[1]))
  const height = maxY + BOX.h / 2 + 12
  const minY = Math.min(...diagram.nodes.map((n) => n.wide[1])) - BOX.h / 2 - 12

  return (
    <svg
      className="thumb"
      viewBox={`0 ${minY} 640 ${height - minY}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <marker
          id={marker}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" className="thumb__arrow" />
        </marker>
      </defs>
      {diagram.edges.map((e) => {
        const a = byId.get(e.from)!
        const b = byId.get(e.to)!
        const { x1, y1, x2, y2 } = clipToBoxes(a.wide, b.wide, BOX)
        return (
          <line
            key={`${e.from}-${e.to}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className={`thumb__edge thumb__edge--${e.kind ?? 'flow'}`}
            markerEnd={`url(#${marker})`}
          />
        )
      })}
      {diagram.nodes.map((n) => (
        <g
          key={n.id}
          transform={`translate(${n.wide[0] - BOX.w / 2} ${n.wide[1] - BOX.h / 2})`}
          className={`thumb__node thumb__node--${n.tone ?? 'default'}`}
        >
          <rect width={BOX.w} height={BOX.h} rx={10} />
          <text x={BOX.w / 2} y={24} textAnchor="middle" className="thumb__label">
            {n.label}
          </text>
          <text x={BOX.w / 2} y={41} textAnchor="middle" className="thumb__sublabel">
            {n.sublabel}
          </text>
        </g>
      ))}
    </svg>
  )
}
