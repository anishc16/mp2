import { useMemo, useState } from 'react'
import { PokemonCard } from '../components/PokemonCard'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import { usePokemonSummaries } from '../hooks/usePokemonSummaries'

export function GalleryPage() {
  const { pokemon, loading, error, retry } = usePokemonSummaries()
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const allTypes = useMemo(
    () => Array.from(new Set(pokemon.flatMap((item) => item.types))).sort(),
    [pokemon],
  )

  const visiblePokemon = useMemo(
    () => selectedTypes.length === 0
      ? pokemon
      : pokemon.filter((item) => selectedTypes.every((type) => item.types.includes(type))),
    [pokemon, selectedTypes],
  )

  const toggleType = (type: string) => {
    setSelectedTypes((selected) => selected.includes(type)
      ? selected.filter((item) => item !== type)
      : [...selected, type])
  }

  return (
    <main className="page-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Visual index</p>
          <h1>Pokémon gallery</h1>
          <p>Build a type combination to narrow down the Kanto collection.</p>
        </div>
        <div className="result-count" aria-live="polite">
          <strong>{visiblePokemon.length}</strong>
          <span>matches</span>
        </div>
      </section>

      <section className="filter-panel" aria-labelledby="filter-heading">
        <div className="filter-header">
          <div>
            <p className="control-label" id="filter-heading">Filter by type</p>
            <p>Selected types are combined.</p>
          </div>
          {selectedTypes.length > 0 && <button className="text-button" type="button" onClick={() => setSelectedTypes([])}>Clear filters</button>}
        </div>
        <div className="type-filters">
          <button className={selectedTypes.length === 0 ? 'filter-chip active' : 'filter-chip'} type="button" onClick={() => setSelectedTypes([])} aria-pressed={selectedTypes.length === 0}>All</button>
          {allTypes.map((type) => (
            <button
              className={`filter-chip type-filter-${type}${selectedTypes.includes(type) ? ' active' : ''}`}
              type="button"
              key={type}
              onClick={() => toggleType(type)}
              aria-pressed={selectedTypes.includes(type)}
            >{type}</button>
          ))}
        </div>
      </section>

      {loading && <LoadingState message="Arranging the gallery…" />}
      {error && <ErrorState message={error} onRetry={retry} />}
      {!loading && !error && visiblePokemon.length === 0 && <EmptyState message="No Pokémon has every selected type. Remove a filter and try again." />}
      {!loading && !error && visiblePokemon.length > 0 && (
        <section className="gallery-grid" aria-label="Pokémon gallery results">
          {visiblePokemon.map((item) => <PokemonCard pokemon={item} key={item.id} />)}
        </section>
      )}
    </main>
  )
}
