import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { links, profile } from '../data/profile'

export function Footer({ root = '' }: { root?: string }) {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>
        <ul className="footer__links">
          {links
            .filter((l) => l.id !== 'email')
            .map((l) => (
              <li key={l.id}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          <li>
            <a href={`${root}${profile.resumePath}`} download={profile.resumeFileName}>
              Resume (PDF)
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}

/** A floating "back to top" control that appears after the first screen. */
export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 1.2)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      className={`to-top${visible ? ' is-visible' : ''}`}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={() => {
        window.scrollTo({ top: 0 })
        document.getElementById('main')?.focus({ preventScroll: true })
      }}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  )
}
