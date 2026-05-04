import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4 text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          <span className="text-amber-400">YGO</span>{' '}
          <span className="text-white">Deck Builder</span>
        </h1>
        <p className="text-lg text-slate-300 mb-2 leading-relaxed">
          Recherche, analyse et construis tes decks Yu-Gi-Oh! avec une base de données complète
          en français.
        </p>
        <p className="text-sm text-slate-500 mb-10">
          +14 000 cartes · Filtres avancés · Banlist TCG à jour
        </p>

        <Link
          href="/recherche"
          className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Rechercher des cartes →
        </Link>
      </div>

      <div className="mt-16 flex flex-wrap gap-3 justify-center text-xs text-slate-400">
        {[
          'Noms en français',
          'Filtres par type, attribut, niveau',
          'Filtres ATK / DEF',
          'Banlist TCG',
          'Recherche par archétype',
        ].map((f) => (
          <span
            key={f}
            className="border border-slate-700 rounded-full px-3 py-1 bg-slate-800/50"
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}
