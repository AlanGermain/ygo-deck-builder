import type { Card } from './card'

type CardInsert = Omit<Card, 'created_at' | 'updated_at'> & {
  created_at?: string
  updated_at?: string
}

type CardUpdate = Partial<Omit<Card, 'id' | 'created_at' | 'updated_at'>>

export type Database = {
  public: {
    Tables: {
      cards: {
        Row: Card
        Insert: CardInsert
        Update: CardUpdate
      }
    }
    Views: Record<string, never>
    Functions: {
      get_archetypes: {
        Args: Record<string, never>
        Returns: Array<{ archetype: string }>
      }
    }
    Enums: Record<string, never>
  }
}
