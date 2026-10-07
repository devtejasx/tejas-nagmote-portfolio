interface BadgesProps {
  items: readonly string[]
  label: string
  variant?: 'tech' | 'feature'
}

export function Badges({ items, label, variant = 'tech' }: BadgesProps) {
  return (
    <ul className={`badges badges--${variant}`} aria-label={label}>
      {items.map((item) => (
        <li key={item} className="badge">
          {item}
        </li>
      ))}
    </ul>
  )
}
