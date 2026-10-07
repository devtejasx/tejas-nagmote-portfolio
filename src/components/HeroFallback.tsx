import { sceneEdges, sceneNodes } from '../three/layout'

// Project the scene's x/y onto a 2-D SVG canvas (z is dropped).
const SCALE = 62
const project = ([x, y]: [number, number, number]) => [x * SCALE + 260, -y * SCALE + 170] as const
const byId = new Map(sceneNodes.map((n) => [n.id, n]))

/**
 * Shown when WebGL is unavailable or the 3D scene fails: soft animated light
 * plus a flat drawing of the same system graph, so the hero never looks empty.
 */
export function HeroFallback() {
  return (
    <div className="hero-fallback" aria-hidden="true">
      <div className="hero-fallback__orb hero-fallback__orb--blue" />
      <div className="hero-fallback__orb hero-fallback__orb--violet" />
      <svg className="hero-fallback__graph" viewBox="0 0 520 340" role="presentation">
        {sceneEdges.map(([a, b]) => {
          const [x1, y1] = project(byId.get(a)!.position)
          const [x2, y2] = project(byId.get(b)!.position)
          const mx = (x1 + x2) / 2
          const my = (y1 + y2) / 2 - 34
          return (
            <path
              key={`${a}-${b}`}
              className="hero-fallback__edge"
              d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`}
            />
          )
        })}
        {sceneNodes.map((node) => {
          const [x, y] = project(node.position)
          return (
            <g key={node.id} transform={`translate(${x} ${y})`} className="hero-fallback__node">
              <rect x={-30} y={-22} width={60} height={44} rx={10} style={{ stroke: node.color }} />
              <text y={42} textAnchor="middle">
                {node.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
