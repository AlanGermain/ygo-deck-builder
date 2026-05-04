'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useRef } from 'react'

interface SearchBarProps {
  defaultValue: string
}

export default function SearchBar({ defaultValue }: SearchBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (newValue.trim()) {
        params.set('q', newValue.trim())
      } else {
        params.delete('q')
      }
      params.delete('page')
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, 300)
  }

  return (
    <div className="relative">
      <input
        type="search"
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder="Rechercher une carte par nom..."
        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 pl-11 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
        autoComplete="off"
        spellCheck={false}
      />
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>
    </div>
  )
}
