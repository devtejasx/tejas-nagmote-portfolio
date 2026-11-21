import { useState } from 'react'
import { ArrowUpRight, Check, Copy, Download, FileText } from 'lucide-react'
import { LinkIcon } from '../components/BrandIcon'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { links, profile } from '../data/profile'
import { copyText } from '../utils/clipboard'
import './Contact.css'

export function Resume() {
  return (
    <section id="resume" className="section section--divided" aria-labelledby="resume-title">
      <div className="container resume">
        <div className="resume__copy">
          <SectionHeading eyebrow="Resume" id="resume-title" title="The one-page version">
            <p>
              Experience, open-source work, projects, skills and education on a single page. The PDF
              was last updated in November 2026.
            </p>
          </SectionHeading>
          <div className="resume__actions">
            <a
              className="btn btn--primary"
              href={profile.resumePath}
              download={profile.resumeFileName}
            >
              <Download size={16} aria-hidden="true" />
              Download resume (PDF, 118 KB)
            </a>
            <a className="btn" href={profile.resumePath} target="_blank" rel="noopener noreferrer">
              <FileText size={16} aria-hidden="true" />
              Open in a new tab
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
        <Reveal className="resume__preview">
          <a href={profile.resumePath} target="_blank" rel="noopener noreferrer">
            <img
              src="resume-preview.webp"
              width={935}
              height={1210}
              loading="lazy"
              decoding="async"
              alt="Preview of the first page of Tejas Nagmote’s resume: summary, experience at 7XLabs, open-source engineering, projects, technical skills and education."
            />
            <span className="sr-only"> (opens the PDF in a new tab)</span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}

export function Contact() {
  const [copied, setCopied] = useState(false)
  const others = links.filter((l) => l.id !== 'email')

  const copyEmail = async () => {
    if (await copyText(profile.email)) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <section
      id="contact"
      className="section section--divided contact"
      aria-labelledby="contact-title"
    >
      <div className="container">
        <SectionHeading eyebrow="Contact" id="contact-title" title="Let’s talk">
          <p>{profile.objective} Email is the fastest way to reach me.</p>
        </SectionHeading>

        <div className="contact__grid">
          <div className="contact__email card">
            <p className="contact__label mono">Email</p>
            <a className="contact__address" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <div className="contact__email-actions">
              <a className="btn btn--primary" href={`mailto:${profile.email}`}>
                Send an email
              </a>
              <button type="button" className="btn" onClick={copyEmail}>
                {copied ? (
                  <Check size={16} aria-hidden="true" />
                ) : (
                  <Copy size={16} aria-hidden="true" />
                )}
                {copied ? 'Copied' : 'Copy address'}
              </button>
              <span className="sr-only" role="status">
                {copied ? 'Email address copied to the clipboard' : ''}
              </span>
            </div>
          </div>

          <ul className="contact__links">
            {others.map((l) => (
              <li key={l.id}>
                <a
                  className="contact__link card"
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contact__icon" aria-hidden="true">
                    <LinkIcon id={l.id} size={18} />
                  </span>
                  <span className="contact__link-text">
                    <span className="contact__link-label">{l.label}</span>
                    <span className="contact__link-handle mono">{l.handle}</span>
                  </span>
                  <ArrowUpRight size={16} aria-hidden="true" className="contact__arrow" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li>
              <a
                className="contact__link card"
                href={profile.resumePath}
                download={profile.resumeFileName}
              >
                <span className="contact__icon" aria-hidden="true">
                  <Download size={18} />
                </span>
                <span className="contact__link-text">
                  <span className="contact__link-label">Resume</span>
                  <span className="contact__link-handle mono">{profile.resumeFileName}</span>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
