import type { SVGProps } from 'react'
import { Mail } from 'lucide-react'
import type { ExternalLink } from '../data/profile'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Stroke({ size = 20, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

export function GitHubIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-8-2" />
    </Stroke>
  )
}

export function LinkedInIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </Stroke>
  )
}

/** A simplified rendering of the LeetCode mark: an open chevron and a bar. */
export function LeetCodeIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M14.5 3 6.6 11a1.6 1.6 0 0 0 0 2.2l4.9 4.9a1.6 1.6 0 0 0 2.2 0l2.4-2.3" />
      <path d="M10.2 12.1H20" />
      <path d="M16.3 8.3 13.9 6" />
    </Stroke>
  )
}

export function LinkIcon({ id, size }: { id: ExternalLink['id']; size?: number }) {
  switch (id) {
    case 'github':
      return <GitHubIcon size={size} />
    case 'linkedin':
      return <LinkedInIcon size={size} />
    case 'leetcode':
      return <LeetCodeIcon size={size} />
    case 'email':
      return <Mail size={size} aria-hidden="true" strokeWidth={1.8} />
  }
}
