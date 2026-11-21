import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/fonts.css'
import './styles/global.css'
import './styles/components.css'
import './styles/layout.css'
import { CaseStudyPage } from './pages/CaseStudyPage'

// Each case-study HTML file names its project on <html data-project="…">.
const id = document.documentElement.dataset.project ?? ''

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CaseStudyPage id={id} />
  </StrictMode>,
)
