import type { ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { About } from './sections/About'
import { Hero } from './sections/Hero'
import { Skills } from './sections/Skills'

/** One failing section shows a short note instead of taking the page down with it. */
function Guard({ name, children }: { name: string; children: ReactNode }) {
  return (
    <ErrorBoundary
      name={name}
      fallback={
        <p className="container section-error" role="status">
          This section could not be displayed.
        </p>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    // reducedMotion="user": Motion drops transform animations for visitors who ask for less motion.
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <main id="main" tabIndex={-1}>
        <Guard name="hero">
          <Hero />
        </Guard>
        <Guard name="about">
          <About />
        </Guard>
        <Guard name="skills">
          <Skills />
        </Guard>
      </main>
    </MotionConfig>
  )
}
