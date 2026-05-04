import type { CardSummary } from '@/lib/types/card'

export function getCardName(card: Pick<CardSummary, 'name_en' | 'name_fr'>): string {
  return card.name_fr ?? card.name_en
}

export function getCardLevel(card: Pick<CardSummary, 'level' | 'rank' | 'link_value'>): number | null {
  if (card.link_value !== null) return card.link_value
  if (card.rank !== null) return card.rank
  return card.level
}

export function getLevelLabel(card: Pick<CardSummary, 'level' | 'rank' | 'link_value'>): string {
  if (card.link_value !== null) return `LIEN-${card.link_value}`
  if (card.rank !== null) return `Rang ${card.rank}`
  if (card.level !== null) return `Niv. ${card.level}`
  return ''
}

export function formatStat(value: number | null): string {
  if (value === null) return '?'
  return value.toString()
}

export function isMonster(frameType: string): boolean {
  return frameType !== 'spell' && frameType !== 'trap' && frameType !== 'token'
}

export function getFrameTypeCategory(frameType: string): 'monster' | 'spell' | 'trap' | 'token' {
  if (frameType === 'spell') return 'spell'
  if (frameType === 'trap') return 'trap'
  if (frameType === 'token') return 'token'
  return 'monster'
}
