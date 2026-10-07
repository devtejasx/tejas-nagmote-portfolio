import { useEffect, useId, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { Pause, Play, RotateCcw, CheckCircle2 } from 'lucide-react'
import { pipelineOutcomes, pipelineStages } from '../data/deployx'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import './DeployPipeline.css'

const STEP_MS = 1100
// Steps 0..4 are the stages, 5 shows the outcome, 6 is a short pause before the next run.
const STEPS = pipelineStages.length + 2

/**
 * An animated deployment run: a job moves through each stage, and runs
 * alternate between a healthy and an unhealthy outcome so both paths are seen.
 * Auto-play can be paused (and never starts under reduced motion); every stage
 * is a button that explains itself.
 */
export function DeployPipeline() {
  const reduced = usePrefersReducedMotion()
  const [playing, setPlaying] = useState(true)
  // One counter drives everything: which stage is active, and which run this is.
  const [tick, setTick] = useState(0)
  const step = tick % STEPS
  const run = Math.floor(tick / STEPS)
  const [selected, setSelected] = useState<string | null>(null)
  const detailId = useId()
  const auto = playing && !reduced

  useEffect(() => {
    if (!auto) return
    const timer = window.setInterval(() => setTick((t) => t + 1), STEP_MS)
    return () => window.clearInterval(timer)
  }, [auto])

  const healthy = run % 2 === 0
  const outcomeShown = auto ? step >= pipelineStages.length : true
  const activeStage = auto ? step : -1
  const all = [...pipelineStages, ...pipelineOutcomes]
  const explained = all.find((s) => s.id === selected)

  const stageState = (i: number) => {
    if (!auto) return 'idle'
    if (i < activeStage) return 'done'
    if (i === activeStage) return 'active'
    return 'waiting'
  }

  const outcomeState = (id: string) => {
    if (!auto) return 'idle'
    if (!outcomeShown) return 'waiting'
    return (id === 'running') === healthy ? 'active' : 'dimmed'
  }

  return (
    <div className="pipeline">
      <div className="pipeline__bar">
        <p className="pipeline__status mono" aria-hidden="true">
          {auto
            ? step < pipelineStages.length
              ? `deploy #${run + 1} · ${pipelineStages[step].label.toLowerCase()}`
              : `deploy #${run + 1} · ${healthy ? 'healthy, running' : 'unhealthy, rolled back'}`
            : 'paused · select a stage'}
        </p>
        {!reduced && (
          <button type="button" className="pipeline__play" onClick={() => setPlaying((p) => !p)}>
            {playing ? (
              <Pause size={15} aria-hidden="true" />
            ) : (
              <Play size={15} aria-hidden="true" />
            )}
            {playing ? 'Pause' : 'Play'} animation
          </button>
        )}
      </div>

      <ol className="pipeline__stages" aria-label="Deployment pipeline">
        {pipelineStages.map((stage, i) => (
          <li key={stage.id} className={`pipeline__stage is-${stageState(i)}`}>
            <button
              type="button"
              className="pipeline__node"
              aria-pressed={selected === stage.id}
              aria-controls={detailId}
              onClick={() => setSelected(stage.id)}
            >
              <span className="pipeline__index mono" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              {stage.label}
            </button>
            {i < pipelineStages.length - 1 && (
              <span className="pipeline__link" aria-hidden="true">
                <span className="pipeline__packet" />
              </span>
            )}
          </li>
        ))}
        <li className="pipeline__outcomes">
          {pipelineOutcomes.map((o) => (
            <button
              key={o.id}
              type="button"
              className={`pipeline__outcome pipeline__outcome--${o.id} is-${outcomeState(o.id)}`}
              aria-pressed={selected === o.id}
              aria-controls={detailId}
              onClick={() => setSelected(o.id)}
            >
              {o.id === 'running' ? (
                <CheckCircle2 size={16} aria-hidden="true" />
              ) : (
                <RotateCcw size={16} aria-hidden="true" />
              )}
              {o.label}
            </button>
          ))}
        </li>
      </ol>

      <div id={detailId} className="pipeline__detail" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <m.p
            key={explained?.id ?? 'intro'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {explained ? (
              <>
                <strong>{explained.label}.</strong> {explained.detail}
              </>
            ) : (
              'Select any stage to see what it does. DeployX is in progress: this is the flow it is being built to run.'
            )}
          </m.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
