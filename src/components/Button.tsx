import type { AnchorHTMLAttributes, ReactNode } from 'react'

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  icon?: ReactNode
  /** Opens in a new tab with safe rel attributes and announces it to screen readers. */
  external?: boolean
}

export function ButtonLink({
  variant = 'secondary',
  icon,
  external = false,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <a
      className={['btn', `btn--${variant}`, className].filter(Boolean).join(' ')}
      {...externalProps}
      {...rest}
    >
      {icon}
      <span>{children}</span>
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  )
}
