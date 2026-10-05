interface TypeBadgesProps {
  types: string[]
}

export function TypeBadges({ types }: TypeBadgesProps) {
  return (
    <div className="type-list" aria-label={`Types: ${types.join(', ')}`}>
      {types.map((type) => (
        <span className={`type-badge type-${type}`} key={type}>{type}</span>
      ))}
    </div>
  )
}
