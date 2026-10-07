// DeployX's deployment flow, from the resume's description of the platform.
// DeployX is in progress; this is the flow it is being built to run.

export interface PipelineStage {
  id: string
  label: string
  detail: string
}

export const pipelineStages: PipelineStage[] = [
  {
    id: 'repo',
    label: 'GitHub repository',
    detail: 'A GitHub repository is connected to the platform, and each deployment starts from it.',
  },
  {
    id: 'queue',
    label: 'Build queue',
    detail:
      'A Redis-backed job queue runs concurrent builds, with retries, failure handling and deployment state tracking.',
  },
  {
    id: 'build',
    label: 'Docker build',
    detail: 'An automated Docker build produces the image for the deployment.',
  },
  {
    id: 'deploy',
    label: 'Deployment',
    detail:
      'The image is deployed, and every state change is tracked and exposed through REST APIs.',
  },
  {
    id: 'health',
    label: 'Health check',
    detail: 'Health checks decide whether the new version is healthy.',
  },
]

export const pipelineOutcomes: PipelineStage[] = [
  {
    id: 'running',
    label: 'Healthy → Running',
    detail:
      'A healthy deployment keeps running; its history, real-time logs and status show on the dashboard.',
  },
  {
    id: 'rollback',
    label: 'Unhealthy → Rollback',
    detail: 'An unhealthy deployment rolls back automatically to the last stable version.',
  },
]
