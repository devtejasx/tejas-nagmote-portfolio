import { ArrowUp } from 'lucide-react'
import { profile } from '../data/profile'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__copy">
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>
        <p className="footer__built mono">React · TypeScript · Three.js · Vite</p>
        <a href="#home" className="footer__top">
          <ArrowUp size={16} aria-hidden="true" />
          Back to top
        </a>
      </div>
    </footer>
  )
}
