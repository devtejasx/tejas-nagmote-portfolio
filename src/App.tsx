import { MotionConfig } from 'motion/react'

export default function App() {
  return (
    // reducedMotion="user": Motion drops transform animations for visitors who ask for less motion.
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <main id="main" tabIndex={-1}>
      </main>
    </MotionConfig>
  )
}
