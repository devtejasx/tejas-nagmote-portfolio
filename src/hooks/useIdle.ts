import { useEffect, useState } from 'react'

/** Becomes true once the page has loaded and the main thread is idle (or `timeout` ms passed). */
export function useIdle(timeout = 2000): boolean {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    let idleHandle: number | undefined
    let timer: ReturnType<typeof setTimeout> | undefined
    const schedule = () => {
      if ('requestIdleCallback' in window) {
        idleHandle = window.requestIdleCallback(() => setIdle(true), { timeout })
      } else {
        // Safari has no requestIdleCallback.
        timer = setTimeout(() => setIdle(true), 300)
      }
    }
    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })

    return () => {
      window.removeEventListener('load', schedule)
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle)
      clearTimeout(timer)
    }
  }, [timeout])

  return idle
}
