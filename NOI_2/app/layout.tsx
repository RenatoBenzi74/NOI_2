import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Noi² – Allenatore di Ascolto Partecipativo',
  description:
    'Una palestra relazionale. Allenati ad ascoltare prima di rispondere. Non ti insegna la risposta giusta — ti aiuta ad accorgerti di quando hai smesso di ascoltare.',
  keywords: ['ascolto', 'comunicazione', 'relazione', 'formazione', 'noi²', 'MCR'],
  authors: [{ name: 'Noi² — Metodo delle Competenze Risonanti' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Noi²',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1e1b4b',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
