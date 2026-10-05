import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPokemon } from '../api/pokemon'
import { ErrorState, LoadingState } from '../components/States'
import { TypeBadges } from '../components/TypeBadges'
import type { PokemonApiDetail } from '../types/pokemon'

const TOTAL_POKEMON = 151

const formatLabel = (value: string) => value.replaceAll('-', ' ')

export function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pokemonId = Number(id)
  const isValidId = Number.isInteger(pokemonId) && pokemonId >= 1 && pokemonId <= TOTAL_POKEMON
  const [pokemon, setPokemon] = useState<PokemonApiDetail | null>(null)
  const [loading, setLoading] = useState(isValidId)
  const [error, setError] = useState<string | null>(null)
  const [requestKey, setRequestKey] = useState(0)

  useEffect(() => {
    if (!isValidId) {
      setPokemon(null)
      setLoading(false)
      setError('That is not a valid Kanto Pokédex number. Choose a number from 1 to 151.')
      return
    }

    let active = true
    setLoading(true)
    setError(null)
    setPokemon(null)

    getPokemon(pokemonId)
      .then((data) => { if (active) setPokemon(data) })
      .catch(() => { if (active) setError('This Pokémon could not be loaded from the PokéAPI.') })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [isValidId, pokemonId, requestKey])

  if (loading) return <main className="page-shell"><LoadingState message="Opening Pokédex entry…" /></main>

  if (error || !pokemon) {
    return (
      <main className="page-shell detail-error">
        <ErrorState message={error ?? 'This Pokémon does not exist.'} onRetry={isValidId ? () => setRequestKey((key) => key + 1) : undefined} />
        <Link className="button button-secondary" to="/">Back to Pokédex</Link>
      </main>
    )
  }

  const image = pokemon.sprites.other['official-artwork'].front_default ?? pokemon.sprites.front_default ?? ''
  const maxStat = 255

  return (
    <main className="detail-page">
      <div className="detail-shell">
        <Link className="back-link" to="/">← Back to Pokédex</Link>
        <section className="detail-hero">
          <div className="detail-artwork">
            <span className="detail-number">#{String(pokemon.id).padStart(3, '0')}</span>
            <img src={image} alt={`${pokemon.name} official artwork`} />
          </div>
          <div className="detail-intro">
            <p className="eyebrow">Kanto Pokédex entry</p>
            <h1>{pokemon.name}</h1>
            <TypeBadges types={pokemon.types.map(({ type }) => type.name)} />
            <div className="measurements">
              <div><span>Height</span><strong>{(pokemon.height / 10).toFixed(1)} m</strong></div>
              <div><span>Weight</span><strong>{(pokemon.weight / 10).toFixed(1)} kg</strong></div>
              <div><span>Base XP</span><strong>{pokemon.base_experience ?? '—'}</strong></div>
            </div>
            <div className="abilities-block">
              <h2>Abilities</h2>
              <ul>
                {pokemon.abilities.map(({ ability, is_hidden }) => (
                  <li key={ability.name}>{formatLabel(ability.name)}{is_hidden && <span>Hidden</span>}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="section-title">
            <p className="eyebrow">Battle profile</p>
            <h2>Base stats</h2>
          </div>
          <div className="stats-list">
            {pokemon.stats.map(({ base_stat, stat }) => (
              <div className="stat-row" key={stat.name}>
                <span>{formatLabel(stat.name)}</span>
                <strong>{base_stat}</strong>
                <progress value={base_stat} max={maxStat} aria-label={`${formatLabel(stat.name)}: ${base_stat} out of ${maxStat}`} />
              </div>
            ))}
          </div>
        </section>

        <nav className="entry-navigation" aria-label="Pokédex entry navigation">
          <button className="entry-button" type="button" disabled={pokemon.id === 1} onClick={() => navigate(`/pokemon/${pokemon.id - 1}`)}>
            <span aria-hidden="true">←</span><span><small>Previous</small>{pokemon.id === 1 ? 'First entry' : `#${String(pokemon.id - 1).padStart(3, '0')}`}</span>
          </button>
          <button className="entry-button next" type="button" disabled={pokemon.id === TOTAL_POKEMON} onClick={() => navigate(`/pokemon/${pokemon.id + 1}`)}>
            <span><small>Next</small>{pokemon.id === TOTAL_POKEMON ? 'Last entry' : `#${String(pokemon.id + 1).padStart(3, '0')}`}</span><span aria-hidden="true">→</span>
          </button>
        </nav>
      </div>
    </main>
  )
}
