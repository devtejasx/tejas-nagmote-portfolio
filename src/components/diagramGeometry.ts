/** Shortens the segment a→b so it starts and ends on the node rectangles, not their centres. */
export function clipToBoxes(
  a: readonly [number, number],
  b: readonly [number, number],
  box: { w: number; h: number },
) {
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
 * fanning out of the same node do not stack their labels. A vertical edge
 * near the right edge of the drawing gets its label on the left instead.
 */
export function labelPlacement(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  width = Infinity,
  labelWidth = 0,
) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  if (Math.abs(dx) < 4)
    return mx + 8 + labelWidth > width
      ? { x: mx - 8, y: my + 4, textAnchor: 'end' as const }
      : { x: mx + 8, y: my + 4, textAnchor: 'start' as const }
  if (Math.abs(dy) < 4) return { x: mx, y: my - 8, textAnchor: 'middle' as const }
  return dx < 0
    ? { x: mx - 6, y: my, textAnchor: 'end' as const }
    : { x: mx + 6, y: my, textAnchor: 'start' as const }
}
