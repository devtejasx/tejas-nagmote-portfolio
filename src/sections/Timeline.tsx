import { useRef } from 'react'
import { m, useScroll, useSpring } from 'motion/react'
import { BookOpen, Code2, Flag, GraduationCap, School, type LucideIcon } from 'lucide-react'
import { fadeUp, revealViewport, staggerChildren } from '../animations/variants'
import { SectionHeading } from '../components/SectionHeading'
import { TiltCard } from '../components/TiltCard'
import { timeline, type TimelineStop } from '../data/timeline'
import './Timeline.css'

const icons: Record<TimelineStop['id'], LucideIcon> = {
  icse: School,
  hsc: BookOpen,
  btech: GraduationCap,
  now: Code2,
  graduation: Flag,
}

export function Timeline() {
  const track = useRef<HTMLOListElement>(null)
  // The rail fills as the timeline scrolls through the viewport.
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 85%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <section id="timeline" className="section timeline-section" aria-labelledby="timeline-title">
      <div className="container">
        <SectionHeading
          index="05"
          eyebrow="Timeline"
          id="timeline-title"
          title="How the engineering came together."
        />

        <div className="tl">
          <div className="tl__rail" aria-hidden="true">
            {/* The CSS picks the axis: vertical rail on phones, horizontal on desktop. */}
            <m.div className="tl__rail-fill" style={{ '--tl-progress': progress } as never} />
          </div>
          <m.ol
            ref={track}
            className="tl__list"
            variants={staggerChildren(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            {timeline.map((stop) => {
              const Icon = icons[stop.id] ?? Code2
              return (
                <m.li key={stop.id} variants={fadeUp} className={`tl__stop tl__stop--${stop.kind}`}>
                  <span className="tl__node" aria-hidden="true">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <TiltCard className="tl__card glass" maxTilt={5}>
                    <p className="tl__when mono">{stop.when}</p>
                    <h3 className="tl__title">{stop.title}</h3>
                    {stop.place && <p className="tl__place">{stop.place}</p>}
                    <ul className="tl__points">
                      {stop.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </TiltCard>
                </m.li>
              )
            })}
          </m.ol>
        </div>
      </div>
    </section>
  )
}
