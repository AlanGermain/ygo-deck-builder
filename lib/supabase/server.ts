import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Client serveur simple — pas besoin du wrapper SSR tant qu'il n'y a pas de comptes utilisateurs (Jalon 5)
export async function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
