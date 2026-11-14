import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, Download } from 'lucide-react'
import { LinkIcon } from '../components/BrandIcon'
import { ButtonLink } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { getLink, links, profile } from '../data/profile'
import { copyText } from '../utils/clipboard'
import './Contact.css'

const email = getLink('email')
const profiles = links.filter((l) => l.id !== 'email')

function CopyEmailButton() {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef<number>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onCopy = async () => {
    const ok = await copyText(profile.email)
    setState(ok ? 'copied' : 'failed')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), 2200)
  }

  return (
    <button type="button" className="contact-email__copy" onClick={onCopy}>
      {state === 'copied' ? (
        <Check size={16} aria-hidden="true" />
      ) : (
        <Copy size={16} aria-hidden="true" />
      )}
      <span aria-live="polite">
        {state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy email'}
      </span>
    </button>
  )
}

export function Contact() {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="contact__glow" aria-hidden="true" />
      <div className="container contact__inner">
        <Reveal className="contact__intro">
          <p className="section-heading__eyebrow mono">
            <span className="section-heading__index">08</span>
            <span aria-hidden="true">/</span>
            Contact
          </p>
          <h2 id="contact-title" className="contact__title">
            Let&apos;s build something <span className="gradient-text">reliable.</span>
          </h2>
          <p className="contact__lead">
            Reach out about C++ systems, backend engineering, or open-source work. Email is the
            fastest way to reach me.
          </p>
        </Reveal>

        <Reveal className="contact-email glass" delay={0.1}>
          <div className="contact-email__icon" aria-hidden="true">
            <LinkIcon id="email" size={22} />
          </div>
          <div className="contact-email__text">
            <p className="contact-email__label mono">Email</p>
            <a className="contact-email__address" href={email.href}>
              {profile.email}
            </a>
          </div>
          <CopyEmailButton />
        </Reveal>

        <Reveal className="contact__grid" delay={0.15}>
          <ul className="contact__links">
            {profiles.map((l) => (
              <li key={l.id}>
                <a
                  className="contact-link glass"
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contact-link__icon" aria-hidden="true">
                    <LinkIcon id={l.id} size={22} />
                  </span>
                  <span className="contact-link__text">
                    <span className="contact-link__label">{l.label}</span>
                    <span className="contact-link__handle mono">{l.handle}</span>
                  </span>
                  <ArrowUpRight size={18} aria-hidden="true" className="contact-link__arrow" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          <ButtonLink
            className="contact__resume"
            variant="primary"
            href={profile.resumePath}
            download={profile.resumeFileName}
            icon={<Download size={18} aria-hidden="true" />}
          >
            Download Resume
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  )
}
