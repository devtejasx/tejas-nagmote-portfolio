let cached: boolean | undefined

/** True when the browser can create a WebGL context. Cached after the first probe. */
export function isWebGLAvailable(): boolean {
  if (cached !== undefined) return cached
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    cached = gl !== null
    // Release the probe context immediately so it does not count against the
    // browser's limit of live WebGL contexts.
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    cached = false
  }
  return cached
}
