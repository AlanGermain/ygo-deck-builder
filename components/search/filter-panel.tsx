'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { CARD_ATTRIBUTES } from '@/lib/types/card'
import type { SearchFilters } from '@/lib/types/search'

interface FilterPanelProps {
  filters: SearchFilters
  archetypes: string[]
}

const SUBTYPE_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'effect', label: 'Effet' },
  { value: 'ritual', label: 'Rituel' },
  { value: 'fusion', label: 'Fusion' },
  { value: 'synchro', label: 'Synchro' },
  { value: 'xyz', label: 'Xyz' },
  { value: 'link', label: 'Lien' },
  { value: 'normal_pendulum', label: 'Pendule Normal' },
  { value: 'effect_pendulum', label: 'Pendule Effet' },
]

const BAN_OPTIONS = [
  { value: '', label: 'Tous' },
  { value: 'unrestricted', label: 'Autorisée' },
  { value: 'Semi-Limited', label: 'Semi-Limitée' },
  { value: 'Limited', label: 'Limitée' },
  { value: 'Banned', label: 'Interdite' },
]

const CATEGORY_OPTIONS = [
  { value: '', label: 'Toutes' },
  { value: 'monster', label: 'Monstre' },
  { value: 'spell', label: 'Magie' },
  { value: 'trap', label: 'Piège' },
]

export default function FilterPanel({ filters, archetypes }: FilterPanelProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function toggleFrameType(ft: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('cat', 'monster')
    const next = filters.frameTypes.includes(ft)
      ? filters.frameTypes.filter((x) => x !== ft)
      : [...filters.frameTypes, ft]
    if (next.length > 0) {
      params.set('subtypes', next.join(','))
    } else {
      params.delete('subtypes')
    }
    params.delete('page')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function resetAll() {
    router.replace(pathname, { scroll: false })
  }

  const hasActiveFilters =
    filters.q ||
    filters.category ||
    filters.frameTypes.length > 0 ||
    filters.attribute ||
    filters.levelMin ||
    filters.levelMax ||
    filters.atkMin ||
    filters.atkMax ||
    filters.defMin ||
    filters.defMax ||
    filters.archetype ||
    filters.banTcg

  const filterContent = (
    <div className="space-y-5 text-sm">
      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={resetAll}
          className="w-full text-xs text-amber-400 hover:text-amber-300 border border-amber-500/40 hover:border-amber-400 rounded px-3 py-1.5 transition-colors"
        >
          Réinitialiser les filtres
        </button>
      )}

      {/* Catégorie */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Catégorie
        </p>
        <div className="space-y-1">
          {CATEGORY_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value={opt.value}
                checked={filters.category === opt.value}
                onChange={() => {
                  const params = new URLSearchParams(searchParams.toString())
                  if (opt.value) {
                    params.set('cat', opt.value)
                  } else {
                    params.delete('cat')
                  }
                  params.delete('subtypes')
                  params.delete('page')
                  router.replace(`${pathname}?${params.toString()}`, { scroll: false })
                }}
                className="accent-amber-500"
              />
              <span className="text-slate-300 group-hover:text-white transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sous-type (visible uniquement pour les monstres) */}
      {(filters.category === 'monster' || filters.category === '') && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Sous-type monstre
          </p>
          <div className="space-y-1">
            {SUBTYPE_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.frameTypes.includes(opt.value)}
                  onChange={() => toggleFrameType(opt.value)}
                  className="accent-amber-500"
                />
                <span className="text-slate-300 group-hover:text-white transition-colors">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Attribut */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Attribut
        </p>
        <div className="space-y-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="attribute"
              value=""
              checked={!filters.attribute}
              onChange={() => updateParam('attr', '')}
              className="accent-amber-500"
            />
            <span className="text-slate-300 group-hover:text-white transition-colors">Tous</span>
          </label>
          {CARD_ATTRIBUTES.map((attr) => (
            <label key={attr} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="attribute"
                value={attr}
                checked={filters.attribute === attr}
                onChange={() => updateParam('attr', attr)}
                className="accent-amber-500"
              />
              <span className="text-slate-300 group-hover:text-white transition-colors">{attr}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Niveau / Rang / Link */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Niveau / Rang / Link
        </p>
        <div className="flex items-center gap-2">
          <input
            key={`lvl_min_${filters.levelMin}`}
            type="number"
            min={0}
            max={12}
            placeholder="Min"
            defaultValue={filters.levelMin}
            onBlur={(e) => updateParam('lvl_min', e.target.value)}
            className="w-16 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
          />
          <span className="text-slate-500">–</span>
          <input
            key={`lvl_max_${filters.levelMax}`}
            type="number"
            min={0}
            max={12}
            placeholder="Max"
            defaultValue={filters.levelMax}
            onBlur={(e) => updateParam('lvl_max', e.target.value)}
            className="w-16 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
          />
        </div>
      </div>

      {/* ATK */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">ATK</p>
        <div className="flex items-center gap-2">
          <input
            key={`atk_min_${filters.atkMin}`}
            type="number"
            min={0}
            placeholder="Min"
            defaultValue={filters.atkMin}
            onBlur={(e) => updateParam('atk_min', e.target.value)}
            className="w-16 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
          />
          <span className="text-slate-500">–</span>
          <input
            key={`atk_max_${filters.atkMax}`}
            type="number"
            min={0}
            placeholder="Max"
            defaultValue={filters.atkMax}
            onBlur={(e) => updateParam('atk_max', e.target.value)}
            className="w-16 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
          />
        </div>
      </div>

      {/* DEF */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">DEF</p>
        <div className="flex items-center gap-2">
          <input
            key={`def_min_${filters.defMin}`}
            type="number"
            min={0}
            placeholder="Min"
            defaultValue={filters.defMin}
            onBlur={(e) => updateParam('def_min', e.target.value)}
            className="w-16 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
          />
          <span className="text-slate-500">–</span>
          <input
            key={`def_max_${filters.defMax}`}
            type="number"
            min={0}
            placeholder="Max"
            defaultValue={filters.defMax}
            onBlur={(e) => updateParam('def_max', e.target.value)}
            className="w-16 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
          />
        </div>
      </div>

      {/* Archétype */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Archétype
        </p>
        <input
          key={`archetype_${filters.archetype}`}
          list="archetypes-list"
          placeholder="Tous les archétypes"
          defaultValue={filters.archetype}
          onBlur={(e) => updateParam('archetype', e.target.value)}
          className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
        />
        <datalist id="archetypes-list">
          {archetypes.map((a) => (
            <option key={a} value={a} />
          ))}
        </datalist>
      </div>

      {/* Banlist TCG */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Banlist TCG
        </p>
        <div className="space-y-1">
          {BAN_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="banTcg"
                value={opt.value}
                checked={filters.banTcg === opt.value}
                onChange={() => updateParam('ban', opt.value)}
                className="accent-amber-500"
              />
              <span className="text-slate-300 group-hover:text-white transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <aside className="w-full md:w-56 shrink-0">
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="md:hidden w-full flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 mb-3"
      >
        <span>Filtres{hasActiveFilters ? ' ·' : ''}</span>
        <span className="text-slate-400">{mobileOpen ? '▲' : '▼'}</span>
      </button>

      {/* Filter content */}
      <div className={`${mobileOpen ? 'block' : 'hidden'} md:block bg-slate-800/50 rounded-lg p-4 border border-slate-700`}>
        {filterContent}
      </div>
    </aside>
  )
}
