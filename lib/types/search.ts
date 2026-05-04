export interface SearchFilters {
  q: string
  category: '' | 'monster' | 'spell' | 'trap'
  frameTypes: string[]
  attribute: string
  levelMin: string
  levelMax: string
  atkMin: string
  atkMax: string
  defMin: string
  defMax: string
  archetype: string
  banTcg: string
  page: number
}

export const DEFAULT_FILTERS: SearchFilters = {
  q: '',
  category: '',
  frameTypes: [],
  attribute: '',
  levelMin: '',
  levelMax: '',
  atkMin: '',
  atkMax: '',
  defMin: '',
  defMax: '',
  archetype: '',
  banTcg: '',
  page: 1,
}

export const PAGE_SIZE = 24
