export interface NamedApiResource {
  name: string
  url: string
}

export interface PokemonListResponse {
  results: NamedApiResource[]
}

interface PokemonTypeSlot {
  slot: number
  type: NamedApiResource
}

interface PokemonAbilitySlot {
  is_hidden: boolean
  slot: number
  ability: NamedApiResource
}

interface PokemonStatSlot {
  base_stat: number
  effort: number
  stat: NamedApiResource
}

interface PokemonSprites {
  front_default: string | null
  other: {
    'official-artwork': {
      front_default: string | null
    }
  }
}

export interface PokemonApiDetail {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number | null
  sprites: PokemonSprites
  types: PokemonTypeSlot[]
  abilities: PokemonAbilitySlot[]
  stats: PokemonStatSlot[]
}

export interface PokemonSummary {
  id: number
  name: string
  image: string
  types: string[]
}
