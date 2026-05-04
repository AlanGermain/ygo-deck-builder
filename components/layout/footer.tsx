export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-slate-500">
        <p>
          Données fournies par{' '}
          <a
            href="https://ygoprodeck.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500 hover:text-amber-400 transition-colors"
          >
            YGOPRODeck
          </a>
          . Yu-Gi-Oh! est une marque de Konami.
        </p>
      </div>
    </footer>
  )
}
