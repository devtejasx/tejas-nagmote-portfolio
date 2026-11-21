import { useRef } from 'react'
import { m, type Variants } from 'motion/react'
import { ArrowDown, ArrowRight, Download } from 'lucide-react'
import { fadeUp, staggerChildren } from '../animations/variants'
import { LinkIcon } from '../components/BrandIcon'
import { ButtonLink } from '../components/Button'
import { getLink, profile } from '../data/profile'
import { HeroVisual } from '../three/HeroVisual'
import { sceneDescription } from '../three/layout'
import './Hero.css'

const github = getLink('github')
const linkedin = getLink('linkedin')

const wordReveal: Variants = {
  hidden: { y: '105%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
}

function RevealWord({ children, className }: { children: string; className?: string }) {
  return (
    <span className="hero__word-mask">
      <m.span className={`hero__word ${className ?? ''}`} variants={wordReveal}>
        {children}
      </m.span>
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
        <m.div
          className="hero__copy"
          variants={staggerChildren(0.12, 0.15)}
          initial="hidden"
          animate="visible"
        >
          <m.p className="hero__eyebrow mono" variants={fadeUp}>
            <span className="hero__pulse" aria-hidden="true" />
            {profile.location} · PES University
          </m.p>

          <m.h1 id="hero-title" className="hero__title" variants={staggerChildren(0.08)}>
            <RevealWord>{first}</RevealWord>{' '}
            <RevealWord className="gradient-text">{last}</RevealWord>
          </m.h1>

          <m.p className="hero__role" variants={fadeUp}>
            {profile.role}
          </m.p>

          <m.p className="hero__lead" variants={fadeUp}>
            {profile.headline}
          </m.p>

          <m.p className="hero__seeking" variants={fadeUp}>
            <span className="hero__seeking-label mono">Open to</span>
            {profile.seeking.map((role) => (
              <span key={role} className="hero__seeking-role">
                {role}
              </span>
            ))}
            <span className="sr-only"> roles</span>
          </m.p>

          <m.div className="hero__actions" variants={fadeUp}>
            <ButtonLink
              href="#projects"
              variant="primary"
              icon={<ArrowRight size={18} aria-hidden="true" />}
            >
              View Projects
            </ButtonLink>
            <ButtonLink href={github.href} external icon={<LinkIcon id="github" size={18} />}>
              GitHub
            </ButtonLink>
            <ButtonLink
              href={profile.resumePath}
              download={profile.resumeFileName}
              icon={<Download size={18} aria-hidden="true" />}
            >
              Resume
            </ButtonLink>
            <ButtonLink href={linkedin.href} external icon={<LinkIcon id="linkedin" size={18} />}>
              LinkedIn
            </ButtonLink>
          </m.div>
        </m.div>
      </div>

      <m.p
        className="hero__pipeline mono"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        client <span>→</span> api <span>→</span> service <span>→</span> postgresql · redis{' '}
        <span>→</span> replicas
      </m.p>

      <a href="#impact" className="hero__scroll">
        <span>Scroll</span>
        <ArrowDown size={16} aria-hidden="true" />
      </a>
    </section>
  )
}
