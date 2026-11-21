import { ArrowRight, Download, Mail } from 'lucide-react'
import { GitHubIcon } from '../components/BrandIcon'
import { MessagePath } from '../components/MessagePath'
import { getLink, profile, proof } from '../data/profile'
import { focusAreas } from '../data/skills'
import './Hero.css'

const github = getLink('github')

export function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="grid-backdrop" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="hero__meta mono">
            <span className="hero__dot" aria-hidden="true" />
            B.Tech CSE · {profile.university} · Class of {profile.graduation}
          </p>

          <h1 id="hero-title" className="hero__title">
            <span>{profile.headline[0]}</span> <span>{profile.headline[1]}</span>
          </h1>

          <p className="hero__intro">{profile.intro}</p>

          <div className="hero__actions">
            <a
              className="btn btn--primary"
              href={profile.resumePath}
              download={profile.resumeFileName}
            >
              <Download size={16} aria-hidden="true" />
              Download resume
            </a>
            <a className="btn" href="#projects">
              Explore projects
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a
              className="btn btn--ghost"
              href={github.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon size={16} />
              GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a className="btn btn--ghost" href="#contact">
              <Mail size={16} aria-hidden="true" />
              Contact
            </a>
          </div>

          <div className="hero__focus">
            <p className="hero__focus-label mono">Focus</p>
            <ul className="badges" aria-label="Engineering focus areas">
              {focusAreas.map((f) => (
                <li key={f} className="badge">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hero__visual">
          <MessagePath />
        </div>
      </div>

      <div className="container">
        <ul className="hero__proof" aria-label="Highlights">
          {proof.map((p) => (
            <li key={p.value}>
              <a href={p.href} className="hero__proof-item">
                <span className="hero__proof-value">{p.value}</span>
                <span className="hero__proof-label">{p.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
