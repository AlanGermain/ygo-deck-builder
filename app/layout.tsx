import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'YGO Deck Builder',
    template: '%s | YGO Deck Builder',
  },
  description:
    'Recherche de cartes Yu-Gi-Oh! en français : filtres avancés, banlist, archétypes. Le meilleur outil pour construire ton deck.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} h-full`}>
      <body className="flex flex-col min-h-full antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
