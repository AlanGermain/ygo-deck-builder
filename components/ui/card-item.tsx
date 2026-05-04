import Image from 'next/image'
import { getCardName, getLevelLabel, formatStat } from '@/lib/utils/card-helpers'
import { BAN_STATUS_LABELS } from '@/lib/types/card'
import type { CardSummary } from '@/lib/types/card'

interface CardItemProps {
  card: CardSummary
}

const BAN_COLORS: Record<string, string> = {
  Banned: 'bg-red-600',
  Limited: 'bg-amber-600',
  'Semi-Limited': 'bg-yellow-500',
}

export default function CardItem({ card }: CardItemProps) {
  const name = getCardName(card)
  const levelLabel = getLevelLabel(card)
  const banColor = card.ban_tcg ? BAN_COLORS[card.ban_tcg] : null

  return (
    <div className="group relative flex flex-col gap-1">
      {/* Card image */}
      <div className="relative aspect-[59/86] w-full overflow-hidden rounded-sm bg-slate-800 shadow-md ring-1 ring-slate-700 group-hover:ring-amber-500 transition-all duration-200">
        {card.image_url_small ? (
          <Image
            src={card.image_url_small}
            alt={name}
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 15vw"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
            No image
          </div>
        )}

        {/* Ban badge */}
        {banColor && (
          <span className={`absolute top-1 right-1 text-[9px] font-bold text-white px-1 py-0.5 rounded ${banColor}`}>
            {BAN_STATUS_LABELS[card.ban_tcg ?? ''] ?? card.ban_tcg}
          </span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-slate-900/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 flex flex-col justify-end gap-0.5 text-[10px]">
          {card.attribute && (
            <span className="text-amber-400 font-semibold">{card.attribute}</span>
          )}
          {levelLabel && (
            <span className="text-slate-300">{levelLabel}</span>
          )}
          {(card.atk !== null || card.def !== null) && (
            <span className="text-slate-300">
              ATK {formatStat(card.atk)} / DEF {formatStat(card.def)}
            </span>
          )}
          {card.archetype && (
            <span className="text-slate-400 truncate">{card.archetype}</span>
          )}
        </div>
      </div>

      {/* Card name */}
      <p className="text-[11px] text-slate-300 leading-tight line-clamp-2 group-hover:text-white transition-colors">
        {name}
      </p>
    </div>
  )
}
