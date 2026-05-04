# Jalon 1 — Deck Builder YGO en ligne

## Ce qui a été fait

### Infrastructure
- **Next.js 16** (App Router) + **TypeScript strict** + **Tailwind CSS v4**
- **Supabase** : table `cards` avec 14 341 cartes importées (11 661 noms français)
- **pgvector** activé, colonne `embedding VECTOR(1536)` prête pour la recherche sémantique (Jalon 4)
- **Repo GitHub** : https://github.com/AlanGermain/ygo-deck-builder
- **Déploiement Vercel** : https://ygo-deck-builder-orpin.vercel.app

### Pages
- `/` — Page d'accueil avec CTA vers la recherche
- `/recherche` — Page de recherche avec filtres complets

### Fonctionnalités de la page /recherche
- Barre de recherche par nom (debounce 300ms, FR + EN)
- Filtres latéraux :
  - Catégorie (Monstre / Magie / Piège)
  - Sous-type monstre (Normal, Effet, Rituel, Fusion, Synchro, Xyz, Lien, Pendule)
  - Attribut (DARK, LIGHT, WATER, FIRE, EARTH, WIND, DIVINE)
  - Niveau / Rang / Link (min/max)
  - ATK (min/max)
  - DEF (min/max)
  - Archétype (dropdown avec recherche)
  - Banlist TCG (Tous / Autorisée / Semi-Limitée / Limitée / Interdite)
- Grille de résultats avec image + overlay au survol (attribut, niveau, ATK/DEF, archétype)
- Pagination (24 cartes par page)
- État de chargement (skeleton)
- URL partageable : tous les filtres sont dans les query params

### Architecture technique
- Recherche 100% serveur (Server Components Next.js + Supabase)
- URL comme source de vérité pour l'état des filtres
- Index PostgreSQL trigram pour la recherche par nom rapide
- Design mobile-first, thème sombre

## Relancer le projet en local

```bash
# 1. Cloner le repo
git clone https://github.com/AlanGermain/ygo-deck-builder.git
cd ygo-deck-builder

# 2. Installer les dépendances
npm install

# 3. Créer .env.local à la racine avec les clés Supabase
NEXT_PUBLIC_SUPABASE_URL=https://torjeauzdarnpildghan.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

# 4. Lancer le serveur de développement
npm run dev
# → http://localhost:3000
```

## Re-importer les cartes (si besoin)

```bash
npm run import-cards
```

Le script fetch YGOPRODeck (EN + FR) et upsert dans Supabase. Durée : ~3-5 min.

## Prochaines étapes — Jalon 2 : Builder de deck

### Fonctionnalités prévues
- Page `/deck/nouveau` pour créer un deck
- Sélection de cartes depuis la recherche → ajout au deck
- Gestion des zones : Main Deck, Extra Deck, Side Deck
- Compteurs (40-60 cartes main, max 15 extra/side)
- Sauvegarde locale (localStorage) en attendant les comptes utilisateurs (Jalon 5)
- Export texte / liste YDK

### Jalons suivants
- **Jalon 3** — Tags de rôle sur les cartes (moteur, brique, garnissage...)
- **Jalon 4** — Recherche sémantique avec pgvector (OpenAI embeddings)
- **Jalon 5** — Comptes utilisateurs (Supabase Auth), decks sauvegardés en base
- **Jalon 6** — Support multi-formats (OCG, Master Duel, Goat, Edison)
