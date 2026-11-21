import { Guard, Shell } from './components/Shell'
import { Activity } from './sections/Activity'
import { Contact, Resume } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Hero } from './sections/Hero'
import { OpenSource } from './sections/OpenSource'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'

export default function App() {
  return (
    <Shell>
      <Guard name="hero">
        <Hero />
      </Guard>
      <Guard name="projects">
        <Projects />
      </Guard>
      <Guard name="open-source">
        <OpenSource />
      </Guard>
      <Guard name="experience">
        <Experience />
      </Guard>
      <Guard name="skills">
        <Skills />
      </Guard>
      <Guard name="activity">
        <Activity />
      </Guard>
      <Guard name="resume">
        <Resume />
      </Guard>
      <Guard name="contact">
        <Contact />
      </Guard>
    </Shell>
  )
}
