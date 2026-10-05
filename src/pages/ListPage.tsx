import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import { TypeBadges } from '../components/TypeBadges'
import { usePokemonSummaries } from '../hooks/usePokemonSummaries'

type SortProperty = 'id' | 'name'
type SortDirection = 'asc' | 'desc'

export function ListPage() {
  const { pokemon, loading, error, retry } = usePokemonSummaries()
  const [query, setQuery] = useState('')
  const [sortProperty, setSortProperty] = useState<SortProperty>('id')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const visiblePokemon = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return pokemon
      .filter((item) => item.name.toLocaleLowerCase().includes(normalizedQuery))
      .sort((a, b) => {
        const comparison = sortProperty === 'name'
          ? a.name.localeCompare(b.name)
          : a.id - b.id
        return sortDirection === 'asc' ? comparison : -comparison
      })
  }, [pokemon, query, sortDirection, sortProperty])

  return (
    <main className="page-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Kanto Pokédex</p>
          <h1>Meet the original 151</h1>
          <p>Search, sort, and inspect every Pokémon from the first generation.</p>
        </div>
        <div className="result-count" aria-live="polite">
          <strong>{visiblePokemon.length}</strong>
          <span>{visiblePokemon.length === 1 ? 'Pokémon' : 'Pokémon'}</span>
        </div>
      </section>

      <section className="controls-bar" aria-label="List controls">
        <div className="search-control">
          <label htmlFor="pokemon-search">Search by name</label>
          <div className="search-input-wrap">
            <span aria-hidden="true">⌕</span>
            <input
              id="pokemon-search"
              type="search"
              placeholder="Try Pikachu…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="select-control">
          <label htmlFor="sort-property">Sort by</label>
          <select id="sort-property" value={sortProperty} onChange={(event) => setSortProperty(event.target.value as SortProperty)}>
            <option value="id">Pokédex number</option>
            <option value="name">Name</option>
          </select>
        </div>
        <fieldset className="direction-control">
          <legend>Direction</legend>
          <div className="segmented-control">
            <button className={sortDirection === 'asc' ? 'active' : ''} type="button" onClick={() => setSortDirection('asc')} aria-pressed={sortDirection === 'asc'}>Ascending</button>
            <button className={sortDirection === 'desc' ? 'active' : ''} type="button" onClick={() => setSortDirection('desc')} aria-pressed={sortDirection === 'desc'}>Descending</button>
          </div>
        </fieldset>
      </section>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={retry} />}
      {!loading && !error && visiblePokemon.length === 0 && <EmptyState message="Try a different name or clear your search." />}

      {!loading && !error && visiblePokemon.length > 0 && (
        <ul className="pokemon-list">
          {visiblePokemon.map((item) => (
            <li key={item.id}>
              <Link to={`/pokemon/${item.id}`} className="pokemon-list-item">
                <span className="list-number">#{String(item.id).padStart(3, '0')}</span>
                <div className="list-image"><img src={item.image} alt="" loading="lazy" /></div>
                <div className="list-identity">
                  <h2>{item.name}</h2>
                  <TypeBadges types={item.types} />
                </div>
                <span className="list-action" aria-hidden="true">View details <b>→</b></span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
