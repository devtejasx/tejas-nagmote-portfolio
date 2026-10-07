/** Shown while a 3D scene's code downloads: a quiet spinner, not a blank box. */
export function SceneLoader({ label }: { label: string }) {
  return (
    <div className="scene-loader" role="status">
      <span className="scene-loader__ring" aria-hidden="true" />
      <span className="scene-loader__text mono">{label}…</span>
    </div>
  )
}
