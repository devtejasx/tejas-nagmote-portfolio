import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { Download, Menu, X } from 'lucide-react'
import { sections } from '../data/navigation'
import { links, profile } from '../data/profile'
import { useActiveSection } from '../hooks/useActiveSection'
import { LinkIcon } from './BrandIcon'
import './Navbar.css'

const sectionIds = sections.map((s) => s.id)
const socialLinks = links.filter((l) => l.id !== 'email')

export function Navbar() {
  const active = useActiveSection(sectionIds)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
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
    const root = document.documentElement
    root.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('a')?.focus()

    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && close()
    const desktop = window.matchMedia('(min-width: 1024px)')
    const onResize = () => desktop.matches && close(false)
    window.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onResize)
    return () => {
      root.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onResize)
    }
  }, [open, close])

  // Keep Tab focus inside the open menu panel.
  const trapFocus = (e: KeyboardEvent<HTMLDivElement>) => {
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

  return (
    <header className={`nav ${scrolled || open ? 'nav--solid' : ''}`}>
      <nav className="nav__bar container" aria-label="Primary">
        <a href="#home" className="nav__brand">
          <span className="nav__mark mono" aria-hidden="true">
            TN
          </span>
          <span className="nav__name">{profile.name}</span>
        </a>

        <ul className="nav__links">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="nav__link"
                aria-current={active === s.id ? 'location' : undefined}
              >
                {active === s.id && (
                  <m.span
                    layoutId="nav-active"
                    className="nav__indicator"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="nav__link-text">{s.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="nav__actions">
          <a
            className="btn btn--secondary nav__resume"
            href={profile.resumePath}
            download={profile.resumeFileName}
          >
            <Download size={16} aria-hidden="true" />
            <span>Resume</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            ref={panelRef}
            id="mobile-menu"
            className="nav__panel"
            onKeyDown={trapFocus}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Mobile">
              <ul className="nav__panel-links container">
                {sections.map((s, i) => (
                  <m.li
                    key={s.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05, duration: 0.3 }}
                  >
                    <a
                      href={`#${s.id}`}
                      className="nav__panel-link"
                      aria-current={active === s.id ? 'location' : undefined}
                      onClick={() => close(false)}
                    >
                      <span className="mono nav__panel-index" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {s.label}
                    </a>
                  </m.li>
                ))}
              </ul>
            </nav>
            <div className="nav__panel-footer container">
              <a
                className="btn btn--primary"
                href={profile.resumePath}
                download={profile.resumeFileName}
              >
                <Download size={18} aria-hidden="true" />
                <span>Download Resume</span>
              </a>
              <ul className="nav__panel-social">
                {socialLinks.map((l) => (
                  <li key={l.id}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav__social"
                      aria-label={`${l.label} (opens in a new tab)`}
                    >
                      <LinkIcon id={l.id} size={20} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}
