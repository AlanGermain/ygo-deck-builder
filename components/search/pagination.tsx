'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

interface PaginationProps {
  total: number
  page: number
  pageSize: number
}

export default function Pagination({ total, page, pageSize }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(total / pageSize)

  if (totalPages <= 1) return null

  function goToPage(p: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (p === 1) {
      params.delete('page')
    } else {
      params.set('page', String(p))
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: true })
  }

  // Show up to 7 page buttons
  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('...')
    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-8 flex-wrap" aria-label="Pagination">
      <button
        onClick={() => goToPage(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 rounded text-sm text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ← Précédente
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-slate-500">…</span>
        ) : (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={cn(
              'w-8 h-8 rounded text-sm font-medium transition-colors',
              p === page
                ? 'bg-amber-500 text-slate-900'
                : 'text-slate-300 hover:bg-slate-700',
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => goToPage(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded text-sm text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Suivante →
      </button>
    </nav>
  )
}
