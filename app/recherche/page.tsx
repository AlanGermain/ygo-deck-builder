import type { Metadata } from 'next'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { parseSearchParams } from '@/lib/utils/search-params'
import { PAGE_SIZE } from '@/lib/types/search'
import type { CardSummary } from '@/lib/types/card'
import SearchBar from '@/components/search/search-bar'
import FilterPanel from '@/components/search/filter-panel'
import CardGrid from '@/components/ui/card-grid'
import Pagination from '@/components/search/pagination'

export const metadata: Metadata = {
  title: 'Recherche de cartes',
}

type SearchParams = Record<string, string | string[] | undefined>

async function fetchCards(rawParams: SearchParams) {
  const supabase = await createClient()
  const filters = parseSearchParams(rawParams)

  let query = supabase
    .from('cards')
    .select(
      'id, name_en, name_fr, type, frame_type, attribute, level, rank, link_value, atk, def, ban_tcg, image_url_small, archetype, race',
      { count: 'exact' },
    )

  if (filters.q) {
    const escaped = filters.q.replace(/[%_\\]/g, (c) => `\\${c}`)
    query = query.or(`name_en.ilike.%${escaped}%,name_fr.ilike.%${escaped}%`)
  }

  if (filters.category === 'spell') {
    query = query.eq('frame_type', 'spell')
  } else if (filters.category === 'trap') {
    query = query.eq('frame_type', 'trap')
  } else if (filters.category === 'monster') {
    if (filters.frameTypes.length > 0) {
      query = query.in('frame_type', filters.frameTypes)
    } else {
      query = query
        .not('frame_type', 'eq', 'spell')
        .not('frame_type', 'eq', 'trap')
        .not('frame_type', 'eq', 'token')
    }
  } else if (filters.frameTypes.length > 0) {
    query = query.in('frame_type', filters.frameTypes)
  }

  if (filters.attribute) {
    query = query.eq('attribute', filters.attribute)
  }

  if (filters.levelMin) {
    const min = parseInt(filters.levelMin, 10)
    if (!isNaN(min)) {
      query = query.or(`level.gte.${min},rank.gte.${min},link_value.gte.${min}`)
    }
  }
  if (filters.levelMax) {
    const max = parseInt(filters.levelMax, 10)
    if (!isNaN(max)) {
      query = query.or(`level.lte.${max},rank.lte.${max},link_value.lte.${max}`)
    }
  }

  if (filters.atkMin) {
    const min = parseInt(filters.atkMin, 10)
    if (!isNaN(min)) query = query.gte('atk', min)
  }
  if (filters.atkMax) {
    const max = parseInt(filters.atkMax, 10)
    if (!isNaN(max)) query = query.lte('atk', max)
  }

  if (filters.defMin) {
    const min = parseInt(filters.defMin, 10)
    if (!isNaN(min)) query = query.gte('def', min)
  }
  if (filters.defMax) {
    const max = parseInt(filters.defMax, 10)
    if (!isNaN(max)) query = query.lte('def', max)
  }

  if (filters.archetype) {
    query = query.eq('archetype', filters.archetype)
  }

  if (filters.banTcg === 'unrestricted') {
    query = query.is('ban_tcg', null)
  } else if (filters.banTcg) {
    query = query.eq('ban_tcg', filters.banTcg)
  }

  const offset = (filters.page - 1) * PAGE_SIZE
  const { data, count, error } = await query
    .order('name_en')
    .range(offset, offset + PAGE_SIZE - 1)

  if (error) throw error

  return { cards: (data ?? []) as CardSummary[], total: count ?? 0, filters }
}

async function fetchArchetypes(): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('cards')
      .select('archetype')
      .not('archetype', 'is', null)
      .order('archetype')
      .limit(20000)
    if (error) return []
    const rows = data as Array<{ archetype: string | null }> | null
    const seen = new Set<string>()
    for (const row of rows ?? []) {
      if (row.archetype != null) seen.add(row.archetype)
    }
    return Array.from(seen)
  } catch {
    return []
  }
}

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const rawParams = await searchParams

  let cards: CardSummary[] = []
  let total = 0
  let fetchError: string | null = null

  const filters = parseSearchParams(rawParams)

  try {
    const result = await fetchCards(rawParams)
    cards = result.cards
    total = result.total
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    fetchError = `Erreur Supabase : ${msg}`
  }

  const archetypes = await fetchArchetypes()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-white mb-5">Recherche de cartes</h1>

      {/* Search bar — key forces remount when q changes externally (e.g. filter reset) */}
      <Suspense>
        <SearchBar key={filters.q} defaultValue={filters.q} />
      </Suspense>

      <div className="flex flex-col md:flex-row gap-5 mt-5">
        {/* Filters sidebar */}
        <Suspense>
          <FilterPanel filters={filters} archetypes={archetypes} />
        </Suspense>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {fetchError ? (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-red-300 text-sm">
              <p className="font-semibold mb-1">Erreur de chargement</p>
              <p>{fetchError}</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-400 mb-4">
                {total.toLocaleString('fr-FR')} carte{total > 1 ? 's' : ''} trouvée
                {total > 1 ? 's' : ''}
              </p>
              <CardGrid cards={cards} />
              <Suspense>
                <Pagination total={total} page={filters.page} pageSize={PAGE_SIZE} />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
