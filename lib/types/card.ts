export type GameFormat = 'TCG' | 'OCG' | 'MD' | 'Goat' | 'Edison'

export type BanStatus = 'Banned' | 'Limited' | 'Semi-Limited' | null

export interface Card {
  id: number
  name_en: string
  name_fr: string | null
  type: string
  frame_type: string
  race: string | null
  attribute: string | null
  level: number | null
  rank: number | null
  link_value: number | null
  pendulum_scale: number | null
  atk: number | null
  def: number | null
  archetype: string | null
  desc_en: string | null
  desc_fr: string | null
  image_url: string | null
  image_url_small: string | null
  image_url_cropped: string | null
  ban_tcg: BanStatus
  ban_ocg: BanStatus
  ban_md: BanStatus
  created_at: string
  updated_at: string
}

export type CardSummary = Pick<
  Card,
  | 'id'
  | 'name_en'
  | 'name_fr'
  | 'type'
  | 'frame_type'
  | 'attribute'
  | 'level'
  | 'rank'
  | 'link_value'
  | 'atk'
  | 'def'
  | 'ban_tcg'
  | 'image_url_small'
  | 'archetype'
  | 'race'
>

export const CARD_ATTRIBUTES = [
  'DARK',
  'LIGHT',
  'WATER',
  'FIRE',
  'EARTH',
  'WIND',
  'DIVINE',
] as const
export type CardAttribute = (typeof CARD_ATTRIBUTES)[number]

export const MONSTER_FRAME_TYPES = [
  'normal',
  'effect',
  'ritual',
  'fusion',
  'synchro',
  'xyz',
  'link',
  'normal_pendulum',
  'effect_pendulum',
  'ritual_pendulum',
  'fusion_pendulum',
  'synchro_pendulum',
  'xyz_pendulum',
] as const

export const FRAME_TYPE_LABELS: Record<string, string> = {
  normal: 'Normal',
  effect: 'Effet',
  ritual: 'Rituel',
  fusion: 'Fusion',
  synchro: 'Synchro',
  xyz: 'Xyz',
  link: 'Lien',
  normal_pendulum: 'Pendule Normal',
  effect_pendulum: 'Pendule Effet',
  ritual_pendulum: 'Pendule Rituel',
  fusion_pendulum: 'Pendule Fusion',
  synchro_pendulum: 'Pendule Synchro',
  xyz_pendulum: 'Pendule Xyz',
  spell: 'Magie',
  trap: 'Piège',
  token: 'Jeton',
}

export const BAN_STATUS_LABELS: Record<string, string> = {
  Banned: 'Interdite',
  Limited: 'Limitée',
  'Semi-Limited': 'Semi-Limitée',
}
