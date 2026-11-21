import { useCallback, useEffect, useRef, useState } from 'react'
import { Download, Menu, Moon, Sun, X } from 'lucide-react'
import { sections } from '../data/navigation'
import { links, profile } from '../data/profile'
import { useActiveSection } from '../hooks/useActiveSection'
import { useTheme } from '../hooks/useTheme'
import { LinkIcon } from './BrandIcon'
import './Navbar.css'

const sectionIds = sections.map((s) => s.id)
const noSections: readonly string[] = []
const socialLinks = links.filter((l) => l.id !== 'email')

interface NavbarProps {
  /** Prefix that leads back to the site root: '' on the home page, '../../' on case studies. */
  root?: string
}

export function Navbar({ root = '' }: NavbarProps) {
  const onHome = root === ''
  const active = useActiveSection(onHome ? sectionIds : noSections)
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = useCallback((restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus) toggleRef.current?.focus()
  }, [])

  // While the mobile menu is open: lock page scroll, close on Escape, and
  // close automatically if the viewport grows into the desktop layout.
  useEffect(() => {
    if (!open) return
    const rootEl = document.documentElement
    rootEl.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('a')?.focus()

    // Escape closes the menu; Tab and Shift+Tab cycle between the toggle and the panel.
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') return close()
      if (e.key !== 'Tab' || !panelRef.current) return
      const items = panelRef.current.querySelectorAll<HTMLElement>('a, button')
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        toggleRef.current?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        toggleRef.current?.focus()
      }
    }
    const desktop = window.matchMedia('(min-width: 960px)')
    const onResize = () => desktop.matches && close(false)
    window.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onResize)
    return () => {
      rootEl.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onResize)
    }
  }, [open, close])

  const themeLabel = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <header className={`nav ${scrolled || open ? 'nav--solid' : ''}`}>
      <nav className="nav__bar container" aria-label="Primary">
        <a href={onHome ? '#top' : root} className="nav__brand">
          <span className="nav__mark mono" aria-hidden="true">
            TN
          </span>
          <span className="nav__name">{profile.name}</span>
        </a>

        <ul className="nav__links">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`${root}#${s.id}`}
                className="nav__link"
                aria-current={onHome && active === s.id ? 'location' : undefined}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav__actions">
          <button
            type="button"
            className="icon-btn nav__theme"
            onClick={toggle}
            aria-label={themeLabel}
            title={themeLabel}
          >
            {theme === 'dark' ? (
              <Sun size={17} aria-hidden="true" />
            ) : (
              <Moon size={17} aria-hidden="true" />
            )}
          </button>
          <a
            className="btn btn--sm nav__resume"
            href={`${root}${profile.resumePath}`}
            download={profile.resumeFileName}
          >
            <Download size={15} aria-hidden="true" />
            <span>Resume</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="icon-btn nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          ref={panelRef}
          id="mobile-menu"
          className="nav__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <nav aria-label="Mobile">
            <ul className="nav__panel-links container">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`${root}#${s.id}`}
                    className="nav__panel-link"
                    aria-current={onHome && active === s.id ? 'location' : undefined}
                    onClick={() => close(false)}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="nav__panel-footer container">
            <a
              className="btn btn--primary"
              href={`${root}${profile.resumePath}`}
              download={profile.resumeFileName}
            >
              <Download size={17} aria-hidden="true" />
              <span>Download resume (PDF)</span>
            </a>
            <ul className="nav__panel-social">
              {socialLinks.map((l) => (
                <li key={l.id}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn"
                    aria-label={`${l.label} (opens in a new tab)`}
                  >
                    <LinkIcon id={l.id} size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
