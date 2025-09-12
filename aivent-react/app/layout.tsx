import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AIvent - AI Event, Conference and Meetup Website',
  description: 'Join thought leaders, developers, researchers, and founders as we explore how artificial intelligence is reshaping industries, creativity, and the future of work.',
  keywords: 'AI, artificial intelligence, conference, summit, technology, innovation, machine learning',
  authors: [{ name: 'AIvent Team' }],
  openGraph: {
    title: 'AIvent - AI Summit 2025',
    description: 'The Future of Intelligence - AI Summit 2025',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIvent - AI Summit 2025',
    description: 'The Future of Intelligence - AI Summit 2025',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} bg-dark-900 text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
