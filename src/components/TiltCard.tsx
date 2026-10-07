import { useRef, type PointerEvent, type ReactNode } from 'react'
import { useFinePointer, usePrefersReducedMotion } from '../hooks/useMediaQuery'

interface TiltCardProps {
  children: ReactNode
  className?: string
  /** Maximum rotation in degrees. Keep it small so text stays readable. */
  maxTilt?: number
  as?: 'div' | 'article' | 'li'
}

/**
 * A card that tilts toward the pointer and tracks a spotlight. Writes CSS
 * custom properties directly (no React state), so moving the mouse never
 * re-renders. Touch devices and reduced-motion users get a flat card.
 */
export function TiltCard({ children, className, maxTilt = 6, as: Tag = 'div' }: TiltCardProps) {
  const ref = useRef<HTMLElement>(null)
  const frame = useRef(0)
  const finePointer = useFinePointer()
  const reduced = usePrefersReducedMotion()
  const enabled = finePointer && !reduced

  const handleMove = (event: PointerEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const { clientX, clientY } = event
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      const x = (clientX - rect.left) / rect.width
      const y = (clientY - rect.top) / rect.height
      el.style.setProperty('--spot-x', `${x * 100}%`)
      el.style.setProperty('--spot-y', `${y * 100}%`)
      if (enabled) {
        el.style.setProperty('--tilt-x', `${(0.5 - y) * maxTilt}deg`)
        el.style.setProperty('--tilt-y', `${(x - 0.5) * maxTilt}deg`)
      }
    })
  }

  const handleLeave = () => {
    cancelAnimationFrame(frame.current)
    ref.current?.style.setProperty('--tilt-x', '0deg')
    ref.current?.style.setProperty('--tilt-y', '0deg')
  }

  return (
    <Tag
      ref={ref as never}
      className={['tilt-card', className].filter(Boolean).join(' ')}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </Tag>
  )
}
