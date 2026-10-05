import { Link } from 'react-router-dom'
import type { PokemonSummary } from '../types/pokemon'
import { TypeBadges } from './TypeBadges'

export function PokemonCard({ pokemon }: { pokemon: PokemonSummary }) {
  return (
    <Link className="pokemon-card" to={`/pokemon/${pokemon.id}`} aria-label={`View ${pokemon.name} details`}>
      <div className="card-image-wrap">
        <span className="pokemon-number">#{String(pokemon.id).padStart(3, '0')}</span>
        <img src={pokemon.image} alt={`${pokemon.name} official artwork`} loading="lazy" />
      </div>
      <div className="card-content">
        <h2>{pokemon.name}</h2>
        <TypeBadges types={pokemon.types} />
      </div>
    </Link>
  )
}
