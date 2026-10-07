import { createContext, useContext } from 'react'
import type { Object3D } from 'three'

export interface LabelApi {
  anchor: (id: string) => (object: Object3D | null) => void
  setActive: (id: string, active: boolean) => void
}

export const LabelContext = createContext<LabelApi | null>(null)

export function useLabels(): LabelApi {
  const api = useContext(LabelContext)
  if (!api) throw new Error('useLabels must be used inside <LabelProjector>')
  return api
}
