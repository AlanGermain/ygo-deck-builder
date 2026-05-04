import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-amber-400 font-bold text-lg tracking-tight hover:text-amber-300 transition-colors">
          YGO Deck Builder
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Accueil
          </Link>
          <Link
            href="/recherche"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Recherche
          </Link>
        </nav>
      </div>
    </header>
  )
}
