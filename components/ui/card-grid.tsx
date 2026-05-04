import CardItem from './card-item'
import type { CardSummary } from '@/lib/types/card'

interface CardGridProps {
  cards: CardSummary[]
}

export default function CardGrid({ cards }: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-lg mb-2">Aucune carte trouvée</p>
        <p className="text-sm">Essaie d&apos;élargir ta recherche ou de réinitialiser les filtres.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  )
}
