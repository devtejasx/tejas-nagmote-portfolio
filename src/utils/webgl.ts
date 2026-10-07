export type WebGLSupport = 'hardware' | 'software' | 'none'

let cached: WebGLSupport | undefined

// Renderer strings of CPU-only WebGL implementations. They work, but a
// continuously animated scene on them costs seconds of main-thread time.
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render driver/i

/** Probes WebGL once: unavailable, CPU-emulated, or GPU-accelerated. */
export function getWebGLSupport(): WebGLSupport {
  if (cached !== undefined) return cached
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    if (!gl) {
      cached = 'none'
    } else {
      const info = gl.getExtension('WEBGL_debug_renderer_info')
      const renderer = String(
        gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? '',
      )
      cached = SOFTWARE_RENDERER.test(renderer) ? 'software' : 'hardware'
      // Release the probe context so it does not count against the browser's
      // limit of live WebGL contexts.
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  } catch {
    cached = 'none'
  }
  return cached
}
