import type { ReactNode } from 'react'
import { LazyMotion, MotionConfig } from 'motion/react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { ScrollProgress } from './components/ScrollProgress'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Education } from './sections/Education'
import { Hero } from './sections/Hero'
import { Impact } from './sections/Impact'
import { OpenSource } from './sections/OpenSource'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'
import { Timeline } from './sections/Timeline'

// Animation features download after first paint; until then components render
// their initial state. `strict` rejects the heavier full `motion` components.
const loadMotionFeatures = () => import('./animations/features').then((mod) => mod.default)

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
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ScrollProgress />
        <Navbar />
        <main id="main" tabIndex={-1}>
          <Guard name="hero">
            <Hero />
          </Guard>
          <Guard name="impact">
            <Impact />
          </Guard>
          <Guard name="about">
            <About />
          </Guard>
          <Guard name="open-source">
            <OpenSource />
          </Guard>
          <Guard name="projects">
            <Projects />
          </Guard>
          <Guard name="skills">
            <Skills />
          </Guard>
          <Guard name="timeline">
            <Timeline />
          </Guard>
          <Guard name="education">
            <Education />
          </Guard>
          <Guard name="contact">
            <Contact />
          </Guard>
        </main>
        <Footer />
      </MotionConfig>
    </LazyMotion>
  )
}
