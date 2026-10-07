import { useRef } from 'react'
import { motion, type Variants } from 'motion/react'
import { ArrowDown, ArrowRight, Download } from 'lucide-react'
import { fadeUp, staggerChildren } from '../animations/variants'
import { LinkIcon } from '../components/BrandIcon'
import { ButtonLink } from '../components/Button'
import { links, profile } from '../data/profile'
import { HeroVisual } from '../three/HeroVisual'
import { sceneDescription } from '../three/layout'
import './Hero.css'

const heroLinks = links.filter((l) => l.id !== 'email')

const wordReveal: Variants = {
  hidden: { y: '105%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
}

function RevealWord({ children, className }: { children: string; className?: string }) {
  return (
    <span className="hero__word-mask">
      <motion.span className={`hero__word ${className ?? ''}`} variants={wordReveal}>
        {children}
      </motion.span>
    </span>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [first, last] = profile.name.split(' ')

  return (
    <section id="home" ref={ref} className="hero" aria-labelledby="hero-title">
      <div className="hero__backdrop" aria-hidden="true" />
      <HeroVisual eventSource={ref} />
      <p className="sr-only">{sceneDescription}</p>

      <div className="hero__content container">
        <motion.div
          className="hero__copy"
          variants={staggerChildren(0.12, 0.15)}
          initial="hidden"
          animate="visible"
        >
          <motion.p className="hero__eyebrow mono" variants={fadeUp}>
            <span className="hero__pulse" aria-hidden="true" />
            {profile.location} · PES University
          </motion.p>

          <motion.h1 id="hero-title" className="hero__title" variants={staggerChildren(0.08)}>
            <RevealWord>{first}</RevealWord>{' '}
            <RevealWord className="gradient-text">{last}</RevealWord>
          </motion.h1>

          <motion.p className="hero__role" variants={fadeUp}>
            {profile.role}
          </motion.p>

          <motion.p className="hero__lead" variants={fadeUp}>
            {profile.headline}
          </motion.p>

          <motion.div className="hero__actions" variants={fadeUp}>
            <ButtonLink
              href="#projects"
              variant="primary"
              icon={<ArrowRight size={18} aria-hidden="true" />}
            >
              View Projects
            </ButtonLink>
            <ButtonLink
              href={profile.resumePath}
              download={profile.resumeFileName}
              icon={<Download size={18} aria-hidden="true" />}
            >
              Resume
            </ButtonLink>
          </motion.div>

          <motion.ul className="hero__links" variants={fadeUp} aria-label="Profiles">
            {heroLinks.map((l) => (
              <li key={l.id}>
                <ButtonLink
                  href={l.href}
                  external
                  variant="ghost"
                  icon={<LinkIcon id={l.id} size={18} />}
                >
                  {l.label}
                </ButtonLink>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      <motion.p
        className="hero__pipeline mono"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        client <span>→</span> api <span>→</span> service <span>→</span> redis · postgresql
      </motion.p>

      <a href="#about" className="hero__scroll">
        <span>Scroll</span>
        <ArrowDown size={16} aria-hidden="true" />
      </a>
    </section>
  )
}
