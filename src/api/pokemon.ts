import axios from 'axios'
import type { PokemonApiDetail, PokemonListResponse, PokemonSummary } from '../types/pokemon'

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 15000,
})

const detailCache = new Map<number, PokemonApiDetail>()
let summariesPromise: Promise<PokemonSummary[]> | null = null

const toSummary = (pokemon: PokemonApiDetail): PokemonSummary => ({
  id: pokemon.id,
  name: pokemon.name,
  image:
    pokemon.sprites.other['official-artwork'].front_default ??
    pokemon.sprites.front_default ??
    '',
  types: pokemon.types
    .sort((a, b) => a.slot - b.slot)
    .map(({ type }) => type.name),
})

export async function getPokemon(id: number): Promise<PokemonApiDetail> {
  const cached = detailCache.get(id)
  if (cached) return cached

  const { data } = await api.get<PokemonApiDetail>(`/pokemon/${id}`)
  detailCache.set(data.id, data)
  return data
}

export function getPokemonSummaries(): Promise<PokemonSummary[]> {
  if (!summariesPromise) {
    summariesPromise = api
      .get<PokemonListResponse>('/pokemon', { params: { limit: 151, offset: 0 } })
      .then(async ({ data }) => {
        const ids = data.results.map((item) => Number(item.url.split('/').filter(Boolean).at(-1)))
        const details: PokemonApiDetail[] = []

        // Small batches are friendlier to the public API while keeping the initial load quick.
        for (let index = 0; index < ids.length; index += 20) {
          const batch = ids.slice(index, index + 20)
          details.push(...(await Promise.all(batch.map(getPokemon))))
        }

        return details.map(toSummary).sort((a, b) => a.id - b.id)
      })
      .catch((error: unknown) => {
        summariesPromise = null
        throw error
      })
  }

  return summariesPromise
}
