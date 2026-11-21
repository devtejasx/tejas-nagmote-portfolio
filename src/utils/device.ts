export interface RenderProfile {
  tier: 'high' | 'low'
  dpr: [number, number]
  particles: number
  /** Floating code fragments are DOM overlays, so low-end devices skip them. */
  codeTags: boolean
  antialias: boolean
}

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number
}

/** A coarse capability guess, made once, used to size the hero scene. */
export function getRenderProfile(): RenderProfile {
  const nav = navigator as NavigatorWithMemory
  const narrow = window.matchMedia('(max-width: 767px)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const fewCores = (nav.hardwareConcurrency ?? 8) <= 4
  const lowMemory = (nav.deviceMemory ?? 8) <= 4

  if (narrow || (coarse && (fewCores || lowMemory))) {
    return { tier: 'low', dpr: [1, 1.5], particles: 260, codeTags: false, antialias: false }
  }
  return { tier: 'high', dpr: [1, 1.75], particles: 700, codeTags: true, antialias: true }
}
