import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

interface CounterProps {
  value: number
  duration?: number
  className?: string
}

/**
 * Counts up to `value` when scrolled into view. The final number is always in
 * the accessible text, so screen readers never hear intermediate values.
 */
export function Counter({ value, duration = 1.6, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || !inView) return
    if (reduced) {
      el.textContent = String(value)
      return
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = String(Math.round(v))
      },
    })
    return () => controls.stop()
  }, [inView, reduced, value, duration])

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        0
      </span>
      <span className="sr-only">{value}</span>
    </span>
  )
}
