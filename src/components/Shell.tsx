import type { ReactNode } from 'react'
import { LazyMotion, MotionConfig } from 'motion/react'
import { ErrorBoundary } from './ErrorBoundary'
import { BackToTop, Footer } from './Footer'
import { Navbar } from './Navbar'
import { ScrollProgress } from './ScrollProgress'

// Animation features download after first paint; until then components render
// their initial state. `strict` rejects the heavier full `motion` components.
const loadMotionFeatures = () => import('../animations/features').then((mod) => mod.default)

/** One failing section shows a short note instead of taking the page down with it. */
export function Guard({ name, children }: { name: string; children: ReactNode }) {
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

interface ShellProps {
  /** Prefix back to the site root ('' on the home page). */
  root?: string
  children: ReactNode
}

/** Page chrome shared by the home page and the case-study pages. */
export function Shell({ root = '', children }: ShellProps) {
  return (
    // reducedMotion="user": Motion drops transform animations for visitors who ask for less motion.
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ScrollProgress />
        <Navbar root={root} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer root={root} />
        <BackToTop />
      </MotionConfig>
    </LazyMotion>
  )
}
