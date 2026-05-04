import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { join } from 'path'

dotenv.config({ path: join(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'Erreur : variables manquantes dans .env.local :\n' +
      '  NEXT_PUBLIC_SUPABASE_URL\n' +
      '  SUPABASE_SERVICE_ROLE_KEY',
  )
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

interface YGOCardImage {
  id: number
  image_url: string
  image_url_small: string
  image_url_cropped: string
}

interface YGOCard {
  id: number
  name: string
  type: string
  frameType: string
  desc: string
  atk?: number
  def?: number
  level?: number
  race?: string
  attribute?: string
  archetype?: string
  scale?: number
  linkval?: number
  card_images: YGOCardImage[]
  banlist_info?: {
    ban_tcg?: string
    ban_ocg?: string
    ban_md?: string
  }
}

interface YGOResponse {
  data: YGOCard[]
}

async function fetchAllCards(): Promise<YGOCard[]> {
  console.log('Téléchargement des cartes depuis YGOPRODeck...')
  const res = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?misc=yes')
  if (!res.ok) throw new Error(`Erreur API YGOPRODeck : ${res.status}`)
  const json = (await res.json()) as YGOResponse
  console.log(`${json.data.length} cartes récupérées`)
  return json.data
}

async function fetchFrenchData(): Promise<Map<number, { name: string; desc: string }>> {
  console.log('Téléchargement des noms et textes français...')
  try {
    const res = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?language=fr')
    if (!res.ok) throw new Error(`Erreur API (FR) : ${res.status}`)
    const json = (await res.json()) as YGOResponse
    const map = new Map<number, { name: string; desc: string }>()
    for (const card of json.data) {
      map.set(card.id, { name: card.name, desc: card.desc })
    }
    console.log(`${map.size} traductions françaises récupérées`)
    return map
  } catch (err) {
    console.warn('Échec du fetch français, on continue sans :', err)
    return new Map()
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function importCards(): Promise<void> {
  const [cards, frenchData] = await Promise.all([fetchAllCards(), fetchFrenchData()])

  console.log('Préparation des données...')

  const rows = cards.map((card) => {
    const image = card.card_images[0]
    const isXyz = card.frameType.includes('xyz')
    const isLink = card.frameType === 'link'

    return {
      id: card.id,
      name_en: card.name,
      name_fr: frenchData.get(card.id)?.name ?? null,
      type: card.type,
      frame_type: card.frameType,
      race: card.race ?? null,
      attribute: card.attribute ?? null,
      level: isXyz || isLink ? null : (card.level ?? null),
      rank: isXyz ? (card.level ?? null) : null,
      link_value: card.linkval ?? null,
      pendulum_scale: card.scale ?? null,
      atk: card.atk !== undefined ? card.atk : null,
      def: card.def !== undefined ? card.def : null,
      archetype: card.archetype ?? null,
      desc_en: card.desc ?? null,
      desc_fr: frenchData.get(card.id)?.desc ?? null,
      image_url: image?.image_url ?? null,
      image_url_small: image?.image_url_small ?? null,
      image_url_cropped: image?.image_url_cropped ?? null,
      ban_tcg: card.banlist_info?.ban_tcg ?? null,
      ban_ocg: card.banlist_info?.ban_ocg ?? null,
      ban_md: card.banlist_info?.ban_md ?? null,
    }
  })

  const BATCH_SIZE = 500
  let imported = 0

  console.log(`Import de ${rows.length} cartes par lots de ${BATCH_SIZE}...`)

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    const { error } = await supabase.from('cards').upsert(batch, { onConflict: 'id' })
    if (error) {
      console.error(`Erreur sur le lot ${i}-${i + BATCH_SIZE} :`, error.message)
      throw error
    }
    imported += batch.length
    console.log(`  ${imported}/${rows.length} cartes importées`)
    if (i + BATCH_SIZE < rows.length) await sleep(200)
  }

  console.log('\nImport terminé avec succès !')
}

importCards().catch((err: unknown) => {
  console.error('Erreur fatale :', err)
  process.exit(1)
})
