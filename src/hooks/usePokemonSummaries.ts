import { useCallback, useEffect, useState } from 'react'
import { getPokemonSummaries } from '../api/pokemon'
import type { PokemonSummary } from '../types/pokemon'

export function usePokemonSummaries() {
  const [pokemon, setPokemon] = useState<PokemonSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requestKey, setRequestKey] = useState(0)

  const retry = useCallback(() => setRequestKey((key) => key + 1), [])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    getPokemonSummaries()
      .then((data) => {
        if (active) setPokemon(data)
      })
      .catch(() => {
        if (active) setError('The PokéAPI could not be reached. Check your connection and try again.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [requestKey])

  return { pokemon, loading, error, retry }
}
