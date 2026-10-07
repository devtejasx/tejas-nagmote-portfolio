import { m, useScroll, useSpring } from 'motion/react'

/** A hairline at the top of the viewport showing how far down the page you are. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  return <m.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
}
