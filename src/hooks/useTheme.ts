import { useCallback, useSyncExternalStore } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'theme'
const listeners = new Set<() => void>()

function read(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

/**
 * The page's colour theme. The inline script in each HTML file applies the
 * stored choice before first paint; this hook reads and changes it.
 */
export function useTheme() {
  const theme = useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange)
      return () => listeners.delete(onChange)
    },
    read,
    () => 'dark' as Theme,
  )

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', next === 'light' ? '#fbfbfc' : '#09090b')
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage can be unavailable (private mode, blocked site data); the choice
      // still applies for this page view.
    }
    listeners.forEach((l) => l())
  }, [])

  return { theme, setTheme, toggle: () => setTheme(read() === 'dark' ? 'light' : 'dark') }
}
