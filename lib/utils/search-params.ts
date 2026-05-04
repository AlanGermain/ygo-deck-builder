import type { SearchFilters } from '@/lib/types/search'
import { DEFAULT_FILTERS } from '@/lib/types/search'

type RawParams = Record<string, string | string[] | undefined>

function getString(params: RawParams, key: string): string {
  const val = params[key]
  return typeof val === 'string' ? val.trim().slice(0, 200) : ''
}

function getStringArray(params: RawParams, key: string): string[] {
  const val = params[key]
  if (!val) return []
  if (typeof val === 'string') return val.split(',').filter(Boolean)
  return val
}

function getPositiveInt(params: RawParams, key: string): number | null {
  const val = getString(params, key)
  if (!val) return null
  const n = parseInt(val, 10)
  return isNaN(n) || n < 0 ? null : n
}

export function parseSearchParams(
  params: Record<string, string | string[] | undefined>,
): SearchFilters {
  const rawCategory = getString(params, 'cat')
  const category =
    rawCategory === 'monster' || rawCategory === 'spell' || rawCategory === 'trap'
      ? rawCategory
      : ''

  const page = getPositiveInt(params, 'page') ?? 1

  return {
    q: getString(params, 'q'),
    category,
    frameTypes: getStringArray(params, 'subtypes'),
    attribute: getString(params, 'attr'),
    levelMin: getString(params, 'lvl_min'),
    levelMax: getString(params, 'lvl_max'),
    atkMin: getString(params, 'atk_min'),
    atkMax: getString(params, 'atk_max'),
    defMin: getString(params, 'def_min'),
    defMax: getString(params, 'def_max'),
    archetype: getString(params, 'archetype'),
    banTcg: getString(params, 'ban'),
    page: Math.max(1, page),
  }
}

export function buildSearchParams(filters: Partial<SearchFilters>): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.q) params.set('q', filters.q)
  if (filters.category) params.set('cat', filters.category)
  if (filters.frameTypes?.length) params.set('subtypes', filters.frameTypes.join(','))
  if (filters.attribute) params.set('attr', filters.attribute)
  if (filters.levelMin) params.set('lvl_min', filters.levelMin)
  if (filters.levelMax) params.set('lvl_max', filters.levelMax)
  if (filters.atkMin) params.set('atk_min', filters.atkMin)
  if (filters.atkMax) params.set('atk_max', filters.atkMax)
  if (filters.defMin) params.set('def_min', filters.defMin)
  if (filters.defMax) params.set('def_max', filters.defMax)
  if (filters.archetype) params.set('archetype', filters.archetype)
  if (filters.banTcg) params.set('ban', filters.banTcg)
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))

  return params
}

export function isDefaultFilters(filters: SearchFilters): boolean {
  return (
    filters.q === DEFAULT_FILTERS.q &&
    filters.category === DEFAULT_FILTERS.category &&
    filters.frameTypes.length === 0 &&
    filters.attribute === DEFAULT_FILTERS.attribute &&
    filters.levelMin === DEFAULT_FILTERS.levelMin &&
    filters.levelMax === DEFAULT_FILTERS.levelMax &&
    filters.atkMin === DEFAULT_FILTERS.atkMin &&
    filters.atkMax === DEFAULT_FILTERS.atkMax &&
    filters.defMin === DEFAULT_FILTERS.defMin &&
    filters.defMax === DEFAULT_FILTERS.defMax &&
    filters.archetype === DEFAULT_FILTERS.archetype &&
    filters.banTcg === DEFAULT_FILTERS.banTcg
  )
}
